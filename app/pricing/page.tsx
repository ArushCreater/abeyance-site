import type { Metadata } from "next";
import { pageMeta } from "@/lib/social";
import { Plans } from "@/components/home/Plans";
import { InstallLine } from "@/components/home/InstallLine";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { DOCS_URL } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Pricing",
  description:
    "Free for your first agent: 1,000 actions a month, Slack approvals and shadow scoring. Pay when your agents do more.",
  path: "/pricing",
});

const COMPARE: { feature: string; free: string; team: string }[] = [
  { feature: "Agents", free: "1", team: "As many as you need" },
  { feature: "Actions a month", free: "1,000", team: "Usage-based" },
  { feature: "Audit log", free: "7 days", team: "Unlimited" },
  { feature: "Rules (YAML and dashboard)", free: "Yes", team: "Yes" },
  { feature: "Slack approvals", free: "Yes", team: "Yes" },
  { feature: "Jev shadow scoring", free: "Yes", team: "Yes" },
  { feature: "Assisted mode", free: "—", team: "Per action type, when you opt in" },
  { feature: "CSV export", free: "Yes", team: "Yes" },
  { feature: "Signed PDF evidence reports", free: "—", team: "Yes" },
  { feature: "SSO", free: "—", team: "Yes" },
];

const QUESTIONS = [
  { q: "What counts as an action?", a: "Each tool call your agent asks Abeyance about counts once, whatever the answer: allowed, held or blocked. Approving or denying a held action doesn’t count again." },
  { q: "What happens at 1,000 actions on the free plan?", a: "Further actions that month get a clear limit error instead of a decision. The SDK fails closed, so the guarded function doesn’t run, and your agent can tell someone. The count resets on the first of the month." },
  { q: "What happens to entries older than seven days on the free plan?", a: "They drop out of the dashboard and exports. Moving to Team keeps the whole log from then on." },
  { q: "Can I run Abeyance myself?", a: "Yes. A self-hosted console has no plan limits; you run it, its database and its models. The docs cover Kubernetes and containers." },
  { q: "Do I need a card to start?", a: "No. Create a workspace, connect one agent and try your first approval for free." },
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="pb-24 pt-36 sm:pt-44">
        <div className="mx-auto max-w-[760px] px-5 text-center">
          <h1 className="font-serif text-[clamp(2.6rem,6vw,4.4rem)] font-[380] leading-[1.03] tracking-[-0.02em] text-ink">Pricing</h1>
          <p className="mx-auto mt-5 max-w-[44ch] text-balance font-serif text-[clamp(1.1rem,1.6vw,1.3rem)] leading-relaxed text-ink-2">
            Free for your first agent. Pay when your agents do more, and when someone starts asking for evidence.
          </p>
        </div>

        <div className="mt-14 px-5 sm:mt-16">
          <Plans />
        </div>

        <section aria-labelledby="compare-h" className="mx-auto mt-24 max-w-[920px] px-5">
          <h2 id="compare-h" className="text-[1.375rem] font-medium tracking-[-0.015em] text-ink">
            Side by side
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[14.5px]">
              <thead>
                <tr className="border-b border-line-strong text-[13px] text-ink-3 [&>th]:pb-3 [&>th]:font-normal">
                  <th className="w-[44%]">Feature</th>
                  <th>Free</th>
                  <th>Team</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r.feature} className="border-b border-line [&>td]:py-3.5">
                    <td className="text-ink">{r.feature}</td>
                    <td className="text-ink-2">{r.free}</td>
                    <td className="text-ink-2">{r.team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="pq-h" className="mx-auto mt-24 max-w-[660px] px-5">
          <h2 id="pq-h" className="text-[1.375rem] font-medium tracking-[-0.015em] text-ink">
            Questions about pricing
          </h2>
          <div className="mt-6">
            {QUESTIONS.map((f) => (
              <details key={f.q} className="group border-b border-line py-5 first:border-t">
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 font-serif text-[1.2rem] leading-snug text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="font-sans text-[18px] text-ink-4 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-[58ch] font-serif text-[1.07rem] leading-relaxed text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-24 px-5 text-center">
          <p className="mx-auto max-w-[22ch] text-balance font-serif text-[clamp(1.8rem,3.6vw,2.8rem)] font-[380] leading-[1.1] tracking-[-0.02em] text-ink">
            Five minutes from install to your first approval.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <InstallLine />
            <a href={`${DOCS_URL}/quickstart`} className="text-[14px] text-ink-2 underline decoration-ink/15 underline-offset-[5px] hover:text-ink">
              Read the quickstart
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
