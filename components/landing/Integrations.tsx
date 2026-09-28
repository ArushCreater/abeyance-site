const ITEMS: { name: string; role: string; status: "v1" | "planned" }[] = [
  { name: "LangGraph", role: "Python SDK: gate.propose() as a tool wrapper or graph node", status: "v1" },
  { name: "MCP gateways", role: "External decision service behind the gateway’s policy hook, e.g. agentgateway", status: "v1" },
  { name: "Slack", role: "Approver cards with one-click approve or deny", status: "v1" },
  { name: "Microsoft Teams", role: "Approver cards with one-click approve or deny", status: "v1" },
  { name: "OpenAI Agents SDK", role: "Scored approvals in place of blanket needsApproval", status: "planned" },
  { name: "Your SIEM", role: "Ledger export as JSON Lines or CSV", status: "v1" },
];

export function Integrations() {
  return (
    <section id="integrations" aria-labelledby="int-title" className="border-t border-line">
      <div className="mx-auto grid max-w-[1200px] gap-14 px-5 py-28 sm:px-8 md:py-36 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <div>
          <p className="label">Integrations</p>
          <h2 id="int-title" className="display-tight mt-5 max-w-[14ch] text-[clamp(2rem,4.5vw,3.25rem)] font-[300]">
            Plugs into what you already run.
          </h2>
          <p className="mt-6 max-w-[40ch] leading-relaxed text-ink-2">
            Use our SDK directly, or let your existing agent gateway call Abeyance for the decision. We make your
            gateway smarter rather than replacing it.
          </p>
        </div>
        <ul className="border-t border-line">
          {ITEMS.map((item) => (
            <li key={item.name} className="group relative border-b border-line">
              <span
                aria-hidden
                className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-hold transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-x-100"
              />
              <div className="grid gap-1 py-5 transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:translate-x-2 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto] sm:items-baseline sm:gap-6">
                <span className="font-display text-xl font-[420] tracking-[-0.02em] [font-variation-settings:'wdth'_88] sm:text-2xl">
                  {item.name}
                </span>
                <span className="text-sm text-ink-3">{item.role}</span>
                <span
                  className={`font-mono text-micro uppercase tracking-[0.12em] ${item.status === "v1" ? "text-ink-2" : "text-ink-3"}`}
                >
                  {item.status === "v1" ? "Version one" : "Planned"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
