/**
 * Append-only, hash-chained audit ledger.
 * Each entry commits to the previous entry's hash, so any edit or
 * deletion breaks the chain. (FNV-1a here for the demo; production
 * would use SHA-256 and a signed checkpoint.)
 */
import type { Action, Decision, LedgerEntry, LedgerEvent, Resolution } from "../types";

export const GENESIS_HASH = "0000000000000000";

function fnv1a64(input: string): string {
  // Two independent 32-bit FNV-1a passes → 16 hex chars.
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193 ^ 0x5bd1e995;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193);
    h2 = Math.imul(h2 ^ c, 0x01000193 + 0x100);
  }
  return (h1 >>> 0).toString(16).padStart(8, "0") + (h2 >>> 0).toString(16).padStart(8, "0");
}

type EntryBody = Omit<LedgerEntry, "seq" | "id" | "prevHash" | "hash">;

export function hashEntry(body: EntryBody, seq: number, prevHash: string): string {
  return fnv1a64(`${seq}|${prevHash}|${JSON.stringify(body)}`);
}

export function append(ledger: readonly LedgerEntry[], body: EntryBody): LedgerEntry[] {
  const prev = ledger[ledger.length - 1];
  const seq = prev ? prev.seq + 1 : 1;
  const prevHash = prev ? prev.hash : GENESIS_HASH;
  const entry: LedgerEntry = {
    ...body,
    seq,
    id: `led_${seq.toString().padStart(6, "0")}`,
    prevHash,
    hash: hashEntry(body, seq, prevHash),
  };
  return [...ledger, entry];
}

/** Recompute every hash; returns the first broken seq, or null if intact. */
export function verifyChain(ledger: readonly LedgerEntry[]): number | null {
  let prevHash = GENESIS_HASH;
  for (const e of ledger) {
    const { seq, id: _id, prevHash: p, hash, ...body } = e;
    void _id;
    if (p !== prevHash || hashEntry(body, seq, p) !== hash) return seq;
    prevHash = hash;
  }
  return null;
}

export function decisionEntry(action: Action, decision: Decision): EntryBody {
  return {
    at: decision.decidedAt,
    event: `decision.${decision.outcome.toLowerCase()}` as LedgerEvent,
    actionId: action.id,
    tool: action.tool,
    agentId: action.agent.id,
    onBehalfOf: action.onBehalfOf.id,
    outcome: decision.outcome,
    riskValue: decision.risk ? round(decision.risk.value) : null,
    confidence: decision.risk ? round(decision.risk.confidence) : null,
    reasonCode: decision.reasonCode,
    reason: decision.reason,
    actor: "abeyance/engine",
    mode: decision.mode,
  };
}

export function resolutionEntry(action: Action, decision: Decision, resolution: Resolution): EntryBody {
  const event: LedgerEvent =
    resolution.status === "approved" ? "hold.approved" : resolution.status === "denied" ? "hold.denied" : "hold.expired";
  return {
    at: resolution.at,
    event,
    actionId: action.id,
    tool: action.tool,
    agentId: action.agent.id,
    onBehalfOf: action.onBehalfOf.id,
    outcome: decision.outcome,
    riskValue: decision.risk ? round(decision.risk.value) : null,
    confidence: decision.risk ? round(decision.risk.confidence) : null,
    reasonCode:
      resolution.status === "approved" ? "APPROVED" : resolution.status === "denied" ? "DENIED" : "TIMEOUT_DEFAULT_DENY",
    reason:
      resolution.status === "expired"
        ? "no response before timeout; default deny"
        : `${resolution.status} via ${resolution.channel}${resolution.note ? `: ${resolution.note}` : ""}`,
    actor: resolution.by,
    mode: decision.mode,
  };
}

const round = (n: number) => Math.round(n * 1000) / 1000;

/* ------------------------------ export ------------------------------ */

/** JSON Lines — the format most SIEMs ingest directly. */
export function toJsonl(ledger: readonly LedgerEntry[]): string {
  return ledger.map((e) => JSON.stringify(e)).join("\n") + "\n";
}

export function toCsv(ledger: readonly LedgerEntry[]): string {
  const cols: (keyof LedgerEntry)[] = [
    "seq", "id", "at", "event", "actionId", "tool", "agentId", "onBehalfOf", "outcome",
    "riskValue", "confidence", "reasonCode", "reason", "actor", "mode", "prevHash", "hash",
  ];
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...ledger.map((e) => cols.map((c) => esc(e[c])).join(","))].join("\n") + "\n";
}
