import { LAST_UPDATED, LAST_UPDATED_ISO } from "@/lib/legal";

/** Carried by every legal and trust page until a lawyer has reviewed it. */
export function DraftBanner() {
  return (
    <div role="note" aria-label="Document status" className="border border-dashed border-line-strong bg-raised/60 px-5 py-4 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <p className="flex items-baseline gap-3 text-[15px] text-ink">
          <span aria-hidden className="relative top-[-1px] size-1.5 shrink-0 rounded-full bg-ink-2" />
          Draft, not legal advice, pending legal review.
        </p>
        <p className="label shrink-0">
          Last updated <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED}</time>
        </p>
      </div>
      <p className="mt-2 pl-[1.125rem] text-sm leading-relaxed text-ink-3">
        Text in <span className="font-mono text-[0.84em] text-ink-2">[square brackets]</span> is a detail we have not filled in yet.
      </p>
    </div>
  );
}
