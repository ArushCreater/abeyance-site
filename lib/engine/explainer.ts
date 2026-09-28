/**
 * Exception-path explainer. In production an LLM writes the plain-English
 * "why this was held" for the approver card; it only runs on HOLD.
 * The mock composes it from the scorer's strongest evidence.
 */
import type { Action, RiskScore, RuleResult } from "../types";

export interface Explainer {
  explain(action: Action, risk: RiskScore | null, rules: RuleResult[]): Promise<string>;
}

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export class MockExplainer implements Explainer {
  async explain(action: Action, risk: RiskScore | null, rules: RuleResult[]): Promise<string> {
    const failed = rules.filter((r) => !r.passed);
    const top = (risk?.factors ?? [])
      .filter((f) => f.key !== "irreversibility" && f.value >= 0.3)
      .sort((a, b) => b.value - a.value)
      .slice(0, 2);

    const who = action.context.customer
      ? `${action.context.customer.name}${action.context.customer.tier !== "standard" ? ` (${action.context.customer.tier} customer)` : ""}`
      : "the affected records";

    const parts = [`${action.agent.name} wants to ${lowerFirst(action.summary)}, acting for ${action.onBehalfOf.name}.`];

    if (failed.length) {
      parts.push(`A hard rule asks for review: ${lowerFirst(failed[0].detail)}.`);
    }
    if (top.length) {
      const irreversibility = risk?.factors.find((f) => f.key === "irreversibility");
      parts.push(
        `The strongest signals: ${top.map((f) => lowerFirst(f.note)).join("; ")}. This affects ${who}${irreversibility ? `, and ${lowerFirst(irreversibility.note)}` : ""}.`,
      );
    }
    if (risk && risk.confidence < 0.72) {
      parts.push("The risk model is less certain than usual about this one, so a person should look.");
    }
    parts.push("Approve if this matches what was agreed; deny and the agent gets the reason back.");
    return parts.join(" ");
  }
}
