/**
 * Risk scoring interface.
 *
 * Production: Jev (TypeSafe's System One model), which returns typed,
 * calibrated scores in ~70–500 ms. We don't have API access yet, so
 * MockJevScorer below approximates its behaviour with transparent
 * heuristics. Swap it by implementing RiskScorer.
 */
import type { Action, RiskFactor, RiskFactorKey, RiskScore, ToolName } from "../types";
import { createRng } from "./random";
import { domainOf, extractAmounts, recipientsOf } from "./rules";

export interface RiskScorer {
  readonly model: string;
  score(action: Action, opts?: { simulateLatency?: boolean }): Promise<RiskScore>;
}

export const FACTOR_LABELS: Record<RiskFactorKey, string> = {
  irreversibility: "Irreversibility",
  blast_radius: "Blast radius",
  data_sensitivity: "Data sensitivity",
  anomaly: "Unusual for this agent",
  external_commitment: "External commitment",
  recipient: "Recipient",
};

const IRREVERSIBILITY: Record<ToolName, [number, string]> = {
  "email.send": [0.9, "Email can't be recalled once delivered"],
  "ticket.close": [0.55, "Closing notifies the customer and ends the SLA clock"],
  "crm.update": [0.45, "Overwrites the previous value"],
  "crm.delete": [1, "Deletes the record"],
  "ticket.update": [0.15, "Internal and editable"],
  "crm.create": [0.15, "New record, easily removed"],
};

const COMMITMENT_TERMS = [
  "refund",
  "reimburse",
  "compensat",
  "waive",
  "guarantee",
  "we will",
  "we'll",
  "credit",
  "in full",
  "settle",
  "liab",
  "our fault",
  "admit",
  "backdate",
];

const SENSITIVE_PATTERNS: [RegExp, string][] = [
  [/\b\d{3}\s?\d{3}\s?\d{3}\b/, "a tax file number"],
  [/\bBSB\b|\baccount number\b|bank_account/i, "bank details"],
  [/\bdate of birth\b|\bDOB\b/i, "a date of birth"],
  [/medical|diagnos|medicare|health/i, "health information"],
  [/beneficiar|policy_owner|payee/i, "ownership or payee details"],
];

const INTERNAL_DOMAINS = ["halcyon.example"];
const SENSITIVE_DOMAINS = ["regulator.example", "press.example", "complaints-authority.example"];

