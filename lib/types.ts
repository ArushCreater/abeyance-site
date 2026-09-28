/**
 * Core domain types for Abeyance.
 *
 * These mirror the decision engine described in the product brief:
 *   propose(action) → hard rules → risk score → decision → ledger.
 * Keep them serialisable (plain JSON) so the mock module can be swapped
 * for a real API without touching components.
 */

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

/** Version one scope: email, ticketing and CRM write actions. */
export type ActionCategory = "email" | "ticketing" | "crm";

export type ToolName =
  | "email.send"
  | "ticket.update"
  | "ticket.close"
  | "crm.create"
  | "crm.update"
  | "crm.delete";

export interface AgentIdentity {
  id: string;
  name: string;
  team: string;
  framework: "langgraph" | "openai-agents" | "crewai" | "mcp-gateway" | "rest" | "console";
}

/** The user the agent is acting on behalf of. */
export interface Principal {
  id: string;
  name: string;
  role: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  tier: "standard" | "priority" | "strategic";
  /** Approver id of the business owner for this customer. */
  ownerId: string;
}

export interface ActionContext {
  customer?: Customer;
  ticketId?: string;
  /** Free-form flags attached by upstream systems, e.g. "complaint". */
  flags?: string[];
  /** True for bulk / outbound campaign sends. */
  campaign?: boolean;
  /** Number of records or recipients the action touches. */
  recordsAffected?: number;
}

/** What the agent passes to gate.propose(). */
export interface Action {
  id: string;
  tool: ToolName;
  category: ActionCategory;
  /** One-line, human-readable summary of intent. */
  summary: string;
  args: Record<string, unknown>;
  agent: AgentIdentity;
  onBehalfOf: Principal;
  context: ActionContext;
  proposedAt: string; // ISO 8601
  /** Set when the payload was purged under the retention policy. */
  purgedAt?: string;
}

/* ------------------------------------------------------------------ */
/* Risk                                                                */
/* ------------------------------------------------------------------ */

export type RiskFactorKey =
  | "irreversibility"
  | "blast_radius"
  | "data_sensitivity"
  | "anomaly"
  | "external_commitment"
  | "recipient";

export interface RiskFactor {
  key: RiskFactorKey;
  label: string;
  /** 0–1 */
  value: number;
  /** Short evidence string, e.g. "Promises a refund of $4,800". */
  note: string;
}

/** Output of the risk scorer (Jev in production, a mock for now). */
export interface RiskScore {
  /** Overall calibrated risk, 0–1. */
  value: number;
  /** Calibrated confidence in that score, 0–1. */
  confidence: number;
  factors: RiskFactor[];
  model: string;
  latencyMs: number;
  /** Which scorer produced this: the real model or the local mock. */
  source?: "jev" | "mock";
  /** Raw model answers and usage, kept for audit. */
  raw?: unknown;
}

/* ------------------------------------------------------------------ */
/* Policies & hard rules                                               */
/* ------------------------------------------------------------------ */

export type RuleEffect = "HOLD" | "BLOCK";

interface HardRuleBase {
  id: string;
  label: string;
  effect: RuleEffect;
}

export type HardRule =
  | (HardRuleBase & {
      kind: "spending_cap";
      maxAmount: number;
      currency: "AUD";
    })
  | (HardRuleBase & {
      kind: "recipient_allowlist";
      domains: string[];
      /** Allow the customer of record's own address. */
      allowCustomerOfRecord: boolean;
    })
  | (HardRuleBase & {
      kind: "blocked_action";
      tools: ToolName[];
    })
  | (HardRuleBase & {
      kind: "business_hours";
      timezone: string;
      start: string; // "08:00"
      end: string; // "20:00"
      /** 0 = Sunday … 6 = Saturday */
      days: number[];
      appliesTo: "campaign" | "all";
    })
  | (HardRuleBase & {
      kind: "max_records";
      max: number;
    });

