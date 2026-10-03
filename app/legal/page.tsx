import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { DocList } from "@/components/legal/DocList";
import { DraftBanner } from "@/components/legal/DraftBanner";
import { LEGAL_DOCS, TRUST_PAGES } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Legal",
  description: "Abeyance’s terms, privacy policy, data processing addendum, acceptable use, subprocessors, cookies, pilot terms and vulnerability disclosure policy.",
};

export default function LegalIndexPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-[1200px] px-5 pb-24 pt-[calc(7rem+env(safe-area-inset-top,0px))] sm:px-8 sm:pb-32 sm:pt-40">
        <header className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-20">
          <div>
            <p className="label flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-ink-4" />
              Legal
            </p>
            <h1 className="display-tight mt-6 text-[clamp(2.6rem,6vw,4.5rem)] font-[300]">
              The fine print,
              <span className="block text-ink-3">written to be read.</span>
            </h1>
          </div>
          <p className="max-w-[44ch] text-lg leading-relaxed text-ink-2 lg:pb-2">
            Short sentences, plain English, and the legal detail only where it is needed. Every document here is a draft until it has had legal
            review.
          </p>
        </header>

        <div className="mt-12 max-w-[48rem]">
          <DraftBanner />
        </div>

        <div className="mt-20 space-y-20 sm:mt-24">
          <DocList id="docs-legal" label="Documents" docs={LEGAL_DOCS} />
          <DocList id="docs-trust" label="Trust" docs={TRUST_PAGES} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