/** Tools each demo agent normally uses — a stand-in for Jev's per-agent baseline. */
const AGENT_BASELINE: Record<string, ToolName[]> = {
  "claims-assist": ["email.send", "ticket.update", "ticket.close", "crm.update"],
  "support-triage": ["ticket.update", "ticket.close", "email.send"],
  "renewals-outreach": ["email.send", "crm.update", "crm.create"],
  "kyc-ops": ["crm.update", "crm.create", "ticket.update"],
  "crm-hygiene": ["crm.update", "crm.create"],
};

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const textOf = (action: Action) => JSON.stringify(action.args).toLowerCase();

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function computeFactors(action: Action): RiskFactor[] {
  const text = textOf(action);
  const amounts = extractAmounts(action);
  const maxAmount = Math.max(0, ...amounts);
  const recipients = recipientsOf(action);
  const flags = action.context.flags ?? [];

  const [irr, irrNote] = IRREVERSIBILITY[action.tool];

  const n = action.context.recordsAffected ?? Math.max(1, recipients.length);
  const blast = clamp(Math.log10(n) / 3 + (action.context.customer?.tier === "strategic" ? 0.15 : 0));

  const sensitiveHits = SENSITIVE_PATTERNS.filter(([re]) => re.test(text)).map(([, label]) => label);
  const sensitivity = clamp(
    sensitiveHits.length * 0.38 +
      (flags.includes("vulnerable-customer") ? 0.35 : 0) +
      (flags.includes("idr-window") ? 0.5 : 0),
  );

  const usual = AGENT_BASELINE[action.agent.id] ?? [];
  const unusualTool = !usual.includes(action.tool);
  const anomaly = clamp((unusualTool ? 0.7 : 0.06) + (flags.includes("first-of-kind") ? 0.45 : 0));

  const commitmentHits = COMMITMENT_TERMS.filter((t) => text.includes(t));
  const commitment = clamp(
    commitmentHits.length * 0.22 + (maxAmount > 0 ? 0.12 + Math.min(0.4, maxAmount / 12000) : 0),
  );

  const external = recipients.filter((r) => !INTERNAL_DOMAINS.includes(domainOf(r)));
  const sensitiveRecipient = recipients.some((r) => SENSITIVE_DOMAINS.includes(domainOf(r)));
  const unknownRecipient = external.some(
    (r) => r.toLowerCase() !== action.context.customer?.email.toLowerCase(),
  );
  const recipient = clamp(
    (sensitiveRecipient ? 0.85 : 0) +
      (unknownRecipient ? 0.45 : 0) +
      (external.length > 0 ? 0.08 : 0) +
      (flags.includes("complaint") ? 0.5 : 0),
  );

  const note = {
    blast:
      n > 1
        ? `Touches ${n.toLocaleString("en-AU")} ${recipients.length > 1 ? "recipients" : "records"}`
        : action.context.customer
          ? `One ${action.context.customer.tier} customer`
          : "Single record",
    sensitivity: sensitiveHits.length
      ? `Contains ${sensitiveHits.join(" and ")}`
      : flags.includes("idr-window")
        ? "Complaint is inside its regulated response window"
        : flags.includes("vulnerable-customer")
        ? "Customer is flagged as vulnerable"
        : "No sensitive fields detected",
    anomaly: unusualTool
      ? `${action.agent.name} doesn't normally call ${action.tool}`
      : flags.includes("first-of-kind")
        ? "First action of this kind from this agent"
        : "Consistent with this agent's history",
    commitment:
      commitmentHits.length || maxAmount
        ? [
            maxAmount ? `Mentions ${new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(maxAmount)}` : "",
            commitmentHits.length ? `uses “${commitmentHits.slice(0, 2).join("”, “")}”` : "",
          ]
            .filter(Boolean)
            .join(" and ")
        : "No promises or monetary terms",
    recipient: sensitiveRecipient
      ? "Recipient is a regulator, media or complaints body"
      : unknownRecipient
        ? "Recipient isn't the customer of record"
        : flags.includes("complaint")
          ? "Customer has an open complaint"
          : external.length
            ? "Customer of record"
            : recipients.length
              ? "Internal recipient"
              : "No external recipient",
  };

  return [
    { key: "irreversibility", label: FACTOR_LABELS.irreversibility, value: irr, note: irrNote },
    { key: "external_commitment", label: FACTOR_LABELS.external_commitment, value: commitment, note: note.commitment },
    { key: "recipient", label: FACTOR_LABELS.recipient, value: recipient, note: note.recipient },
    { key: "data_sensitivity", label: FACTOR_LABELS.data_sensitivity, value: sensitivity, note: note.sensitivity },
    { key: "blast_radius", label: FACTOR_LABELS.blast_radius, value: blast, note: note.blast },
    { key: "anomaly", label: FACTOR_LABELS.anomaly, value: anomaly, note: note.anomaly },
  ];
}

/**
 * Combine factors: irreversibility scales the consequence of everything else,
 * so a routine email (irreversible but harmless) still scores low.
 */
export function combine(factors: RiskFactor[]): number {
  const get = (k: RiskFactorKey) => factors.find((f) => f.key === k)?.value ?? 0;
  const weights: [RiskFactorKey, number][] = [
    ["external_commitment", 0.85],
    ["recipient", 0.7],
    ["data_sensitivity", 0.75],
    ["blast_radius", 0.8],
    ["anomaly", 0.55],
  ];
  const consequence = 1 - weights.reduce((acc, [k, w]) => acc * (1 - w * get(k)), 1);
  return clamp(Math.pow(get("irreversibility"), 0.35) * consequence);
}

export class MockJevScorer implements RiskScorer {
  readonly model = "jev-mock-0.1";

  async score(action: Action, opts: { simulateLatency?: boolean } = {}): Promise<RiskScore> {
    const result = this.scoreSync(action);
    if (opts.simulateLatency) await new Promise((r) => setTimeout(r, result.latencyMs));
    return result;
  }

  /** Synchronous path used for seeding and policy impact previews. */
  scoreSync(action: Action): RiskScore {
    const rng = createRng(hashString(action.id));
    const factors = computeFactors(action);
    const raw = combine(factors);
    const value = clamp(raw + (rng() - 0.5) * 0.04);

    // Calibrated-ish: confident at the extremes, less sure in the middle,
    // and less sure when signals disagree.
    const spread = Math.max(...factors.map((f) => f.value)) - Math.min(...factors.map((f) => f.value));
    const extremity = Math.abs(value - 0.5) * 2;
    const confidence = clamp(0.64 + 0.32 * extremity - 0.08 * (spread > 0.6 && value > 0.3 ? 1 : 0) + (rng() - 0.5) * 0.05);

    // Mostly fast, occasionally slow: ~70–500 ms.
    const latencyMs = Math.round(70 + 430 * Math.pow(rng(), 2.6));

    return { value, confidence, factors, model: this.model, latencyMs };
  }
}