export type HardRuleKind = HardRule["kind"];

export interface RuleResult {
  ruleId: string;
  kind: HardRuleKind;
  label: string;
  passed: boolean;
  /** Present when the rule did not pass. */
  effect?: RuleEffect;
  detail: string;
}

export interface Thresholds {
  /** Risk at or above this is held. */
  hold: number;
  /** Risk at or above this is blocked. */
  block: number;
  /** Below this confidence, uncertain actions are held. */
  minConfidence: number;
}

export type ApproverRoute = "customer_owner" | "team_lead" | "compliance";

/**
 * A scoped, human-approved exception: actions matching it are allowed even
 * if the risk model would hold them. Never overrides hard rules or BLOCK.
 * Usually created from a suggestion backed by repeated approvals.
 */
export interface Allowance {
  id: string;
  label: string;
  /** Only this agent (integration or agent id). */
  agentId: string | null;
  /** Largest monetary amount the action may mention. */
  maxAmount: number | null;
  /** Only when every recipient is the customer of record. */
  customerOfRecordOnly: boolean;
  /** Only while the risk score stays at or below this. */
  maxRisk: number;
  /** Why it exists, e.g. "7 of 7 similar holds approved". */
  evidence: string;
  createdBy: string;
  createdAt: string;
}

export interface Policy {
  id: string;
  tool: ToolName;
  label: string;
  description: string;
  enabled: boolean;
  hardRules: HardRule[];
  thresholds: Thresholds;
  approverRoute: ApproverRoute;
  holdTimeoutSec: number;
  /** HOLD always defaults to deny when nobody responds. */
  onTimeout: "deny";
  /** Require two different approvers when risk is at or above this. */
  dualControlAbove?: number | null;
  /** Escalate to compliance and admins if still pending after this long. */
  escalateAfterSec?: number | null;
  allowances?: Allowance[];
}

/* ------------------------------------------------------------------ */
/* Decisions                                                           */
/* ------------------------------------------------------------------ */

export type DecisionOutcome = "ALLOW" | "HOLD" | "BLOCK";

export type ReasonCode =
  | "RISK_BELOW_HOLD"
  | "RISK_ABOVE_HOLD"
  | "RISK_ABOVE_BLOCK"
  | "LOW_CONFIDENCE"
  | "RULE_HOLD"
  | "RULE_BLOCK"
  /** The risk model failed or timed out; Abeyance fails closed. */
  | "SCORER_UNAVAILABLE"
  /** A human-approved allowance let a would-be hold through. */
  | "ALLOWANCE"
  /** Emergency brake: this agent is paused. */
  | "AGENT_PAUSED"
  /** Emergency brake: every agent is frozen. */
  | "WORKSPACE_FROZEN";

export interface Approver {
  id: string;
  name: string;
  role: string;
  channel: "slack" | "teams" | "console";
}

export type EnforcementMode = "enforce" | "shadow";

export interface Decision {
  id: string;
  actionId: string;
  outcome: DecisionOutcome;
  /** Null when a hard rule blocks before scoring. */
  risk: RiskScore | null;
  rules: RuleResult[];
  reasonCode: ReasonCode;
  /** Structured, terse reason returned to the agent. */
  reason: string;
  /** Plain-English explanation for approvers (HOLD only, LLM-written). */
  explanation?: string;
  approver?: Approver;
  holdExpiresAt?: string;
  decidedAt: string;
  /** Total engine latency (rules + scoring). */
  latencyMs: number;
  mode: EnforcementMode;
  /** Explanation lifecycle on the exception path. */
  explanationStatus?: "pending" | "done";
  /** Model that wrote the explanation, or "template". */
  explainer?: string;
  /** Policy version that made this decision. */
  policyVersion?: number;
  /** The allowance that released this action, if any. */
  allowanceId?: string;
  /** What the models saw: personal data removed before scoring/explaining. */
  redaction?: { scoring: boolean; explainer: boolean; counts: Record<string, number> };
  /** Who may decide a hold. */
  route?: HoldRoute;
  /** Distinct approvals needed (2 = dual control). */
  approvalsRequired?: number;
  /** Approvals so far (dual control). */
  votes?: Vote[];
  /** When to escalate if still pending. */
  escalateAt?: string;
  escalatedAt?: string | null;
}

