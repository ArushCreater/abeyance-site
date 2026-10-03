import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { DocList } from "@/components/legal/DocList";
import { DraftBanner } from "@/components/legal/DraftBanner";
import { LEGAL_DOCS, TRUST_PAGES, type LegalDoc } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Trust centre",
  description:
    "Security, subprocessors, data processing, responsible AI, vulnerability disclosure and the honest status of Abeyance’s certifications.",
};

const pick = (list: LegalDoc[], hrefs: string[]) => hrefs.map((h) => list.find((d) => d.href === h)).filter((d): d is LegalDoc => !!d);

const DOCS = [
  ...pick(TRUST_PAGES, ["/security", "/responsible-ai"]),
  ...pick(LEGAL_DOCS, ["/legal/subprocessors", "/legal/dpa", "/legal/vulnerability-disclosure", "/legal/privacy"]),
];

const STATUS = [
  { name: "SOC 2", status: "Not yet certified", note: "Our controls are described on the Security page in the meantime." },
  { name: "ISO 27001", status: "Not yet certified", note: "We will say so here when that changes." },
  { name: "EU AI Act", status: "Not certified", note: "Designed to help you provide human oversight under Article 14." },
  { name: "Evidence pack", status: "In the product", note: "Maps decisions and controls to APRA CPS 230, the EU AI Act and the NIST AI RMF." },
];

const GLANCE = [
  ["Fails closed", "If the risk model is unavailable, the action is held for a person."],
  ["Tamper-evident ledger", "Append-only and SHA-256 hash-chained. Updates and deletes are rejected by the database."],
  ["Redacted before scoring", "Structured personal identifiers are redacted before an action reaches a model."],
  ["Hosted in Singapore", "Or keep data in your own Postgres, in the region you choose."],
];

export default function TrustPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-[1200px] px-5 pb-24 pt-[calc(7rem+env(safe-area-inset-top,0px))] sm:px-8 sm:pb-32 sm:pt-40">
        <header className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-20">
          <div>
            <p className="label flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-ink-4" />
              Trust centre
            </p>
            <h1 className="display-tight mt-6 text-[clamp(2.6rem,6vw,4.5rem)] font-[300]">
              Shown, not claimed.
              <span className="block text-ink-3">Including what we don’t have yet.</span>
            </h1>
          </div>
          <p className="max-w-[44ch] text-lg leading-relaxed text-ink-2 lg:pb-2">
            Abeyance asks you to trust it with the actions you cannot take back. Here is how it is built, who it relies on, and the honest status of
            our certifications.
          </p>
        </header>

        <div className="mt-12 max-w-[48rem]">
          <DraftBanner />
        </div>

        <section aria-labelledby="glance" className="mt-20 sm:mt-24">
          <h2 id="glance" className="label">
            At a glance
          </h2>
          <dl className="mt-5 grid gap-x-12 border-t border-line sm:grid-cols-2 lg:grid-cols-4 lg:border-t-0">
            {GLANCE.map(([t, d]) => (
              <div key={t} className="border-b border-line py-6 lg:border-b-0 lg:border-t lg:pb-0">
                <dt className="text-lg font-[480] tracking-[-0.01em]">{t}</dt>
                <dd className="mt-2 leading-relaxed text-ink-2">{d}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="status" className="mt-20 sm:mt-28">
          <h2 id="status" className="label">
            Certifications and frameworks
          </h2>
          <ul className="mt-5 border-t border-line">
            {STATUS.map((s) => (
              <li
                key={s.name}
                className="grid gap-x-6 gap-y-1.5 border-b border-line py-5 sm:grid-cols-[minmax(0,14rem)_minmax(0,12rem)_minmax(0,1fr)] sm:items-baseline"
              >
                <span className="font-display text-xl font-[420] tracking-[-0.02em] [font-variation-settings:'wdth'_88]">{s.name}</span>
                <span className="label flex items-center gap-2 !text-ink-2">
                  <span aria-hidden className="size-1.5 rounded-full border border-ink-3" />
                  {s.status}
                </span>
                <span className="text-[15px] leading-relaxed text-ink-3">{s.note}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-20 sm:mt-28">
          <DocList id="trust-docs" label="Read more" docs={DOCS} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
