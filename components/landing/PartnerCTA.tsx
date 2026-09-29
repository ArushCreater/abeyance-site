import { SuspendedText } from "@/components/type/SuspendedText";
import { arrowClass, buttonClass } from "@/components/ui/button";

/** The home page's closing invitation. The form itself lives on /partners. */
export function PartnerCTA() {
  return (
    <section id="partner" aria-labelledby="partner-title" className="border-t border-line">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-end lg:py-36">
        <div>
          <p className="label">Design partners</p>
          <h2 id="partner-title" className="display-tight mt-5 text-[clamp(2.4rem,6.5vw,5rem)] font-[300]">
            <SuspendedText text="Switch the agents on." className="block" />
            <span className="block text-ink-3">Keep the few that matter in abeyance.</span>
          </h2>
        </div>
        <div className="lg:pb-3">
          <p className="max-w-[40ch] text-lg leading-relaxed text-ink-2">
            A small number of regulated teams, a shadow-mode report on their own traffic, and a direct line to us.
          </p>
          <a href="/partners" className={buttonClass("primary", "mt-8 !h-12 w-full !px-6 text-[15px] sm:w-auto")}>
            Become a design partner <span aria-hidden className={arrowClass}>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
