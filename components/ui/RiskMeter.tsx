"use client";

import { motion } from "motion/react";
import { spring } from "@/lib/motion";
import type { DecisionOutcome } from "@/lib/types";

/** Thin risk bar with optional hold/block threshold ticks. */
export function RiskMeter({
  value,
  confidence,
  outcome,
  thresholds,
  width = "w-20",
  showValue = true,
}: {
  value: number | null;
  confidence?: number | null;
  outcome?: DecisionOutcome | null;
  thresholds?: { hold: number; block: number };
  width?: string;
  showValue?: boolean;
}) {
  const tone = outcome === "HOLD" ? "bg-hold" : outcome === "BLOCK" ? "bg-block" : "bg-ink-3";
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`relative h-[3px] ${width} overflow-hidden rounded-full bg-line`}
        role="meter"
        aria-label="Risk score"
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={value ?? undefined}
        aria-valuetext={value == null ? "Not scored" : `Risk ${value.toFixed(2)}${confidence ? `, confidence ${confidence.toFixed(2)}` : ""}`}
      >
        {value != null && (
          <motion.span
            className={`absolute inset-y-0 left-0 w-full origin-left rounded-full ${tone}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: value }}
            transition={spring.settle}
          />
        )}
        {thresholds && (
          <>
            <span aria-hidden className="absolute inset-y-0 w-px bg-hold/70" style={{ left: `${thresholds.hold * 100}%` }} />
            <span aria-hidden className="absolute inset-y-0 w-px bg-block/70" style={{ left: `${thresholds.block * 100}%` }} />
          </>
        )}
      </span>
      {showValue && (
        <span className="font-mono text-xs tabular-nums text-ink-2">
          {value == null ? "—" : value.toFixed(2)}
          {confidence != null && <span className="text-ink-3"> · conf {confidence.toFixed(2).slice(1)}</span>}
        </span>
      )}
    </span>
  );
}
