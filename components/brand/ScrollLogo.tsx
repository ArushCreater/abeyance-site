"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { WORDMARK, WORDMARK_VIEWBOX } from "./Logo";

/**
 * The header wordmark, which folds into its "a" once you scroll.
 *
 * "beyance" slides left and disappears under the leading "a" (a clip that
 * ends at the a's right edge, so each letter vanishes exactly as it
 * passes beneath it). Only the "a" stays while you're down the page;
 * back at the top, the word slides out again.
 */

const SPLIT = WORDMARK.indexOf("M56.9 71.15"); // where "b" begins
const A = WORDMARK.slice(0, SPLIT);
const REST = WORDMARK.slice(SPLIT);
const A_RIGHT = 50.6; // the a's right edge, in wordmark units
const REST_WIDTH = 411 - 51.8;

export function ScrollLogo({ className = "" }: { className?: string }) {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const [folded, setFolded] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    // A little hysteresis so it doesn't flicker at the threshold.
    if (!folded && y > 32) setFolded(true);
    else if (folded && y < 8) setFolded(false);
  });

  const ease = [0.65, 0, 0.35, 1] as const;
  const t = reduce ? { duration: 0 } : { duration: folded ? 0.75 : 0.85, ease };

  return (
    <Link href="/" aria-label="Abeyance home" className={`inline-flex items-center text-ink transition-opacity hover:opacity-80 ${className}`}>
      <svg viewBox={WORDMARK_VIEWBOX} className="h-[23px] w-auto overflow-visible" aria-hidden>
        <defs>
          <clipPath id="wordmark-rest">
            <rect x={A_RIGHT} y={-20} width={420} height={140} />
          </clipPath>
        </defs>
        <g clipPath="url(#wordmark-rest)">
          <motion.path
            d={REST}
            fill="currentColor"
            initial={false}
            animate={folded ? { x: -REST_WIDTH, opacity: 0.35 } : { x: 0, opacity: 1 }}
            transition={t}
          />
        </g>
        <motion.path
          d={A}
          fill="currentColor"
          initial={false}
          // The a leans into the sweep, then settles.
          animate={folded ? { x: [0, 3, 0] } : { x: [0, -2, 0] }}
          transition={reduce ? { duration: 0 } : { duration: 0.75, ease, times: [0, 0.45, 1] }}
        />
      </svg>
    </Link>
  );
}