export interface HoldRoute {
  kind: "customer_owner" | "team" | "compliance";
  team: string;
  /** Specific users named by the route, e.g. the customer owner. */
  userIds: string[];
  label: string;
}

export interface Vote {
  userId: string;
  name: string;
  at: string;
  channel: Resolution["channel"];
  note?: string;
  reviewMs?: number;
}

export type ResolutionStatus = "approved" | "denied" | "expired";

export interface Resolution {
  status: ResolutionStatus;
  by: string; // approver name or "abeyance/timeout"
  byId?: string; // user id
  channel: Approver["channel"] | "system";
  at: string;
  note?: string;
  /** How long the approver looked before deciding (rubber-stamp detection). */
  reviewMs?: number;
}

/** A proposed action as it moves through the engine (feed item). */
export type DecisionSource = "api" | "console" | "demo";

export type DecisionStatus = "allowed" | "blocked" | "pending" | "approved" | "denied" | "expired" | "observed";

export interface DecisionRecord {
  action: Action;
  decision: Decision | null; // null while scoring
  resolution?: Resolution;
  status?: DecisionStatus;
  source?: DecisionSource;
  /** Post-hoc human label, used to measure misses in shadow reports. */
  label?: "risky" | "fine" | null;
}

/* ------------------------------------------------------------------ */
/* Ledger                                                              */
/* ------------------------------------------------------------------ */

export type LedgerEvent =
  | "decision.allow"
  | "decision.hold"
  | "decision.block"
  | "hold.approved"
  | "hold.denied"
  | "hold.expired"
  | "hold.approval"
  | "hold.escalated"
  | "user.updated"
  | "agent.paused"
  | "agent.resumed"
  | "workspace.frozen"
  | "workspace.unfrozen"
  | "policy.updated"
  | "settings.updated"
  | "integration.created"
  | "integration.updated"
  | "key.revoked";

/** Append-only, hash-chained audit entry. */
export interface LedgerEntry {
  seq: number;
  id: string;
  at: string;
  event: LedgerEvent;
  /** Null for configuration events (policies, settings, keys). */
  actionId: string | null;
  tool: ToolName | null;
  agentId: string | null;
  onBehalfOf: string | null;
  outcome: DecisionOutcome | null;
  riskValue: number | null;
  confidence: number | null;
  reasonCode:
    | ReasonCode
    | "APPROVED"
    | "DENIED"
    | "TIMEOUT_DEFAULT_DENY"
    | "POLICY_UPDATED"
    | "SETTINGS_UPDATED"
    | "INTEGRATION_CREATED"
    | "INTEGRATION_UPDATED"
    | "KEY_REVOKED"
    | "PARTIAL_APPROVAL"
    | "ESCALATED"
    | "USER_UPDATED"
    | "BRAKE";
  reason: string;
  actor: string;
  mode: EnforcementMode;
  prevHash: string;
  hash: string;
}

/* ------------------------------------------------------------------ */
/* Shadow mode                                                         */
/* ------------------------------------------------------------------ */

export interface ShadowDay {
  date: string; // YYYY-MM-DD
  proposed: number;
  /** Reviews a per-type approval step would have required. */
  baselineReviews: number;
  /** Reviews Abeyance would have required (HOLDs). */
  abeyanceReviews: number;
  blocks: number;
}

export interface ShadowToolBreakdown {
  tool: ToolName;
  proposed: number;
  baselineReviews: number;
  abeyanceReviews: number;
  blocks: number;
}

