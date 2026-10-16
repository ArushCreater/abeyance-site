import { CONSOLE_URL } from "@/lib/site";

export const PLANS = [
  {
    name: "Free",
    price: "$0",
    per: "forever",
    blurb: "Everything you need to put your first agent behind rules and approvals.",
    items: ["1 agent", "1,000 actions a month", "7 days of audit log", "YAML rules and the dashboard editor", "Slack approvals", "Jev shadow scoring", "CSV export"],
    cta: { href: `${CONSOLE_URL}/login?mode=signup`, label: "Start free" },
    primary: true,
  },
  {
    name: "Team",
    price: "Usage",
    per: "based",
    blurb: "For teams with more agents, longer memory, and someone who asks for evidence.",
    items: ["More agents and actions", "Unlimited audit log", "Signed PDF evidence reports", "Assisted mode, when you opt in", "SSO", "Priority support"],
    cta: { href: "/partners", label: "Talk to us" },
    primary: false,
  },
] as const;

export function Plans() {
  return (
    <div className="mx-auto grid max-w-[920px] gap-px overflow-hidden rounded-[18px] border border-line bg-line sm:grid-cols-2">
      {PLANS.map((p) => (
        <div key={p.name} className="flex flex-col bg-white p-7 sm:p-10">
          <p className="text-[14px] font-medium text-ink">{p.name}</p>
          <p className="mt-4 font-serif text-[3rem] leading-none tracking-[-0.025em] text-ink">
            {p.price} <span className="font-sans text-[14px] tracking-normal text-ink-3">{p.per}</span>
          </p>
          <p className="mt-4 max-w-[34ch] font-serif text-[1.05rem] leading-snug text-ink-2">{p.blurb}</p>
          <ul className="mt-7 flex-1 space-y-2.5 text-[14.5px] text-ink-2">
            {p.items.map((i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden className="mt-[9px] h-px w-3 shrink-0 bg-ink-4" />
                {i}
              </li>
            ))}
          </ul>
          <a
            href={p.cta.href}
            className={
              p.primary
                ? "island-cta mt-9 inline-flex w-fit"
                : "mt-9 inline-flex h-9 w-fit items-center rounded-full border border-line-strong px-4 text-[14px] text-ink transition-colors hover:border-ink/45"
            }
          >
            {p.cta.label}
          </a>
        </div>
      ))}
    </div>
  );
}
