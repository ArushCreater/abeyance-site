import Link from "next/link";
import type { LegalDoc } from "@/lib/legal";

/** A hairline list of documents, used by the legal index and the trust centre. */
export function DocList({ docs, label, id }: { docs: LegalDoc[]; label: string; id: string }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="label">
        {label}
      </h2>
      <ul className="mt-5 border-t border-line">
        {docs.map((d, i) => (
          <li key={d.href} className="border-b border-line">
            <Link
              href={d.href}
              className="group grid grid-cols-[2rem_minmax(0,1fr)_auto] items-baseline gap-x-3 py-6 sm:grid-cols-[3rem_minmax(0,16rem)_minmax(0,1fr)_auto] sm:gap-x-6"
            >
              <span aria-hidden className="font-mono text-xs text-ink-4">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-[1.375rem] font-[380] leading-tight tracking-[-0.02em] text-ink transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] [font-variation-settings:'wdth'_86] group-hover:translate-x-1 sm:text-2xl">
                {d.title}
              </span>
              <span className="col-start-2 mt-1.5 text-[15px] leading-relaxed text-ink-3 sm:col-start-3 sm:row-start-1 sm:mt-0">{d.summary}</span>
              <span
                aria-hidden
                className="col-start-3 row-start-1 text-ink-4 transition-[transform,color] duration-300 ease-out group-hover:translate-x-1 group-hover:text-ink sm:col-start-4"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