export interface ShadowCatch {
  id: string;
  tool: ToolName;
  summary: string;
  outcome: Extract<DecisionOutcome, "HOLD" | "BLOCK">;
  riskValue: number;
  why: string;
}

export interface ShadowReport {
  /** True for the illustrative report; rendered as a visible label. */
  isExampleData: boolean;
  tenant: string;
  periodStart: string;
  periodEnd: string;
  totalProposed: number;
  baselineReviews: number;
  abeyanceReviews: number;
  blocks: number;
  highRiskLabelled: number;
  highRiskCaught: number;
  minutesPerReview: number;
  days: ShadowDay[];
  byTool: ShadowToolBreakdown[];
  catches: ShadowCatch[];
}

/* ------------------------------------------------------------------ */
/* Workspace configuration                                             */
/* ------------------------------------------------------------------ */

export interface Settings {
  mode: EnforcementMode;
  /** "auto" uses Jev when a key is configured, otherwise the local mock. */
  scorer: "auto" | "jev" | "mock";
  /** "auto" uses Claude when a key is configured, otherwise a template. */
  explainer: "auto" | "claude" | "template";
  /** Simulated agent traffic for demos. */
  demoTraffic: boolean;
  tenantName: string;
  slack: SlackSettings;
  teams: { webhookUrl: string | null };
  webhooks: WebhookEndpoint[];
  sso: SsoSettings;
  /** Emergency brake for the whole workspace. */
  freeze: BrakeState | null;
  privacy: PrivacySettings;
}

export interface BrakeState {
  active: boolean;
  by: string;
  at: string;
  reason: string;
}

export type RedactionCategory = "emails" | "phones" | "bankAccounts" | "cards" | "govIds" | "dob" | "names" | "addresses";

export interface PrivacySettings {
  /** Remove personal data before the risk model sees an action. */
  redactForScoring: boolean;
  /** Remove personal data before the LLM writes an explanation. */
  redactForExplainer: boolean;
  categories: Record<RedactionCategory, boolean>;
  /** Extra patterns, e.g. internal policy numbers. */
  customPatterns: { label: string; pattern: string }[];
  /** Purge action payloads after this many days (null = keep). The ledger is unaffected. */
  payloadRetentionDays: number | null;
}

export interface AgentControl {
  agentId: string;
  paused: boolean;
  pausedAt: string | null;
  pausedBy: string | null;
  reason: string | null;
}

export interface SlackSettings {
  /** Channel for holds whose team has no channel of its own. */
  defaultChannel: string | null;
  /** Team name → channel id or name. */
  teamChannels: Record<string, string>;
  /** @-mention eligible approvers who've linked Slack. */
  mentionApprovers: boolean;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: WebhookEvent[];
  /** Signs deliveries (HMAC-SHA256). Shown once when created. */
  secret: string;
  enabled: boolean;
  createdAt: string;
}

export type WebhookEvent = "hold.created" | "hold.resolved" | "decision.blocked" | "ledger.appended";

export interface SsoSettings {
  /** Create users on first SSO sign-in. */
  jitProvisioning: boolean;
  defaultRole: Role;
  /** ID-token claim holding group names, e.g. "groups". */
  groupsClaim: string;
  /** Group name → role (highest wins). */
  groupRoles: Record<string, Role>;
  /** Only these email domains may sign in with SSO (empty = any). */
  allowedDomains: string[];
  /** Allow email + password sign-in alongside SSO. */
  allowPassword: boolean;
}

/* ------------------------------------------------------------------ */
/* People                                                              */
/* ------------------------------------------------------------------ */

export type Role = "owner" | "admin" | "approver" | "auditor" | "viewer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  /** Teams whose holds this person can decide (approvers). */
  teams: string[];
  status: "active" | "invited" | "disabled";
  auth: "password" | "sso";
  slackUserId: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  /** Out of office until this time; their holds go to the delegate. */
  awayUntil: string | null;
  delegateId: string | null;
  /** Computed: teams and people this person is covering for right now. */
  covering?: { userIds: string[]; teams: string[]; names: string[] };
}

