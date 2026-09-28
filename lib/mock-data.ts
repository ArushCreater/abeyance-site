/**
 * Single source of mock data for the demo.
 *
 * Everything here is EXAMPLE DATA for a fictional tenant ("Halcyon Mutual").
 * People, customers and addresses are invented; email domains use the
 * reserved *.example TLD. To move to a real API, replace the exports of this
 * module (and `engine`) with fetchers that return the same types.
 */
import { evaluate, type EngineDeps } from "./engine/evaluate";
import { MockExplainer } from "./engine/explainer";
import { append, decisionEntry, resolutionEntry } from "./engine/ledger";
import { between, createRng, int, makeId, pick, type Rng, weighted } from "./engine/random";
import { MockJevScorer } from "./engine/scorer";
import type {
  Action,
  ActionCategory,
  ActionContext,
  AgentIdentity,
  Approver,
  Customer,
  DecisionRecord,
  LedgerEntry,
  Policy,
  Principal,
  ShadowCatch,
  ShadowDay,
  ShadowReport,
  ShadowToolBreakdown,
  ToolName,
} from "./types";

export const EXAMPLE_DATA_LABEL = "Example data";

export const TENANT = {
  name: "Halcyon Mutual",
  note: "Fictional demo tenant",
  timezone: "Australia/Sydney",
} as const;

/* ------------------------------------------------------------------ */
/* People & systems                                                    */
/* ------------------------------------------------------------------ */

export const AGENTS: Record<string, AgentIdentity> = {
  "claims-assist": { id: "claims-assist", name: "Claims assistant", team: "Claims", framework: "langgraph" },
  "support-triage": { id: "support-triage", name: "Support triage", team: "Support", framework: "openai-agents" },
  "renewals-outreach": { id: "renewals-outreach", name: "Renewals outreach", team: "Renewals", framework: "langgraph" },
  "kyc-ops": { id: "kyc-ops", name: "KYC operations", team: "Compliance", framework: "mcp-gateway" },
  "crm-hygiene": { id: "crm-hygiene", name: "CRM hygiene", team: "Data", framework: "mcp-gateway" },
};

export const PRINCIPALS: Record<string, Principal> = {
  "p.raman": { id: "p.raman", name: "Priya Raman", role: "Claims officer" },
  "l.nguyen": { id: "l.nguyen", name: "Linh Nguyen", role: "Support specialist" },
  "o.fitzgerald": { id: "o.fitzgerald", name: "Owen Fitzgerald", role: "Renewals manager" },
  "a.haddad": { id: "a.haddad", name: "Amira Haddad", role: "KYC analyst" },
  "svc.nightly": { id: "svc.nightly", name: "Nightly data job", role: "Service account" },
};

export const APPROVERS: Record<string, Approver> = {
  "a.okafor": { id: "a.okafor", name: "Maya Okafor", role: "Team lead, Claims", channel: "slack" },
  "a.lui": { id: "a.lui", name: "Jonah Lui", role: "Team lead, Support", channel: "teams" },
  "a.dimitriou": { id: "a.dimitriou", name: "Eleni Dimitriou", role: "Relationship manager", channel: "slack" },
  "a.whitford": { id: "a.whitford", name: "Sam Whitford", role: "Compliance officer", channel: "console" },
  you: { id: "you", name: "You", role: "Demo approver", channel: "console" },
};

export const CURRENT_APPROVER = APPROVERS.you;

