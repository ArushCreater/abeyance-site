import { CONSOLE_URL, DOCS_URL } from "@/lib/site";
import { InstallLine } from "./InstallLine";

/**
 * The opening: a full-bleed field of soft light, and one sentence.
 * The ember streak travels, slows almost to a stop, waits, then carries on.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <div aria-hidden className="field">
        <span className="field-bloom" />
        <span className="field-ember" />
        <span className="field-haze" />
        <span className="field-grain" />
      </div>
      <div className="mx-auto w-full max-w-[1240px] px-5 pb-[12svh] text-center sm:px-8">
        <h1 id="hero-title" className="mx-auto max-w-[17ch] text-balance font-serif text-[clamp(2.5rem,6vw,5.1rem)] font-[380] leading-[1.03] tracking-[-0.02em] text-ink [font-variation-settings:'opsz'_72]">
          Abeyance asks before your AI agents do anything that matters.
        </h1>
        <p className="mx-auto mt-6 max-w-[46ch] text-pretty font-serif text-[clamp(1.1rem,1.6vw,1.3rem)] leading-relaxed text-ink-2">
          Rules you write decide what runs, what waits for a person, and what never happens. Every decision is kept on a record you can prove.
        </p>
        <div className="mt-9 flex flex-col items-center gap-4">
          <InstallLine />
          <div className="flex items-center gap-6 text-[14px]">
            <a href={`${CONSOLE_URL}/login?mode=signup`} className="font-medium text-ink underline decoration-ink/25 underline-offset-[5px] transition-colors hover:decoration-ink">
              Start free
            </a>
            <a href={`${DOCS_URL}/quickstart`} className="text-ink-2 underline decoration-ink/15 underline-offset-[5px] transition-colors hover:text-ink hover:decoration-ink/60">
              Read the quickstart
            </a>
          </div>
        </div>
      </div>
      <a href="#story" aria-label="Read on" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ink-3 transition-colors hover:text-ink">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <path d="M3 5.5 7 9.5 11 5.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