export type Platform = "langgraph" | "openai-agents" | "crewai" | "mcp-gateway" | "rest";

/**
 * A connected agent. Each has its own API key, an optional per-agent
 * shadow mode, and a map from its native tool names to Abeyance action types.
 */
export interface Integration {
  id: string;
  name: string;
  platform: Platform;
  team: string;
  environment: "production" | "staging" | "development";
  /** Per-agent mode; shadow here overrides a workspace in enforce. */
  mode: EnforcementMode;
  /** Native tool name → Abeyance action type. */
  toolMap: Record<string, ToolName>;
  keyPrefix: string;
  createdAt: string;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
  revokedAt: string | null;
  actionCount: number;
}

export interface ServiceHealth {
  configured: boolean;
  active: boolean;
  /** Model id in use, e.g. "jev-latest" or "claude-opus-5". */
  model: string;
  lastOkAt: string | null;
  lastError: string | null;
  p50LatencyMs: number | null;
}

export interface Health {
  scorer: ServiceHealth & { using: "jev" | "mock" };
  explainer: ServiceHealth & { using: "claude" | "template" };
}

export interface StoredPolicy extends Policy {
  version: number;
  updatedAt: string;
  updatedBy: string;
}

/* ------------------------------------------------------------------ */
/* Policy tests                                                        */
/* ------------------------------------------------------------------ */

/** A saved action with the outcome it must keep producing. CI for policies. */
export interface PolicyTest {
  id: string;
  tool: ToolName;
  name: string;
  /** The action as proposed. Its recorded risk score is replayed, so tests are fast and deterministic. */
  body: { action: Action; risk: RiskScore | null };
  expected: DecisionOutcome;
  createdBy: string;
  createdAt: string;
  lastResult: PolicyTestResult | null;
}

export interface PolicyTestResult {
  testId: string;
  passed: boolean;
  outcome: DecisionOutcome;
  reason: string;
  policyVersion: number | null;
  at: string;
}

/* ------------------------------------------------------------------ */
/* Agent profile & map                                                 */
/* ------------------------------------------------------------------ */

export type GraphNodeKind = "agent" | "tool" | "team" | "person" | "customer";

export interface GraphNode {
  id: string;
  kind: GraphNodeKind;
  label: string;
  /** Decisions touching this node in the window. Drives size. */
  weight: number;
  holds: number;
  blocks: number;
  pending: number;
  paused?: boolean;
  /** Agent nodes: the agent id, for linking to its page. */
  agentId?: string;
  team?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  weight: number;
  holds: number;
  kind: "team" | "tool" | "customer" | "reviewer";
}

export interface AgentGraph {
  days: number;
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface AgentSignal {
  kind: "new_tool" | "hold_rate" | "volume" | "blocks" | "paused" | "quiet";
  tone: "hold" | "block" | "neutral";
  title: string;
  detail: string;
}

export interface AgentDetail {
  agent: AgentIdentity;
  integration: Integration | null;
  control: AgentControl | null;
  days: number;
  stats: {
    total: number;
    allowed: number;
    held: number;
    blocked: number;
    pending: number;
    approved: number;
    denied: number;
    expired: number;
    holdRate: number;
    avgRisk: number | null;
    p50LatencyMs: number | null;
    firstSeenAt: string | null;
    lastSeenAt: string | null;
    previous: { total: number; holdRate: number };
  };
  daily: { date: string; allow: number; hold: number; block: number }[];
  tools: { tool: ToolName; count: number; holds: number; blocks: number; avgRisk: number | null; firstSeenAt: string }[];
  customers: { id: string; name: string; count: number; holds: number }[];
  principals: { id: string; name: string; count: number }[];
  reviewers: { name: string; approved: number; denied: number }[];
  signals: AgentSignal[];
  recent: DecisionRecord[];
  graph: AgentGraph;
}
