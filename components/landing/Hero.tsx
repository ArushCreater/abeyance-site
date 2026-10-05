import { SuspendedText } from "@/components/type/SuspendedText";
import { arrowClass, buttonClass } from "@/components/ui/button";
import { SIGN_IN_URL } from "@/lib/site";
import { Cradle } from "./Cradle";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative mx-auto grid max-w-[1200px] px-5 pb-16 pt-[calc(7rem+env(safe-area-inset-top,0px))] sm:px-8 sm:pb-20 sm:pt-40 lg:pb-28 lg:pt-44 xl:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] xl:items-center xl:gap-10 xl:pt-40"
    >
      <div className="min-w-0">
        <p className="label mb-6 flex items-center gap-3 sm:mb-8">
          <span aria-hidden className="h-px w-8 bg-hold" />
          The commit control for AI agents
        </p>

        <h1 id="hero-title" className="display-tight text-[clamp(2.9rem,12.5vw,8.25rem)] font-[280] text-ink xl:text-[7rem]">
          <SuspendedText text="Let agents act." className="block" delay={0.05} />
          <span className="block">
            <SuspendedText
              text="Hold"
              suspend
              delay={0.55}
              holdMs={2400}
              hesitate={2}
              staysAmber
              axis={{ held: "'wght' 200, 'wdth' 75, 'opsz' 96", rest: "'wght' 300, 'wdth' 82, 'opsz' 96" }}
            />{" "}
            <SuspendedText text="what matters." delay={0.75} />
          </span>
        </h1>

        <div className="mt-9 grid gap-8 sm:mt-12 sm:gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end xl:mt-12 xl:grid-cols-1 xl:gap-8">
          <p className="max-w-[48ch] text-[1.0625rem] leading-relaxed text-ink-2 sm:text-xl">
            Before an agent sends the email, writes the CRM record or closes the ticket, Abeyance reads what it’s
            about to do and scores the risk. Most actions go straight through. The few that matter wait for one
            click from the right person.
          </p>
          <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center">
            <a href="/partners" className={buttonClass("primary", "!h-12 sm:!h-11")}>
              Become a design partner <span aria-hidden className={arrowClass}>→</span>
            </a>
            <a href={SIGN_IN_URL} className={buttonClass("ghost", "!h-12 sm:!h-11")}>
              Sign in <span aria-hidden className={arrowClass}>↗</span>
            </a>
          </div>
        </div>

        <p className="mt-12 font-mono text-xs text-ink-3 sm:mt-16 xl:mt-12">Humans only for the actions that matter.</p>
      </div>

      <Cradle className="hidden aspect-square w-full xl:block" />
    </section>
  );
}
