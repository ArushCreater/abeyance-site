/**
 * The decision pipeline: hard rules → risk score → decision.
 * Pure orchestration; the scorer, explainer and approver routing are injected.
 */
import type {
  Action,
  Allowance,
  Approver,
  Decision,
  DecisionOutcome,
  EnforcementMode,
  Policy,
  ReasonCode,
  RiskScore,
} from "../types";
import type { Explainer } from "./explainer";
import { makeId } from "./random";
import { extractAmounts, recipientsOf, runHardRules } from "./rules";
import type { RiskScorer } from "./scorer";

export interface EngineDeps {
  scorer: RiskScorer;
  /** Optional: the server streams explanations separately, after deciding. */
  explainer?: Explainer;
  routeApprover: (action: Action, policy: Policy) => Approver;
}

export interface EvaluateOptions {
  now?: Date;
  mode?: EnforcementMode;
  simulateLatency?: boolean;
  /** What the risk model is allowed to see (e.g. with personal data removed). Rules always see the real action. */
  scoringView?: Action;
}

/** Map a scored action to an outcome using the policy's thresholds. */
export function classify(
  risk: RiskScore,
  thresholds: Policy["thresholds"],
): { outcome: DecisionOutcome; reasonCode: ReasonCode } {
  if (risk.value >= thresholds.block) return { outcome: "BLOCK", reasonCode: "RISK_ABOVE_BLOCK" };
  if (risk.value >= thresholds.hold) return { outcome: "HOLD", reasonCode: "RISK_ABOVE_HOLD" };
  // Uncertain and not trivially safe → a person should look.
  if (risk.confidence < thresholds.minConfidence && risk.value >= thresholds.hold * 0.6) {
    return { outcome: "HOLD", reasonCode: "LOW_CONFIDENCE" };
  }
  return { outcome: "ALLOW", reasonCode: "RISK_BELOW_HOLD" };
}

const REASONS: Record<ReasonCode, (d: { risk: RiskScore | null; detail?: string }) => string> = {
  RISK_BELOW_HOLD: ({ risk }) => `risk ${risk?.value.toFixed(2)} below hold threshold`,
  RISK_ABOVE_HOLD: ({ risk }) => `risk ${risk?.value.toFixed(2)} at or above hold threshold`,
  RISK_ABOVE_BLOCK: ({ risk }) => `risk ${risk?.value.toFixed(2)} at or above block threshold`,
  LOW_CONFIDENCE: ({ risk }) => `confidence ${risk?.confidence.toFixed(2)} below minimum`,
  RULE_HOLD: ({ detail }) => `hard rule: ${detail}`,
  RULE_BLOCK: ({ detail }) => `hard rule: ${detail}`,
  SCORER_UNAVAILABLE: ({ detail }) => `risk model unavailable (${detail ?? "error"}); held for review`,
  ALLOWANCE: ({ risk, detail }) => `allowance “${detail}” covers risk ${risk?.value.toFixed(2)}`,
  AGENT_PAUSED: ({ detail }) => `agent paused: ${detail}`,
  WORKSPACE_FROZEN: ({ detail }) => `all agents frozen: ${detail}`,
};

/** Does a human-approved allowance cover this action? Plain code, like the hard rules. */
export function allowanceMatches(a: Allowance, action: Action, risk: RiskScore): boolean {
  if (a.agentId && a.agentId !== action.agent.id) return false;
  if (risk.value > a.maxRisk) return false;
  const maxMentioned = Math.max(0, ...extractAmounts(action));
  if (a.maxAmount !== null && maxMentioned > a.maxAmount) return false;
  if (a.customerOfRecordOnly) {
    const email = action.context.customer?.email?.toLowerCase();
    const recipients = recipientsOf(action).map((r) => r.toLowerCase());
    if (!email || recipients.length === 0 || recipients.some((r) => r !== email)) return false;
  }
  return true;
}

export async function evaluate(
  action: Action,
  policy: Policy,
  deps: EngineDeps,
  opts: EvaluateOptions = {},
): Promise<Decision> {
  const now = opts.now ?? new Date();
  const mode = opts.mode ?? "enforce";
  const rules = runHardRules(action, policy, now);
  const ruleLatency = 2;

  const base = {
    id: makeId("dec"),
    actionId: action.id,
    rules,
    mode,
  };

  // 1. A blocking hard rule short-circuits: no model call needed.
  const blocking = rules.find((r) => !r.passed && r.effect === "BLOCK");
  if (blocking) {
    return {
      ...base,
      outcome: "BLOCK",
      risk: null,
      reasonCode: "RULE_BLOCK",
      reason: REASONS.RULE_BLOCK({ risk: null, detail: blocking.detail }),
      decidedAt: new Date(now.getTime() + ruleLatency).toISOString(),
      latencyMs: ruleLatency,
    };
  }

  // 2. Score the action. If the model is unavailable, fail closed: hold it.
  let risk: RiskScore;
  try {
    risk = await deps.scorer.score(opts.scoringView ?? action, { simulateLatency: opts.simulateLatency });
  } catch (err) {
    const detail = err instanceof Error ? err.message.slice(0, 120) : "error";
    const decision: Decision = {
      ...base,
      outcome: "HOLD",
      risk: null,
      reasonCode: "SCORER_UNAVAILABLE",
      reason: REASONS.SCORER_UNAVAILABLE({ risk: null, detail }),
      decidedAt: new Date().toISOString(),
      latencyMs: Date.now() - now.getTime(),
      approver: deps.routeApprover(action, policy),
      holdExpiresAt: new Date(now.getTime() + policy.holdTimeoutSec * 1000).toISOString(),
    };
    return decision;
  }
  let { outcome, reasonCode } = classify(risk, policy.thresholds);
  let detail: string | undefined;

  // 3. Allowances: a human-approved exception can release a risk-based hold.
  //    Never a rule-based hold, never a block.
  let allowanceId: string | undefined;
  if (outcome === "HOLD" && (reasonCode === "RISK_ABOVE_HOLD" || reasonCode === "LOW_CONFIDENCE")) {
    const match = policy.allowances?.find((a) => allowanceMatches(a, action, risk));
    if (match) {
      outcome = "ALLOW";
      reasonCode = "ALLOWANCE";
      detail = match.label;
      allowanceId = match.id;
    }
  }

  // 4. A holding hard rule escalates ALLOW to HOLD (never downgrades BLOCK).
  const holding = rules.find((r) => !r.passed && r.effect === "HOLD");
  if (holding && outcome === "ALLOW") {
    outcome = "HOLD";
    reasonCode = "RULE_HOLD";
    detail = holding.detail;
    allowanceId = undefined;
  }

  const latencyMs = ruleLatency + risk.latencyMs;
  const decidedAt = new Date(now.getTime() + latencyMs).toISOString();
  const decision: Decision = {
    ...base,
    outcome,
    risk,
    reasonCode,
    reason: REASONS[reasonCode]({ risk, detail }),
    decidedAt,
    latencyMs,
    ...(allowanceId ? { allowanceId } : {}),
  };

  // 5. Exception path only: explanation + routing + timeout (default deny).
  if (outcome === "HOLD") {
    if (deps.explainer) decision.explanation = await deps.explainer.explain(action, risk, rules);
    decision.approver = deps.routeApprover(action, policy);
    decision.holdExpiresAt = new Date(now.getTime() + policy.holdTimeoutSec * 1000).toISOString();
  }

  return decision;
}