export const CUSTOMERS: Customer[] = [
  { id: "C-20417", name: "Dana Whitlock", email: "dana.whitlock@example.com", tier: "strategic", ownerId: "a.okafor" },
  { id: "C-11873", name: "Tomasz Brennan", email: "t.brennan@example.net", tier: "standard", ownerId: "a.lui" },
  { id: "C-30952", name: "Mereana Hale", email: "mereana.hale@example.org", tier: "priority", ownerId: "a.okafor" },
  { id: "C-44120", name: "Ravi Chandrasekar", email: "ravi.c@example.com", tier: "standard", ownerId: "a.lui" },
  { id: "C-50731", name: "Sophie Arkwright", email: "s.arkwright@example.net", tier: "priority", ownerId: "a.dimitriou" },
  { id: "C-61208", name: "Kieran Vo", email: "kieran.vo@example.org", tier: "standard", ownerId: "a.dimitriou" },
  { id: "C-72945", name: "Lam Family Trust", email: "accounts@lamfamily.example", tier: "strategic", ownerId: "a.okafor" },
];

const TEAM_LEAD: Record<string, string> = {
  Claims: "a.okafor",
  Support: "a.lui",
  Renewals: "a.dimitriou",
  Compliance: "a.whitford",
  Data: "a.lui",
};

/* ------------------------------------------------------------------ */
/* Policies                                                            */
/* ------------------------------------------------------------------ */

const SYDNEY_HOURS = {
  kind: "business_hours" as const,
  timezone: "Australia/Sydney",
  start: "08:00",
  end: "20:00",
  days: [1, 2, 3, 4, 5],
};

export const POLICIES: Policy[] = [
  {
    id: "pol_email_send",
    tool: "email.send",
    label: "Customer email",
    description: "Outbound email from any agent to customers, brokers or third parties.",
    enabled: true,
    hardRules: [
      { id: "r_email_cap", kind: "spending_cap", label: "Monetary cap", maxAmount: 5000, currency: "AUD", effect: "BLOCK" },
      {
        id: "r_email_allow",
        kind: "recipient_allowlist",
        label: "Recipient allowlist",
        domains: ["halcyon.example"],
        allowCustomerOfRecord: true,
        effect: "HOLD",
      },
      { id: "r_email_hours", label: "Campaign hours", appliesTo: "campaign", effect: "HOLD", ...SYDNEY_HOURS },
    ],
    thresholds: { hold: 0.5, block: 0.92, minConfidence: 0.72 },
    approverRoute: "customer_owner",
    holdTimeoutSec: 900,
    onTimeout: "deny",
  },
  {
    id: "pol_ticket_close",
    tool: "ticket.close",
    label: "Close ticket",
    description: "Closing a support or claims ticket, which notifies the customer.",
    enabled: true,
    hardRules: [{ id: "r_close_bulk", kind: "max_records", label: "Bulk close limit", max: 25, effect: "BLOCK" }],
    thresholds: { hold: 0.5, block: 0.92, minConfidence: 0.7 },
    approverRoute: "team_lead",
    holdTimeoutSec: 1800,
    onTimeout: "deny",
  },
  {
    id: "pol_ticket_update",
    tool: "ticket.update",
    label: "Update ticket",
    description: "Internal notes, priority and assignment changes.",
    enabled: true,
    hardRules: [{ id: "r_update_bulk", kind: "max_records", label: "Bulk update limit", max: 100, effect: "BLOCK" }],
    thresholds: { hold: 0.55, block: 0.95, minConfidence: 0.65 },
    approverRoute: "team_lead",
    holdTimeoutSec: 1800,
    onTimeout: "deny",
  },
  {
    id: "pol_crm_update",
    tool: "crm.update",
    label: "Update CRM record",
    description: "Changes to customer records, including contact, payee and status fields.",
    enabled: true,
    hardRules: [
      { id: "r_crm_bulk", kind: "max_records", label: "Bulk write limit", max: 50, effect: "BLOCK" },
      { id: "r_crm_cap", kind: "spending_cap", label: "Credit cap", maxAmount: 5000, currency: "AUD", effect: "BLOCK" },
    ],
    thresholds: { hold: 0.5, block: 0.92, minConfidence: 0.72 },
    approverRoute: "customer_owner",
    holdTimeoutSec: 900,
    onTimeout: "deny",
  },
  {
    id: "pol_crm_create",
    tool: "crm.create",
    label: "Create CRM record",
    description: "New leads, contacts and cases.",
    enabled: true,
    hardRules: [{ id: "r_create_bulk", kind: "max_records", label: "Bulk create limit", max: 200, effect: "BLOCK" }],
    thresholds: { hold: 0.6, block: 0.95, minConfidence: 0.65 },
    approverRoute: "team_lead",
    holdTimeoutSec: 1800,
    onTimeout: "deny",
  },
  {
    id: "pol_crm_delete",
    tool: "crm.delete",
    label: "Delete CRM record",
    description: "Deletion is never delegated to agents in this tenant.",
    enabled: true,
    hardRules: [{ id: "r_no_delete", kind: "blocked_action", label: "Blocked action", tools: ["crm.delete"], effect: "BLOCK" }],
    thresholds: { hold: 0.3, block: 0.8, minConfidence: 0.8 },
    approverRoute: "compliance",
    holdTimeoutSec: 900,
    onTimeout: "deny",
  },
];

