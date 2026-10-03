import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { DraftBanner } from "./DraftBanner";
import { LegalToc } from "./LegalToc";

export type LegalSection = {
  /** Anchor, so a section can be linked to directly: /legal/privacy#rights */
  id: string;
  title: string;
  body: ReactNode;
};

/**
 * The shared frame for legal and trust pages: a reading column of about 68
 * characters, a sticky contents list on desktop, and the draft banner.
 */
export function LegalLayout({
  eyebrow,
  title,
  intro,
  sections,
  back = { href: "/legal", label: "All legal documents" },
}: {
  eyebrow: string;
  title: string;
  intro: ReactNode;
  sections: LegalSection[];
  back?: { href: string; label: string };
}) {
  const toc = sections.map(({ id, title }) => ({ id, title }));
  return (
    <>
      <SiteHeader />
      <main
        id="main"
        className="mx-auto max-w-[1200px] px-5 pb-24 pt-[calc(7rem+env(safe-area-inset-top,0px))] sm:px-8 sm:pb-32 sm:pt-40"
      >
        <div className="grid gap-x-16 lg:grid-cols-[13.5rem_minmax(0,1fr)] xl:gap-x-24">
          <aside className="hidden lg:block">
            <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pb-8">
              <BackLink {...back} />
              <nav aria-label="On this page" className="mt-12">
                <p className="label mb-4">On this page</p>
                <LegalToc items={toc} />
              </nav>
            </div>
          </aside>

          <article className="min-w-0 max-w-[40rem]">
            <header>
              <div className="lg:hidden">
                <BackLink {...back} />
              </div>
              <p className="label mt-10 flex items-center gap-3 lg:mt-0">
                <span aria-hidden className="h-px w-8 bg-ink-4" />
                {eyebrow}
              </p>
              <h1 className="display-tight mt-6 text-[clamp(2.5rem,6vw,4.25rem)] font-[300]">{title}</h1>
              <div className="mt-7 text-lg leading-relaxed text-ink-2">{intro}</div>
              <div className="mt-10">
                <DraftBanner />
              </div>
            </header>

            <details className="group mt-10 border-y border-line lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 [&::-webkit-details-marker]:hidden">
                <span className="label">On this page</span>
                <span aria-hidden className="text-lg leading-none text-ink-3 transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <nav aria-label="On this page" className="pb-5">
                <LegalToc items={toc} track={false} />
              </nav>
            </details>

            <div className="mt-16 sm:mt-20">
              {sections.map((s, i) => (
                <section key={s.id} aria-labelledby={s.id} className="mt-16 border-t border-line pt-8 first:mt-0 sm:mt-20">
                  <h2 id={s.id} className="flex scroll-mt-28 items-baseline gap-4">
                    <span aria-hidden className="w-6 shrink-0 font-mono text-xs text-ink-4">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="display-tight text-[clamp(1.6rem,3.2vw,2.1rem)] font-[320] !leading-[1.1]">{s.title}</span>
                  </h2>
                  <div className="legal-prose mt-6 sm:pl-10">{s.body}</div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 py-1 text-sm text-ink-3 transition-colors hover:text-ink">
      <span aria-hidden className="inline-block transition-transform duration-300 ease-out group-hover:-translate-x-1">
        ←
      </span>
      {label}
    </Link>
  );
}

/** A hairline table that scrolls sideways on small screens rather than squashing. */
export function LegalTable({ caption, head, rows }: { caption?: ReactNode; head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <table className={head.length > 2 ? "min-w-[34rem]" : undefined}>
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) =>
                j === 0 ? (
                  <th key={j} scope="row">
                    {c}
                  </th>
                ) : (
                  <td key={j}>{c}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
