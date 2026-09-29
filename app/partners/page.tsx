import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { PartnerForm } from "@/components/partners/PartnerForm";

export const metadata: Metadata = {
  title: "Design partners",
  description:
    "We’re working with a small number of regulated teams who have agents ready to go but can’t risk the irreversible actions. Request a conversation.",
};

const GET = [
  "A shadow-mode report on your own agent traffic",
  "Policies and thresholds tuned with you, per action type",
  "A direct line to the founding team in Sydney",
];
const ASK = [
  "One agent that takes real actions, or soon will",
  "A couple of weeks in shadow mode, with nothing blocked",
  "Honest feedback, about once a fortnight",
];

export default function PartnersPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-[1200px] px-5 pb-24 pt-[calc(7rem+env(safe-area-inset-top,0px))] sm:px-8 sm:pb-32 sm:pt-40">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="label flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-hold" />
              Design partners
            </p>
            <h1 className="display-tight mt-6 text-[clamp(2.6rem,6vw,4.5rem)] font-[300]">
              Switch the agents on.
              <span className="block text-ink-3">Keep the few that matter in abeyance.</span>
            </h1>
            <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-ink-2">
              We’re working with a small number of regulated teams in fintech, insurance operations, regtech and platform
              engineering who have agents ready to go but can’t risk the irreversible actions.
            </p>

            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <List title="You get" items={GET} accent />
              <List title="We ask" items={ASK} />
            </div>
          </div>

          <div className="min-w-0">
            <PartnerForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function List({ title, items, accent }: { title: string; items: string[]; accent?: boolean }) {
  return (
    <div>
      <p className="label">{title}</p>
      <ul className="mt-4 border-t border-line">
        {items.map((t) => (
          <li key={t} className="flex gap-4 border-b border-line py-3.5 text-[15px] leading-snug text-ink-2">
            <span aria-hidden className={`mt-[0.6em] h-px w-3 shrink-0 ${accent ? "bg-hold" : "bg-ink-4"}`} />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