export function routeApprover(action: Action, policy: Policy): Approver {
  switch (policy.approverRoute) {
    case "customer_owner":
      return APPROVERS[action.context.customer?.ownerId ?? TEAM_LEAD[action.agent.team]] ?? APPROVERS["a.whitford"];
    case "team_lead":
      return APPROVERS[TEAM_LEAD[action.agent.team]] ?? APPROVERS["a.whitford"];
    case "compliance":
      return APPROVERS["a.whitford"];
  }
}

/** The engine wired with mock implementations. Swap here for real services. */
export const scorer = new MockJevScorer();
export const engine: EngineDeps = {
  scorer,
  explainer: new MockExplainer(),
  routeApprover,
};

export const policyFor = (policies: Policy[], tool: ToolName) =>
  policies.find((p) => p.tool === tool) ?? POLICIES.find((p) => p.tool === tool)!;

/* ------------------------------------------------------------------ */
/* Action generator                                                    */
/* ------------------------------------------------------------------ */

const CATEGORY: Record<ToolName, ActionCategory> = {
  "email.send": "email",
  "ticket.update": "ticketing",
  "ticket.close": "ticketing",
  "crm.create": "crm",
  "crm.update": "crm",
  "crm.delete": "crm",
};

interface Template {
  weight: number;
  tool: ToolName;
  agent: string;
  principal: string;
  build: (rng: Rng, c: Customer) => { summary: string; args: Record<string, unknown>; context?: ActionContext };
}

const claimNo = (rng: Rng) => `CLM-${int(rng, 40000, 49999)}`;
const ticketNo = (rng: Rng) => `TCK-${int(rng, 90000, 99999)}`;
const aud = (n: number) => `$${n.toLocaleString("en-AU")}`;
const firstName = (c: Customer) => c.name.split(" ")[0];

