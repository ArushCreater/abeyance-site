"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * A number that counts to its value on a spring when it scrolls into view,
 * and glides between values when it changes. The final value is always in
 * the DOM for screen readers; the animated digits are aria-hidden.
 */
const PRESETS = {
  int: (n: number) => Math.round(n).toLocaleString("en-AU"),
  pct1: (n: number) => `${n.toFixed(1)}%`,
  fixed2: (n: number) => n.toFixed(2),
};

export function CountUp({
  value,
  format: formatProp = "int",
  from = 0,
  className = "",
}: {
  value: number;
  /** A preset name (usable from Server Components) or a formatter. */
  format?: keyof typeof PRESETS | ((n: number) => string);
  from?: number;
  className?: string;
}) {
  const format = typeof formatProp === "string" ? PRESETS[formatProp] : formatProp;
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef<number | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  // Before it's seen, show the start value (after hydration, so SSR has the real one).
  useEffect(() => {
    if (!reduce && current.current === null && ref.current) {
      ref.current.textContent = format(from);
    }
  }, [format, from, reduce]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = format(value);
      current.current = value;
      return;
    }
    const start = current.current ?? from;
    const controls = animate(start, value, {
      type: "spring",
      stiffness: 38,
      damping: 16,
      restDelta: 0.5,
      onUpdate: (v) => {
        current.current = v;
        el.textContent = format(v);
      },
      onComplete: () => {
        el.textContent = format(value);
      },
    });
    return () => controls.stop();
  }, [value, inView, reduce, format, from]);

  return (
    <span className={`tabular-nums ${className}`}>
      <span ref={ref} aria-hidden>
        {format(value)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}
