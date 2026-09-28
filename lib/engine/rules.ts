/**
 * Deterministic hard rules. Plain code only — money, dates and audit
 * logic never go through a model.
 */
import type { Action, HardRule, Policy, RuleResult } from "../types";

const MONEY_RE = /(?:A?\$|AUD\s?)\s?(\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,2})?/gi;

/** Every monetary amount mentioned in the action's string args or numeric `amount` fields. */
export function extractAmounts(action: Action): number[] {
  const amounts: number[] = [];
  const visit = (value: unknown, key?: string) => {
    if (typeof value === "string") {
      for (const m of value.matchAll(MONEY_RE)) {
        amounts.push(Number(m[1].replace(/,/g, "")));
      }
    } else if (typeof value === "number" && key && /amount|refund|credit/i.test(key)) {
      amounts.push(value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => visit(v));
    } else if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) visit(v, k);
    }
  };
  visit(action.args);
  return amounts;
}

export function recipientsOf(action: Action): string[] {
  const { to, cc, bcc } = action.args as { to?: unknown; cc?: unknown; bcc?: unknown };
  return [to, cc, bcc]
    .flatMap((v) => (Array.isArray(v) ? v : v ? [v] : []))
    .filter((v): v is string => typeof v === "string");
}

export const domainOf = (address: string) => address.split("@")[1]?.toLowerCase() ?? "";

const formatAud = (n: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);

/** Minutes since midnight + weekday in the given IANA timezone. */
function localClock(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
    day: days.indexOf(get("weekday")),
  };
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

function evaluateRule(rule: HardRule, action: Action, now: Date): RuleResult {
  const base = { ruleId: rule.id, kind: rule.kind, label: rule.label };
  const fail = (detail: string): RuleResult => ({ ...base, passed: false, effect: rule.effect, detail });
  const pass = (detail: string): RuleResult => ({ ...base, passed: true, detail });

  switch (rule.kind) {
    case "spending_cap": {
      const max = Math.max(0, ...extractAmounts(action));
      if (max > rule.maxAmount) {
        return fail(`Mentions ${formatAud(max)}, above the ${formatAud(rule.maxAmount)} cap`);
      }
      return pass(max > 0 ? `Largest amount ${formatAud(max)} is within cap` : "No monetary amounts");
    }
    case "recipient_allowlist": {
      const recipients = recipientsOf(action);
      const customerEmail = action.context.customer?.email.toLowerCase();
      const outside = recipients.filter((r) => {
        if (rule.allowCustomerOfRecord && r.toLowerCase() === customerEmail) return false;
        return !rule.domains.includes(domainOf(r));
      });
      if (outside.length > 0) {
        return fail(`${outside.length} recipient${outside.length > 1 ? "s" : ""} not on allowlist: ${outside.slice(0, 2).join(", ")}`);
      }
      return pass(recipients.length ? "All recipients allowlisted" : "No recipients");
    }
    case "blocked_action":
      return rule.tools.includes(action.tool)
        ? fail(`${action.tool} is not permitted for agents`)
        : pass(`${action.tool} is permitted`);
    case "business_hours": {
      if (rule.appliesTo === "campaign" && !action.context.campaign) {
        return pass("Not a campaign send");
      }
      const { minutes, day } = localClock(now, rule.timezone);
      const inHours =
        rule.days.includes(day) && minutes >= toMinutes(rule.start) && minutes < toMinutes(rule.end);
      return inHours
        ? pass(`Within ${rule.start}–${rule.end} ${rule.timezone.split("/")[1]}`)
        : fail(`Outside ${rule.start}–${rule.end} ${rule.timezone.split("/")[1]} business hours`);
    }
    case "max_records": {
      const n = action.context.recordsAffected ?? 1;
      return n > rule.max
        ? fail(`Touches ${n.toLocaleString("en-AU")} records, max ${rule.max}`)
        : pass(`Touches ${n.toLocaleString("en-AU")} record${n === 1 ? "" : "s"}`);
    }
  }
}

export function runHardRules(action: Action, policy: Policy, now: Date): RuleResult[] {
  return policy.hardRules.map((rule) => evaluateRule(rule, action, now));
}
