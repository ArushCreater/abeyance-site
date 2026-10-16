"use client";

import { useState } from "react";

/** The one command, with a quiet copy affordance. */
export function InstallLine({ className = "" }: { className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText("npx abeyance init");
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 1800);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={`group inline-flex h-11 items-center gap-3 rounded-full border border-line-strong bg-bg/70 pl-4 pr-3 font-mono text-[14px] text-ink backdrop-blur-sm transition-colors hover:border-ink/40 ${className}`}
      aria-label="Copy the install command: npx abeyance init"
    >
      <span className="text-ink-4">$</span>
      npx abeyance init
      <span className="ml-1 w-14 text-right font-sans text-[12px] text-ink-3 transition-colors group-hover:text-ink" aria-live="polite">
        {state === "copied" ? "Copied" : state === "failed" ? "Select it" : "Copy"}
      </span>
    </button>
  );
}