const TEMPLATES: Template[] = [
  /* ----- routine: the vast majority ----- */
  {
    weight: 14, tool: "email.send", agent: "claims-assist", principal: "p.raman",
    build: (rng, c) => {
      const claim = claimNo(rng);
      return {
        summary: `Acknowledge claim ${claim} to ${c.name}`,
        args: {
          to: c.email,
          subject: `Claim ${claim} received`,
          body: `Hi ${firstName(c)}, your claim ${claim} has been received. A claims officer will contact you within 2 business days.`,
        },
      };
    },
  },
  {
    weight: 10, tool: "email.send", agent: "claims-assist", principal: "p.raman",
    build: (rng, c) => ({
      summary: `Request damage photos from ${c.name}`,
      args: {
        to: c.email,
        subject: "Photos for your claim",
        body: `Hi ${firstName(c)}, could you upload photos of the damage using the link in your portal? It helps us assess the claim sooner.`,
      },
    }),
  },
  {
    weight: 14, tool: "ticket.update", agent: "support-triage", principal: "l.nguyen",
    build: (rng) => {
      const t = ticketNo(rng);
      const change = pick(rng, ["priority → P3", "assign → Home claims queue", "add internal note", "tag → policy-question"]);
      return { summary: `Update ${t}: ${change}`, args: { ticket: t, change } };
    },
  },
  {
    weight: 10, tool: "ticket.close", agent: "support-triage", principal: "l.nguyen",
    build: (rng, c) => {
      const t = ticketNo(rng);
      return {
        summary: `Close ${t} after ${firstName(c)} confirmed resolution`,
        args: { ticket: t, resolution: "Customer confirmed the address change is correct." },
        context: { ticketId: t },
      };
    },
  },
  {
    weight: 8, tool: "email.send", agent: "renewals-outreach", principal: "o.fitzgerald",
    build: (rng, c) => ({
      summary: `Send renewal reminder to ${c.name}`,
      args: {
        to: c.email,
        subject: "Your home policy renews soon",
        body: `Hi ${firstName(c)}, your home policy renews on ${int(rng, 3, 28)} October. Your renewal notice is in the portal.`,
      },
    }),
  },
  {
    weight: 8, tool: "crm.update", agent: "kyc-ops", principal: "a.haddad",
    build: (_rng, c) => ({
      summary: `Mark ${c.name} identity check as verified`,
      args: { record: c.id, field: "kyc_status", from: "pending", to: "verified" },
    }),
  },
  {
    weight: 8, tool: "crm.update", agent: "crm-hygiene", principal: "svc.nightly",
    build: (rng) => {
      const n = int(rng, 2, 14);
      return {
        summary: `Normalise phone format on ${n} records`,
        args: { field: "phone", transform: "E.164", records: n },
        context: { recordsAffected: n },
      };
    },
  },
  {
    weight: 6, tool: "crm.create", agent: "renewals-outreach", principal: "o.fitzgerald",
    build: (_rng, c) => ({
      summary: `Create follow-up task for ${c.name}`,
      args: { type: "task", record: c.id, due: "in 7 days", note: "Check whether the new security system qualifies for a discount." },
    }),
  },
  {
    weight: 6, tool: "crm.update", agent: "claims-assist", principal: "p.raman",
    build: (_rng, c) => ({
      summary: `Set next contact date for ${c.name}`,
      args: { record: c.id, field: "next_contact", to: "Thu 2 Oct" },
    }),
  },
  {
    weight: 6, tool: "email.send", agent: "support-triage", principal: "l.nguyen",
    build: (rng, c) => {
      const t = ticketNo(rng);
      return {
        summary: `Update ${c.name} on ticket ${t}`,
        args: { to: c.email, subject: `Update on ${t}`, body: `Hi ${firstName(c)}, our team is reviewing your question and should have an answer by tomorrow afternoon.` },
        context: { ticketId: t },
      };
    },
  },

  /* ----- genuinely risky: held for a person ----- */
  {
    weight: 3, tool: "email.send", agent: "claims-assist", principal: "p.raman",
    build: (rng, c) => {
      const amount = pick(rng, [1200, 1850, 2400, 3100, 4800]);
      return {
        summary: `Promise ${c.name} a ${aud(amount)} refund`,
        args: {
          to: c.email,
          subject: "About your claim",
          body: `Hi ${firstName(c)}, we're sorry for the delay. We'll refund the full ${aud(amount)} and waive the excess on this claim.`,
        },
      };
    },
  },
  {
    weight: 1.5, tool: "email.send", agent: "support-triage", principal: "l.nguyen",
    build: (_rng, c) => ({
      summary: `Send ${c.name}'s policy schedule to a broker`,
      args: {
        to: "quotes@harbourline-broking.example",
        subject: `Policy schedule: ${c.name}`,
        body: `Attached is the current policy schedule for ${c.name}, including date of birth and insured address.`,
        attachments: ["policy_schedule.pdf"],
      },
    }),
  },
  {
    weight: 2, tool: "ticket.close", agent: "support-triage", principal: "l.nguyen",
    build: (rng, c) => {
      const t = ticketNo(rng);
      return {
        summary: `Close complaint ${t} for ${c.name}`,
        args: { ticket: t, resolution: "No further action. Closing as resolved." },
        context: { ticketId: t, flags: ["complaint", "idr-window"] },
      };
    },
  },
  {
    weight: 2, tool: "crm.update", agent: "kyc-ops", principal: "a.haddad",
    build: (_rng, c) => ({
      summary: `Change payee bank account for ${c.name}`,
      args: {
        record: c.id,
        field: "bank_account",
        to: { bsb: "062-***", account: "****4417", payee: c.name },
        source: "email request",
      },
    }),
  },
  {
    weight: 0.6, tool: "email.send", agent: "renewals-outreach", principal: "o.fitzgerald",
    build: (rng) => {
      const n = int(rng, 900, 2400);
      return {
        summary: `Send price-change notice to ${n.toLocaleString("en-AU")} customers`,
        args: { to: "segment:renewals-q4@halcyon.example", subject: "Changes to your premium", body: "Your premium will change at renewal." },
        context: { campaign: true, recordsAffected: n },
      };
    },
  },
  {
    weight: 0.8, tool: "email.send", agent: "claims-assist", principal: "p.raman",
    build: (_rng, c) => ({
      summary: `Tell ${c.name} the damage was our fault`,
      args: {
        to: c.email,
        subject: "Your claim",
        body: `Hi ${firstName(c)}, we admit our contractor was at fault and we will cover the full cost of repairs.`,
      },
    }),
  },

  /* ----- clearly dangerous or against hard rules: blocked ----- */
  {
    weight: 0.6, tool: "crm.update", agent: "crm-hygiene", principal: "svc.nightly",
    build: (rng) => {
      const n = int(rng, 3000, 6000);
      return {
        summary: `Set status to "lapsed" on ${n.toLocaleString("en-AU")} policies`,
        args: { field: "policy_status", to: "lapsed", filter: "last_payment < 2026-08-01" },
        context: { recordsAffected: n },
      };
    },
  },
  {
    weight: 0.5, tool: "email.send", agent: "claims-assist", principal: "p.raman",
    build: (rng, c) => {
      const amount = pick(rng, [12500, 18500, 24000]);
      return {
        summary: `Promise ${c.name} a ${aud(amount)} settlement`,
        args: { to: c.email, subject: "Settlement", body: `We will settle your claim for ${aud(amount)} this week.` },
      };
    },
  },
  {
    weight: 0.4, tool: "crm.delete", agent: "support-triage", principal: "l.nguyen",
    build: (_rng, c) => ({
      summary: `Delete contact record for ${c.name}`,
      args: { record: c.id, reason: "customer asked to be removed" },
    }),
  },
];

