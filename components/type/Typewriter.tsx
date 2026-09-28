"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Writes a line character by character, like the ledger committing it.
 * Screen readers get the full text immediately.
 */
export function Typewriter({
  text,
  cps = 90,
  delay = 0,
  startOnView = true,
  caret = true,
  className = "",
}: {
  text: string;
  /** Characters per second. */
  cps?: number;
  delay?: number;
  startOnView?: boolean;
  caret?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  const go = !startOnView || inView;

  useEffect(() => {
    if (!go) return;
    let raf = 0;
    if (reduce) {
      raf = requestAnimationFrame(() => setCount(text.length));
      return () => cancelAnimationFrame(raf);
    }
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t + delay * 1000;
      const n = Math.max(0, Math.floor(((t - start) / 1000) * cps));
      setCount(Math.min(n, text.length));
      if (n < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [go, reduce, text, cps, delay]);

  const shown = count;
  const done = shown >= text.length;

  return (
    <span ref={ref} className={`relative ${className}`}>
      <span aria-hidden>
        {text.slice(0, shown)}
        {caret && !done && (
          <span className="relative inline-block w-0">
            <span className="absolute left-px top-[0.1em] h-[1em] w-[0.5ch] bg-hold/80" />
          </span>
        )}
        <span className="invisible">{text.slice(shown)}</span>
      </span>
      <span className="sr-only left-0 top-0">{text}</span>
    </span>
  );
}
