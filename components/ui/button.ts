/** Button styles as class helpers so links and buttons share them. */
export type ButtonVariant = "primary" | "ghost" | "approve" | "deny" | "quiet";

const base =
  "group relative inline-flex select-none items-center justify-center gap-2 rounded-full text-sm font-medium transition-[transform,opacity,background-color,border-color,color] duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40";

const variants: Record<ButtonVariant, string> = {
  primary: "h-11 bg-ink px-5 text-bg hover:bg-white",
  ghost: "h-11 border border-line-strong px-5 text-ink hover:border-ink-3",
  approve: "h-11 bg-hold px-6 text-bg hover:bg-[#f3b457]",
  deny: "h-11 border border-line-strong px-6 text-ink-2 hover:border-block/60 hover:text-ink",
  quiet: "h-8 border border-line px-3 text-xs text-ink-2 hover:border-line-strong hover:text-ink",
};

export const buttonClass = (variant: ButtonVariant = "primary", extra = "") => `${base} ${variants[variant]} ${extra}`;

/** A small arrow that slides on hover. */
export const arrowClass = "inline-block transition-transform duration-300 ease-out group-hover:translate-x-1";