export function generateAction(rng: Rng, now: Date): Action {
  const t = weighted(rng, TEMPLATES.map((value) => ({ weight: value.weight, value })));
  const customer = pick(rng, CUSTOMERS);
  const built = t.build(rng, customer);
  const noCustomer = t.agent === "crm-hygiene" || !!built.context?.campaign;
  return {
    id: makeId("act", rng),
    tool: t.tool,
    category: CATEGORY[t.tool],
    summary: built.summary,
    args: built.args,
    agent: AGENTS[t.agent],
    onBehalfOf: PRINCIPALS[t.principal],
    context: { ...(noCustomer ? {} : { customer }), ...built.context },
    proposedAt: now.toISOString(),
  };
}

/* ------------------------------------------------------------------ */
/* Curated holds (the demo approver's queue)                           */
/* ------------------------------------------------------------------ */

const byId = (id: string) => CUSTOMERS.find((c) => c.id === id)!;

interface CuratedHold {
  action: Omit<Action, "id" | "proposedAt">;
  /** Seconds ago it was proposed. */
  ageSec: number;
  /** Seconds until default deny. */
  expiresInSec: number;
  explanation: string;
}

export const CURATED_HOLDS: CuratedHold[] = [
  {
    ageSec: 250,
    expiresInSec: 650,
    action: {
      tool: "email.send",
      category: "email",
      summary: "Promise Dana Whitlock a $4,800 refund and a 12-month premium waiver",
      agent: AGENTS["claims-assist"],
      onBehalfOf: PRINCIPALS["p.raman"],
      context: { customer: byId("C-20417"), flags: ["first-of-kind"] },
      args: {
        to: "dana.whitlock@example.com",
        subject: "Your claim CLM-48213",
        body: "Hi Dana, we've reviewed claim CLM-48213. We'll refund the full $4,800 excess and waive your premium for the next 12 months as a goodwill gesture.",
      },
    },
    explanation:
      "The claims assistant wants to promise Dana Whitlock, a strategic customer, a $4,800 refund plus a 12-month premium waiver. That's a binding commitment in writing, and this agent has never offered a premium waiver before. The refund is under the $5,000 cap, so no hard rule stopped it, but the waiver has no fixed amount. Approve if Maya's team already agreed this; deny and the agent will send a holding reply instead.",
  },
  {
    ageSec: 610,
    expiresInSec: 380,
    action: {
      tool: "ticket.close",
      category: "ticketing",
      summary: "Close complaint TCK-99102 for Mereana Hale as resolved",
      agent: AGENTS["support-triage"],
      onBehalfOf: PRINCIPALS["l.nguyen"],
      context: { customer: byId("C-30952"), ticketId: "TCK-99102", flags: ["complaint", "idr-window"] },
      args: { ticket: "TCK-99102", resolution: "No further action. Closing as resolved.", notifyCustomer: true },
    },
    explanation:
      "Support triage wants to close TCK-99102, which is a formal complaint that's still inside its internal dispute resolution window. Closing sends Mereana an automatic 'resolved' email, but the thread has no written outcome letter yet. Closing a complaint without one can breach the response obligations your compliance team tracks. Deny to keep it open, or approve if the outcome letter went out another way.",
  },
  {
    ageSec: 130,
    expiresInSec: 95,
    action: {
      tool: "crm.update",
      category: "crm",
      summary: "Change the payee bank account for Lam Family Trust",
      agent: AGENTS["kyc-ops"],
      onBehalfOf: PRINCIPALS["a.haddad"],
      context: { customer: byId("C-72945"), flags: ["first-of-kind"] },
      args: {
        record: "C-72945",
        field: "bank_account",
        from: { bsb: "033-***", account: "****9021" },
        to: { bsb: "062-***", account: "****4417", payee: "Lam Family Trust" },
        source: "email from accounts-lamfamily@mailbox.example",
      },
    },
    explanation:
      "KYC operations wants to change where claim payouts go for Lam Family Trust, a strategic customer. The request came from an email address that isn't on the customer record, and payee changes requested by email are a common fraud pattern. The next payout would go to the new account. If nobody responds, this is denied automatically when the timer runs out.",
  },
  {
    ageSec: 40,
    expiresInSec: 860,
    action: {
      tool: "email.send",
      category: "email",
      summary: "Send Tomasz Brennan's policy schedule to an outside broker",
      agent: AGENTS["support-triage"],
      onBehalfOf: PRINCIPALS["l.nguyen"],
      context: { customer: byId("C-11873") },
      args: {
        to: "quotes@harbourline-broking.example",
        subject: "Policy schedule: Tomasz Brennan",
        body: "Attached is Tomasz's current policy schedule, including date of birth and insured address, as requested.",
        attachments: ["policy_schedule_C-11873.pdf"],
      },
    },
    explanation:
      "Support triage wants to email Tomasz Brennan's policy schedule, including his date of birth and home address, to a broker that isn't on the recipient allowlist. There's no record in the ticket that Tomasz authorised sharing with this broker. Approve only if his consent is on file.",
  },
];

