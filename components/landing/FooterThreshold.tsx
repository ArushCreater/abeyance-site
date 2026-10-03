"use client";

import { motion, type Variants } from "motion/react";
import { spring } from "@/lib/motion";

/** Where the held dot sits along the threshold, as a share of its width. */
const AT = 64;
const TICKS = 41;

/*
 * The footer's threshold: a hairline scale from allow to block with a gap in
 * it, and one amber dot suspended in the gap, waiting for a person. Purely
 * decorative. It draws in once on springs; after that the dot floats and
 * breathes in CSS, which collapses to rest under reduced motion.
 */
export function FooterThreshold({ className = "" }: { className?: string }) {
  const draw = (delay: number): Variants => ({
    hidden: { scaleX: 0 },
    shown: { scaleX: 1, transition: { ...spring.settle, delay } },
  });
  const fade = (delay: number): Variants => ({
    hidden: { opacity: 0 },
    shown: { opacity: 1, transition: { ...spring.settle, delay } },
  });

  return (
    <motion.div
      aria-hidden
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.8 }}
      className={`relative select-none ${className}`}
    >
      <div className="relative h-px">
        {/* The line breaks around the dot, as the held word lifts off its baseline. */}
        <motion.span variants={draw(0)} className="absolute inset-y-0 left-0 origin-left bg-line-strong" style={{ right: `calc(${100 - AT}% + 14px)` }} />
        <motion.span variants={draw(0.45)} className="absolute inset-y-0 right-0 origin-left bg-line-strong" style={{ left: `calc(${AT}% + 14px)` }} />

        <span className="absolute top-0 -translate-x-1/2 -translate-y-1/2" style={{ left: `${AT}%` }}>
          <motion.span
            variants={{
              hidden: { opacity: 0, y: -14 },
              shown: { opacity: 1, y: 0, transition: { ...spring.drift, delay: 0.3 } },
            }}
            className="block"
          >
            <span className="block animate-suspend">
              <span className="relative flex size-2.5">
                <span className="absolute -inset-1.5 animate-breathe rounded-full bg-hold/20" />
                <span className="relative size-2.5 rounded-full bg-hold" />
              </span>
            </span>
          </motion.span>
        </span>
      </div>

      {/* Ticks hang from the line like a scale. Every other one drops out on small screens. */}
      <motion.div variants={fade(0.2)} className="relative mt-2 h-1.5">
        {Array.from({ length: TICKS }, (_, i) => {
          const left = (i / (TICKS - 1)) * 100;
          if (Math.abs(left - AT) < 2) return null;
          return (
            <span
              key={i}
              className={`absolute top-0 w-px bg-ink-4 ${i % 10 === 0 ? "h-1.5" : "h-1 opacity-60"} ${i % 2 ? "max-sm:hidden" : ""}`}
              style={{ left: `${left}%` }}
            />
          );
        })}
      </motion.div>

      <motion.div variants={fade(0.6)} className="label relative mt-3 h-4">
        <span className="absolute left-0">Allow</span>
        {/* A zero-width anchor at the dot's position; the label overflows it equally on both sides.
            The left padding balances the tracking after the last letter, so the visible word is centred. */}
        <span className="absolute top-0 flex w-0 justify-center" style={{ left: `${AT}%` }}>
          <span className="whitespace-nowrap pl-[0.14em]">Hold</span>
        </span>
        <span className="absolute right-0">Block</span>
      </motion.div>
    </motion.div>
  );
}
