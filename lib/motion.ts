/**
 * Motion tokens. Everything moves on springs; nothing is linear.
 *
 * - settle:  things arriving and coming to rest (slightly underdamped)
 * - release: an approved hold moving forward, decisive but not abrupt
 * - ui:      small interface responses (hover, press, toggles)
 * - drift:   slow, time-dilated movement around held items
 * - dissolve: a denied hold letting go (opacity + scale only)
 */
import type { Transition } from "motion/react";

export const spring = {
  settle: { type: "spring", stiffness: 140, damping: 20, mass: 1 },
  release: { type: "spring", stiffness: 190, damping: 24, mass: 0.9 },
  ui: { type: "spring", stiffness: 520, damping: 38, mass: 0.6 },
  drift: { type: "spring", stiffness: 42, damping: 14, mass: 1.4 },
} satisfies Record<string, Transition>;

export const dissolve: Transition = { duration: 0.9, ease: [0.33, 0, 0.2, 1] };

/** Stagger for letters and list items. */
export const stagger = {
  letters: 0.035,
  rows: 0.05,
};

/** Held items run in slowed time: their animations take this much longer. */
export const TIME_DILATION = 2.4;