/* ------------------------------------------------------------------ */
/* Seed: the last hour of activity                                     */
/* ------------------------------------------------------------------ */

export interface Seed {
  records: DecisionRecord[]; // newest first
  ledger: LedgerEntry[]; // oldest first (append-only)
}

export async function buildSeed(now: Date, policies: Policy[] = POLICIES): Promise<Seed> {
  const rng = createRng(20260927);
  const records: DecisionRecord[] = [];
  const events: { at: number; body: Parameters<typeof append>[1] }[] = [];

  // ~80 background actions over the last hour; holds already resolved in Slack/Teams.
  for (let i = 0; i < 80; i++) {
    const at = new Date(now.getTime() - (3600 - i * 44 - between(rng, 0, 20)) * 1000);
    const action = generateAction(rng, at);
    const decision = await evaluate(action, policyFor(policies, action.tool), engine, { now: at });
    const record: DecisionRecord = { action, decision };
    events.push({ at: new Date(decision.decidedAt).getTime(), body: decisionEntry(action, decision) });
    if (decision.outcome === "HOLD" && decision.approver) {
      const approved = rng() < 0.8;
      record.resolution = {
        status: approved ? "approved" : "denied",
        by: decision.approver.name,
        channel: decision.approver.channel,
        at: new Date(at.getTime() + between(rng, 40, 400) * 1000).toISOString(),
      };
      events.push({ at: new Date(record.resolution.at).getTime(), body: resolutionEntry(action, decision, record.resolution) });
    }
    records.push(record);
  }

  // Curated holds, routed to the demo approver.
  for (const h of CURATED_HOLDS) {
    const at = new Date(now.getTime() - h.ageSec * 1000);
    const action: Action = { ...h.action, id: makeId("act", rng), proposedAt: at.toISOString() };
    const decision = await evaluate(action, policyFor(policies, action.tool), engine, { now: at });
    decision.outcome = "HOLD";
    if (decision.reasonCode === "RISK_BELOW_HOLD") decision.reasonCode = "RISK_ABOVE_HOLD";
    decision.explanation = h.explanation;
    decision.approver = CURRENT_APPROVER;
    decision.holdExpiresAt = new Date(now.getTime() + h.expiresInSec * 1000).toISOString();
    records.push({ action, decision });
    events.push({ at: new Date(decision.decidedAt).getTime(), body: decisionEntry(action, decision) });
  }

  events.sort((a, b) => a.at - b.at);
  let ledger: LedgerEntry[] = [];
  for (const e of events) ledger = append(ledger, e.body);

  records.sort((a, b) => b.action.proposedAt.localeCompare(a.action.proposedAt));
  return { records, ledger };
}

