import { DOCS_URL } from "@/lib/site";

const POINTS = [
  {
    title: "Append-only, hash-chained ledger",
    body: "Every decision and approval commits to the entry before it. Any edit or deletion breaks the chain, and verification shows exactly where.",
  },
  {
    title: "Money, dates and audit stay in plain code",
    body: "Spending caps, allowlists and business hours are deterministic, testable and versioned. A model never decides a limit.",
  },
  {
    title: "Default deny",
    body: "If nobody answers a hold before its timeout, the action doesn’t happen and the agent gets a structured reason.",
  },
  {
    title: "Exports to your SIEM",
    body: "The full ledger as JSON Lines or CSV, with reason codes and hashes, ready for the tools your security team already watches.",
  },
  {
    title: "Shadow mode first",
    body: "Run beside your current approval step with nothing blocked until the numbers earn your trust.",
  },
  {
    title: "Reasons, not silent failures",
    body: "Blocked and denied agents get a machine-readable reason code, so they can recover, escalate or tell the user.",
  },
];

export function Security() {
  return (
    <section id="security" aria-labelledby="sec-title" className="border-t border-line bg-sunken/60">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28 lg:py-40">
        <p className="label">Security &amp; audit</p>
        <h2 id="sec-title" className="display-tight mt-5 max-w-[17ch] text-[clamp(2.2rem,5.5vw,4.25rem)] font-[300]">
          Built like a control system, not a chatbot.
        </h2>
        <a href={`${DOCS_URL}/security`} className="group mt-6 inline-flex items-center gap-2 py-2 text-sm text-ink-2 transition-colors hover:text-ink">
          <span className="h-px w-4 bg-hold transition-all duration-300 group-hover:w-6" aria-hidden />
          Security in the docs <span aria-hidden>↗</span>
        </a>
        <dl className="mt-12 grid gap-x-16 gap-y-10 sm:mt-16 sm:gap-y-12 md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {POINTS.map((p, i) => (
            <div key={p.title} className="border-t border-line pt-6">
              <dt className="flex items-baseline gap-4">
                <span className="w-5 shrink-0 font-mono text-xs text-ink-4">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-lg font-[480] tracking-[-0.01em]">{p.title}</span>
              </dt>
              <dd className="mt-3 pl-9 leading-relaxed text-ink-2">{p.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
