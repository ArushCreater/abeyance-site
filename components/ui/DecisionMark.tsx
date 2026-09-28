import type { DecisionOutcome } from "@/lib/types";
import { OUTCOME_LABEL } from "@/lib/format";

/**
 * Decision label. ALLOW and BLOCK are deliberately quiet; only HOLD glows.
 */
export function DecisionMark({
  outcome,
  size = "sm",
  showLabel = true,
  pending = false,
}: {
  outcome: DecisionOutcome | null;
  size?: "sm" | "md";
  showLabel?: boolean;
  pending?: boolean;
}) {
  const text = size === "md" ? "text-xs" : "text-micro";
  if (!outcome) {
    return (
      <span className={`inline-flex items-center gap-2 font-mono uppercase tracking-[0.12em] text-ink-3 ${text}`}>
        <span aria-hidden className="relative h-1.5 w-4 overflow-hidden rounded-full bg-line">
          <span className="absolute inset-y-0 left-0 w-1/2 animate-scan rounded-full bg-ink-3/60" />
        </span>
        {showLabel && "Scoring"}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono uppercase tracking-[0.12em] ${text} ${
        outcome === "HOLD" ? "text-hold" : outcome === "BLOCK" ? "text-block" : "text-allow"
      }`}
    >
      {outcome === "ALLOW" && <span aria-hidden className="h-1.5 w-1.5 rounded-full border border-allow" />}
      {outcome === "HOLD" && (
        <span aria-hidden className="relative flex h-1.5 w-1.5">
          {pending && <span className="absolute inset-0 animate-breathe rounded-full bg-hold/60" />}
          <span className="relative h-1.5 w-1.5 rounded-full bg-hold" />
        </span>
      )}
      {outcome === "BLOCK" && <span aria-hidden className="h-[1.5px] w-2.5 -rotate-45 bg-block" />}
      {showLabel && OUTCOME_LABEL[outcome]}
    </span>
  );
}
