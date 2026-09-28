import { SuspendedText } from "@/components/type/SuspendedText";
import { arrowClass, buttonClass } from "@/components/ui/button";
import { SIGN_IN_URL } from "@/lib/site";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative mx-auto max-w-[1200px] px-5 pb-20 pt-36 sm:px-8 sm:pt-44 md:pb-28">
      <p className="label mb-8 flex items-center gap-3">
        <span aria-hidden className="h-px w-8 bg-hold" />
        The commit control for AI agents
      </p>

      <h1
        id="hero-title"
        className="display-tight text-[clamp(3rem,10vw,8.25rem)] font-[280] text-ink"
      >
        <SuspendedText text="Let agents act." className="block" delay={0.05} />
        <span className="block">
          <SuspendedText text="Hold" suspend delay={0.55} holdMs={2400} hesitate={2} replayOnHover className="cursor-default" axis={{ held: "'wght' 200, 'wdth' 75, 'opsz' 96", rest: "'wght' 300, 'wdth' 82, 'opsz' 96" }} />{" "}
          <SuspendedText text="what matters." delay={0.75} />
        </span>
      </h1>

      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <p className="max-w-[48ch] text-lg leading-relaxed text-ink-2 sm:text-xl">
          Before an agent sends the email, writes the CRM record or closes the ticket, Abeyance reads what it’s
          about to do and scores the risk. Most actions go straight through. The few that matter wait for one
          click from the right person.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a href="#partner" className={buttonClass("primary")}>
            Become a design partner <span aria-hidden className={arrowClass}>→</span>
          </a>
          <a href={SIGN_IN_URL} className={buttonClass("ghost")}>
            Sign in <span aria-hidden className={arrowClass}>↗</span>
          </a>
        </div>
      </div>

      <p className="mt-16 font-mono text-xs text-ink-3">Humans only for the actions that matter.</p>
    </section>
  );
}