/* ------------------------------------------------------------------ */
/* Policy impact preview sample                                        */
/* ------------------------------------------------------------------ */

let sampleCache: { tool: ToolName; value: number; confidence: number }[] | null = null;

/** ~1,500 pre-scored example actions for "what would these thresholds do?" previews. */
export function policySample() {
  if (sampleCache) return sampleCache;
  const rng = createRng(7);
  const base = new Date("2026-09-20T02:00:00Z");
  sampleCache = Array.from({ length: 1500 }, (_, i) => {
    const action = generateAction(rng, new Date(base.getTime() + i * 60000));
    const r = scorer.scoreSync(action);
    return { tool: action.tool, value: r.value, confidence: r.confidence };
  });
  return sampleCache;
}

/* ------------------------------------------------------------------ */
/* Shadow-mode report                                                  */
/* ------------------------------------------------------------------ */

function buildShadowReport(): ShadowReport {
  const rng = createRng(30);
  const end = new Date("2026-09-26T00:00:00Z");
  const days: ShadowDay[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(end.getTime() - i * 86400000);
    const weekend = d.getUTCDay() === 0 || d.getUTCDay() === 6;
    const proposed = Math.round((weekend ? 520 : 1720) * between(rng, 0.88, 1.14));
    const baselineReviews = Math.round(proposed * between(rng, 0.29, 0.33));
    const abeyanceReviews = Math.max(2, Math.round(baselineReviews * between(rng, 0.022, 0.038)));
    days.push({
      date: d.toISOString().slice(0, 10),
      proposed,
      baselineReviews,
      abeyanceReviews,
      blocks: rng() < 0.55 ? int(rng, 0, 2) : 0,
    });
  }
  const sum = (k: keyof Omit<ShadowDay, "date">) => days.reduce((s, d) => s + d[k], 0);
  const totals = {
    proposed: sum("proposed"),
    baseline: sum("baselineReviews"),
    abeyance: sum("abeyanceReviews"),
    blocks: sum("blocks"),
  };

  // tool, share of proposed, of baseline reviews, of holds, of blocks
  const shares: [ToolName, number, number, number, number][] = [
    ["email.send", 0.41, 0.52, 0.49, 0.3],
    ["ticket.close", 0.17, 0.24, 0.16, 0.05],
    ["crm.update", 0.2, 0.18, 0.29, 0.35],
    ["ticket.update", 0.14, 0, 0.02, 0],
    ["crm.create", 0.078, 0.06, 0.04, 0.05],
    ["crm.delete", 0.002, 0, 0, 0.25], // blocked outright by a hard rule
  ];
  const byTool: ShadowToolBreakdown[] = shares.map(([tool, a, b, c, d]) => ({
    tool,
    proposed: Math.round(totals.proposed * a),
    baselineReviews: Math.round(totals.baseline * b),
    abeyanceReviews: Math.round(totals.abeyance * c),
    blocks: Math.round(totals.blocks * d),
  }));
  // Rounding remainder goes to the largest row so the table sums to the totals.
  const fix = (k: keyof Omit<ShadowToolBreakdown, "tool">, total: number) => {
    byTool[0][k] += total - byTool.reduce((s, t) => s + t[k], 0);
  };
  fix("proposed", totals.proposed);
  fix("baselineReviews", totals.baseline);
  fix("abeyanceReviews", totals.abeyance);
  fix("blocks", totals.blocks);

  const catches: ShadowCatch[] = [
    { id: "c1", tool: "crm.update", outcome: "BLOCK", riskValue: 0.97, summary: "Set 4,212 policies to “lapsed” from a stale payment filter", why: "Bulk write limit (50) — would have cancelled cover for customers who had paid." },
    { id: "c2", tool: "crm.update", outcome: "HOLD", riskValue: 0.81, summary: "Change payee bank account from an unverified email request", why: "Payee change + sender not on record — a known fraud pattern." },
    { id: "c3", tool: "email.send", outcome: "HOLD", riskValue: 0.77, summary: "Tell a customer “we admit our contractor was at fault”", why: "Admission of liability in writing." },
    { id: "c4", tool: "email.send", outcome: "BLOCK", riskValue: 0.94, summary: "Promise a $18,500 settlement by email", why: "Above the $5,000 monetary cap for agent email." },
    { id: "c5", tool: "ticket.close", outcome: "HOLD", riskValue: 0.58, summary: "Close a formal complaint inside its response window", why: "Complaint with no outcome letter on file." },
    { id: "c6", tool: "email.send", outcome: "HOLD", riskValue: 0.66, summary: "Send a policy schedule with DOB to an outside broker", why: "Personal data to a recipient not on the allowlist." },
  ];

  return {
    isExampleData: true,
    tenant: TENANT.name,
    periodStart: days[0].date,
    periodEnd: days[days.length - 1].date,
    totalProposed: totals.proposed,
    baselineReviews: totals.baseline,
    abeyanceReviews: totals.abeyance,
    blocks: totals.blocks,
    highRiskLabelled: 61,
    highRiskCaught: 61,
    minutesPerReview: 2.5,
    days,
    byTool,
    catches,
  };
}

export const SHADOW_REPORT: ShadowReport = buildShadowReport();
