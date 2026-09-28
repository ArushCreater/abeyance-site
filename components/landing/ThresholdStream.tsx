"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CountUp } from "@/components/type/CountUp";
import { DecisionMark } from "@/components/ui/DecisionMark";
import { RiskMeter } from "@/components/ui/RiskMeter";
import { ExampleTag } from "@/components/ui/ExampleTag";
import { useDemoStream, type DemoHold, type DemoRow } from "@/hooks/useDemoStream";
import { fmtTime } from "@/lib/format";
import { dissolve, spring, TIME_DILATION } from "@/lib/motion";

/**
 * The threshold: proposed actions arrive on the left and are scored.
 * Allowed ones go quiet. Blocked ones are struck through. Held ones lift
 * out into the space on the right, float there in slowed time, and are
 * either released forward (approved) or dissolve (denied).
 */
export function ThresholdStream() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const [looking, setLooking] = useState(false);
  const { rows, holds, counts, resolve, remove } = useDemoStream({
    running: inView,
    dilation: looking ? TIME_DILATION : 1,
  });
  const pending = holds.filter((h) => h.status === "pending");
  const latest = pending[0];

  return (
    <section id="demo" ref={ref} aria-labelledby="demo-title" className="relative border-y border-line bg-sunken/60">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-24 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
          <div>
            <p className="label flex items-center gap-2.5">
              <span aria-hidden className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-breathe rounded-full bg-ink-2/50" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-ink-2" />
              </span>
              Live · simulated
            </p>
            <h2 id="demo-title" className="display-tight mt-5 max-w-[16ch] text-[clamp(2.2rem,5.5vw,4.25rem)] font-[300]">
              Most actions pass. A few wait. Rarely, one stops.
            </h2>
          </div>
          <dl className="flex gap-8 sm:gap-12" aria-label="Decisions in this session">
            {(
              [
                ["Passed", counts.ALLOW, "text-ink-2"],
                ["Held", counts.HOLD, "text-hold"],
                ["Stopped", counts.BLOCK, "text-block"],
              ] as const
            ).map(([label, n, tone]) => (
              <div key={label}>
                <dt className="label">{label}</dt>
                <dd className={`mt-1 font-mono text-3xl ${tone}`}>
                  <CountUp value={n} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10 grid gap-10 sm:mt-14 sm:gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-14">
          {/* Proposed */}
          <div>
            <div className="label flex justify-between border-b border-line pb-3">
              <span>Proposed</span>
              <span className="hidden sm:inline">Risk · decision</span>
            </div>
            <ol aria-label="Proposed actions" className="relative min-h-[13rem] lg:min-h-[23.5rem]">
              <AnimatePresence initial={false}>
                {rows.map((row) => (
                  <StreamRow key={row.id} row={row} />
                ))}
              </AnimatePresence>
            </ol>
          </div>

          {/* In abeyance */}
          <div
            onPointerEnter={() => setLooking(true)}
            onPointerLeave={() => setLooking(false)}
            onFocusCapture={() => setLooking(true)}
            onBlurCapture={() => setLooking(false)}
          >
            <div className="label flex justify-between border-b border-hold-line pb-3 !text-hold">
              <span>In abeyance</span>
              <span className="text-ink-3 transition-opacity duration-500" aria-hidden>
                {looking ? "Time slows while you look" : `${pending.length} held`}
              </span>
            </div>
            <div className="relative min-h-[10rem] pt-5 sm:min-h-[12rem] lg:min-h-[23.5rem]">
              <AnimatePresence>
                {holds.map((h, i) => (
                  <HeldCard key={h.id} hold={h} index={i} onResolve={resolve} onGone={remove} />
                ))}
              </AnimatePresence>
              {holds.length === 0 && (
                <p className="absolute inset-x-0 top-12 text-center font-mono text-xs text-ink-4 sm:top-16 lg:top-24">
                  <span className="inline-block animate-suspend">Nothing held right now.</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 text-xs text-ink-3">
          <ExampleTag />
          <span>
            Simulated with the mock risk model. Sped up, with risky actions over-represented so you can see holds.
            Approve or deny them yourself.
          </span>
        </div>

        <p className="sr-only" aria-live="polite">
          {latest ? `Held for review: ${latest.action.summary}` : ""}
        </p>
      </div>
    </section>
  );
}

function StreamRow({ row }: { row: DemoRow }) {
  const outcome = row.decision?.outcome ?? null;
  const quiet = outcome === "ALLOW";
  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: quiet ? 0.6 : 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      transition={{ ...spring.settle, opacity: { duration: quiet ? 1.6 : 0.4, delay: quiet ? 0.8 : 0 } }}
      className="grid h-[3.35rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 border-b border-line sm:grid-cols-[4.25rem_6.5rem_minmax(0,1fr)_auto]"
    >
      <time dateTime={row.action.proposedAt} className="hidden font-mono text-xs text-ink-3 sm:block">
        {fmtTime(row.action.proposedAt)}
      </time>
      <span className="hidden font-mono text-xs text-ink-2 sm:block">{row.action.tool}</span>
      <span
        className={`truncate text-sm ${outcome === "BLOCK" ? "text-ink-2 line-through decoration-block/70" : "text-ink"}`}
        title={row.action.summary}
      >
        <span className="mr-2 font-mono text-xs text-ink-3 sm:hidden">{row.action.tool}</span>
        {row.action.summary}
      </span>
      <span className="flex items-center justify-end gap-4">
        <span className="hidden md:inline-flex">
          <RiskMeter value={row.decision?.risk?.value ?? null} outcome={outcome} width="w-12" />
        </span>
        <span className="w-[5.5rem] text-right">
          {row.resolution ? (
            <span className={`font-mono text-micro uppercase tracking-[0.12em] ${row.resolution.status === "approved" ? "text-ink-2" : "text-ink-3"}`}>
              {row.resolution.status === "approved" ? "↗ Released" : "Dissolved"}
            </span>
          ) : (
            <DecisionMark outcome={outcome} pending={outcome === "HOLD"} />
          )}
        </span>
      </span>
    </motion.li>
  );
}

function HeldCard({
  hold,
  index,
  onResolve,
  onGone,
}: {
  hold: DemoHold;
  index: number;
  onResolve: (id: string, status: "approved" | "denied", by: string) => void;
  onGone: (id: string) => void;
}) {
  const [leaving, setLeaving] = useState(false);
  const resolved = hold.status !== "pending";

  // A resolved hold settles for a beat (the decision lands), then leaves.
  useEffect(() => {
    if (!resolved) return;
    const t = window.setTimeout(() => setLeaving(true), 650);
    return () => window.clearTimeout(t);
  }, [resolved]);

  const top = [...(hold.decision.risk?.factors ?? [])]
    .filter((f) => f.key !== "irreversibility")
    .sort((a, b) => b.value - a.value)[0];
  const remaining = 1 - hold.elapsed / hold.duration;

  const animate = !leaving
    ? { opacity: 1, x: 0, y: 0, scale: resolved ? 1.01 : 1 }
    : hold.status === "approved"
      ? { opacity: 0, x: 160, y: -6, scale: 1 }
      : { opacity: 0, x: 0, y: 10, scale: 0.94 };

  const transition = !leaving
    ? spring.drift
    : hold.status === "approved"
      ? { x: spring.release, y: spring.release, opacity: { duration: 0.55, delay: 0.12 } }
      : dissolve;

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, x: -28, y: 8, scale: 0.98 }}
      animate={animate}
      exit={{ opacity: 0 }}
      transition={transition}
      onAnimationComplete={() => leaving && onGone(hold.id)}
      aria-label={`Held: ${hold.action.summary}`}
      className="mb-4"
    >
      <div
        className={resolved ? "" : "animate-suspend"}
        style={{ animationDelay: `${-index * 1.7}s` }}
      >
        <div
          className={`relative overflow-hidden rounded-xl border p-4 transition-colors duration-500 ${
            resolved ? "border-line-strong bg-raised" : "border-hold-line bg-hold-soft/50"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <DecisionMark outcome="HOLD" pending={!resolved} />
            <span className="truncate font-mono text-xs text-ink-3">
              {hold.action.tool} · {hold.action.agent.id}
            </span>
          </div>
          <p className="mt-3 text-[15px] leading-snug text-ink">{hold.action.summary}</p>
          {top && <p className="mt-1.5 text-sm text-ink-2">{top.note}.</p>}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-xs text-ink-3">
              risk {hold.decision.risk?.value.toFixed(2)} → {hold.decision.approver?.name}
            </span>
            {resolved ? (
              <span className={`font-mono text-xs ${hold.status === "approved" ? "text-hold" : "text-ink-2"}`}>
                {hold.status === "approved" ? "Approved" : "Denied"} · {hold.by}
              </span>
            ) : (
              <span className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onResolve(hold.id, "denied", "You")}
                  className="h-10 touch-manipulation rounded-full border border-line-strong px-4 text-sm text-ink-2 transition-colors hover:border-block/60 hover:text-ink sm:h-7 sm:px-3 sm:text-xs"
                >
                  Deny
                </button>
                <button
                  type="button"
                  onClick={() => onResolve(hold.id, "approved", "You")}
                  className="h-10 touch-manipulation rounded-full bg-hold px-4 text-sm font-medium text-bg transition-transform hover:scale-[1.03] active:scale-95 sm:h-7 sm:px-3 sm:text-xs"
                >
                  Approve
                </button>
              </span>
            )}
          </div>

          {/* Countdown to the owner's decision (demo), in dilated time. */}
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-hold/10">
            <span
              className="block h-full origin-left bg-hold/60 transition-transform duration-100 ease-linear"
              style={{ transform: `scaleX(${resolved ? 0 : remaining})` }}
            />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
