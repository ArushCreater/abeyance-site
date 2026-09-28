import type { DecisionOutcome, ToolName } from "./types";

const TZ = "Australia/Sydney";

export const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("en-AU", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));

export const fmtDateTime = (iso: string) =>
  new Intl.DateTimeFormat("en-AU", {
    timeZone: TZ,
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));

export const fmtDay = (isoDate: string) =>
  new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(isoDate));

export const fmtInt = (n: number) => Math.round(n).toLocaleString("en-AU");

export const fmtPct = (n: number, digits = 1) => `${(n * 100).toFixed(digits)}%`;

export const fmtScore = (n: number | null | undefined) => (n == null ? "—" : n.toFixed(2));

/** mm:ss countdown. */
export function fmtCountdown(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

export function fmtAgo(iso: string, now: number) {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

export const OUTCOME_LABEL: Record<DecisionOutcome, string> = {
  ALLOW: "Allow",
  HOLD: "Hold",
  BLOCK: "Block",
};

export const TOOL_LABEL: Record<ToolName, string> = {
  "email.send": "Send email",
  "ticket.update": "Update ticket",
  "ticket.close": "Close ticket",
  "crm.create": "Create record",
  "crm.update": "Update record",
  "crm.delete": "Delete record",
};

export const shortHash = (h: string) => `${h.slice(0, 4)}…${h.slice(-4)}`;
