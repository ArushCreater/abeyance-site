import { CountUp } from "@/components/type/CountUp";
import { ExampleTag } from "@/components/ui/ExampleTag";
import { SHADOW_REPORT as R } from "@/lib/mock-data";
import { fmtDay } from "@/lib/format";
import { TickField } from "./TickField";

export function ShadowProof() {
  const reduction = 1 - R.abeyanceReviews / R.baselineReviews;
  const hours = ((R.baselineReviews - R.abeyanceReviews) * R.minutesPerReview) / 60;

  return (
    <section id="proof" aria-labelledby="proof-title" className="border-t border-line">
      <div className="mx-auto max-w-[1200px] px-5 py-28 sm:px-8 md:py-40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="label">Shadow mode</p>
          <ExampleTag>Example data · illustrative 30-day run</ExampleTag>
        </div>
        <h2 id="proof-title" className="display-tight mt-5 max-w-[16ch] text-[clamp(2.2rem,5.5vw,4.25rem)] font-[300]">
          Fewer reviews. <span className="text-ink-3">Nothing missed.</span>
        </h2>
        <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-ink-2">
          Run Abeyance beside your current setup with nothing blocked. After a few weeks it tells you how many
          reviews you’d have needed instead of approving every call of a type, and which risky actions it would
          have caught.
        </p>

        <div className="mt-20 grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="space-y-12">
            <div>
              <p className="label">Approve every send, close and write</p>
              <p className="mt-2 font-mono text-[clamp(2.75rem,7vw,5rem)] leading-none tracking-[-0.04em] text-ink-3">
                <CountUp value={R.baselineReviews} />
              </p>
              <p className="mt-2 text-sm text-ink-3">reviews</p>
            </div>
            <div>
              <p className="label !text-hold">With Abeyance</p>
              <p className="mt-2 font-mono text-[clamp(2.75rem,7vw,5rem)] leading-none tracking-[-0.04em] text-hold">
                <CountUp value={R.abeyanceReviews} />
              </p>
              <p className="mt-2 text-sm text-ink-3">reviews, over the same actions</p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-12">
            <figure>
              <TickField
                count={R.baselineReviews}
                tone="var(--color-chart-base)"
                label={`${R.baselineReviews.toLocaleString("en-AU")} reviews with a per-type approval step, one mark per ten`}
              />
              <div className="mt-8">
                <TickField
                  count={R.abeyanceReviews}
                  tone="var(--color-chart-hold)"
                  label={`${R.abeyanceReviews.toLocaleString("en-AU")} reviews with Abeyance, one mark per ten`}
                />
              </div>
              <figcaption className="mt-4 font-mono text-xs text-ink-3">
                One mark = ten reviews · {fmtDay(R.periodStart)} to {fmtDay(R.periodEnd)} ·{" "}
                {R.totalProposed.toLocaleString("en-AU")} proposed actions
              </figcaption>
            </figure>

            <dl className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-line pt-8 sm:grid-cols-4">
              <Stat label="Fewer reviews">
                <CountUp value={reduction * 100} format="pct1" />
              </Stat>
              <Stat label="Risky caught">
                <CountUp value={R.highRiskCaught} />
                <span className="text-ink-3">/{R.highRiskLabelled}</span>
              </Stat>
              <Stat label="Missed">
                <CountUp value={R.highRiskLabelled - R.highRiskCaught} />
              </Stat>
              <Stat label="Hours back">
                <CountUp value={hours} />
              </Stat>
            </dl>
          </div>
        </div>

        <p className="mt-12 max-w-[70ch] text-xs leading-relaxed text-ink-3">
          Example data from a simulated deployment, not a customer result. “High-risk” means actions labelled
          risky in a post-hoc review; “caught” means held or blocked. Reviewer time assumes{" "}
          {R.minutesPerReview} minutes per review.
        </p>
      </div>
    </section>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="label">{label}</dt>
      <dd className="mt-2 font-mono text-2xl text-ink">{children}</dd>
    </div>
  );
}
