"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment, useCallback, useEffect, useRef, useState, type ElementType } from "react";
import { spring, stagger } from "@/lib/motion";

type Phase = "hidden" | "rise" | "suspend" | "settle";

/**
 * Letters that arrive, hesitate, hang in the air, and settle.
 *
 * Arrive: each letter springs up from below, staggered.
 * Suspend (optional): the word lifts off its baseline, turns amber and
 *   floats slowly, with one letter lagging behind the others.
 * Settle: it comes down onto the baseline and the amber cross-fades out.
 *
 * Only transform and opacity animate. The amber is a second, stacked copy
 * of each glyph whose opacity cross-fades, so colour never repaints.
 */
export function SuspendedText({
  text,
  as: Tag = "span",
  suspend = false,
  delay = 0,
  holdMs = 2200,
  hesitate,
  replayOnHover = false,
  axis,
  className = "",
}: {
  text: string;
  as?: ElementType;
  suspend?: boolean;
  delay?: number;
  holdMs?: number;
  /** Index of the letter that hesitates. Defaults to the second letter. */
  hesitate?: number;
  replayOnHover?: boolean;
  /**
   * Optional variable-font moment: axis settings while held vs at rest,
   * e.g. { held: "'wght' 200, 'wdth' 75", rest: "'wght' 300, 'wdth' 82" }.
   * This is the one deliberate non-transform animation: a single word,
   * once, as it settles.
   */
  axis?: { held: string; rest: string };
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("hidden");
  const timers = useRef<number[]>([]);
  const letters = Array.from(text);
  const lagIndex = hesitate ?? Math.min(1, letters.length - 1);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const run = useCallback(
    (initialDelayMs: number) => {
      clear();
      const at = (ms: number, p: Phase) => timers.current.push(window.setTimeout(() => setPhase(p), ms));
      if (!suspend) {
        at(initialDelayMs, "settle");
        return;
      }
      at(initialDelayMs, "rise");
      at(initialDelayMs + 650, "suspend");
      at(initialDelayMs + 650 + holdMs, "settle");
    },
    [suspend, holdMs],
  );

  useEffect(() => {
    if (reduce) {
      // Same markup as the server render; just skip straight to rest.
      const t = window.setTimeout(() => setPhase("settle"), 0);
      return () => window.clearTimeout(t);
    }
    run(delay * 1000);
    return clear;
  }, [reduce, run, delay]);

  const replay = () => {
    if (!replayOnHover || !suspend || reduce || phase !== "settle") return;
    clear();
    setPhase("rise");
    timers.current.push(window.setTimeout(() => setPhase("suspend"), 500));
    timers.current.push(window.setTimeout(() => setPhase("settle"), 500 + holdMs * 0.8));
  };

  const held = phase === "rise" || phase === "suspend";

  // Group letters into words so lines only break between words.
  const words: { ch: string; i: number }[][] = [[]];
  letters.forEach((ch, i) => (ch === " " ? words.push([]) : words[words.length - 1].push({ ch, i })));

  const renderLetter = (ch: string, i: number) => {
    const lag = i === lagIndex;
    const y =
      phase === "hidden"
        ? "0.45em"
        : phase === "rise"
          ? lag
            ? "-0.06em"
            : "-0.16em"
          : phase === "suspend"
            ? lag
              ? ["-0.1em", "-0.2em", "-0.1em"]
              : ["-0.16em", "-0.22em", "-0.16em"]
            : "0em";
    const transition =
      phase === "suspend"
        ? { duration: 3.4 + (i % 3) * 0.4, repeat: Infinity, ease: "easeInOut" as const, delay: i * 0.08 }
        : phase === "settle"
          ? { ...spring.settle, delay: (lag ? 0.18 : 0) + (held ? 0 : i * stagger.letters) }
          : { ...spring.settle, delay: (lag ? 0.22 : 0) + i * stagger.letters };
    return (
      <motion.span
        key={i}
        aria-hidden
        className="relative inline-block whitespace-pre"
        initial={{ opacity: 0, y: "0.45em" }}
        animate={{ opacity: phase === "hidden" ? 0 : 1, y }}
        transition={transition}
      >
        {ch}
        {suspend && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 select-none text-hold"
            initial={{ opacity: 0 }}
            animate={{ opacity: held ? 1 : 0 }}
            transition={{ duration: held ? 0.5 : 1.1, ease: "easeInOut", delay: held ? i * 0.03 : 0.1 + i * 0.03 }}
          >
            {ch}
          </motion.span>
        )}
      </motion.span>
    );
  };

  return (
    <Tag
      className={className}
      onPointerEnter={replay}
      style={
        axis
          ? {
              fontVariationSettings: held ? axis.held : axis.rest,
              transition: `font-variation-settings ${held ? 0.6 : 1.4}s cubic-bezier(0.2, 0.7, 0.2, 1)`,
            }
          : undefined
      }
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, w) => (
          <Fragment key={w}>
            <span className="inline-block whitespace-nowrap">{word.map(({ ch, i }) => renderLetter(ch, i))}</span>
            {w < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
