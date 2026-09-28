"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Honour prefers-reduced-motion everywhere: transforms are skipped, opacity kept. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
