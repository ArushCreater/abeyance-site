"use client";

import { useState } from "react";
import { Code } from "./Code";
import { Plate } from "./Essay";

const SNIPPETS = {
  TypeScript: `import { Abeyance } from "abeyance";
import { sendPayment } from "./tools"; // your existing tool

const abeyance = new Abeyance(); // reads ABEYANCE_API_KEY

await abeyance.guard({
  agent_id: "accounts-payable",
  tool: "send_payment",
  action: "payment.send",
  args: { payee: "vendor_42", amount: 600 },
  amount: 600,
  destination: "vendor_42",
  reversible: false,
}, () => sendPayment({ payee: "vendor_42", amount: 600 }));`,
  Python: `from abeyance import Abeyance
from tools import send_payment  # your existing tool

abeyance = Abeyance()  # reads ABEYANCE_API_KEY

abeyance.guard({
    "agent_id": "accounts-payable",
    "tool": "send_payment",
    "action": "payment.send",
    "args": {"payee": "vendor_42", "amount": 600},
    "amount": 600,
    "destination": "vendor_42",
    "reversible": False,
}, lambda: send_payment(payee="vendor_42", amount=600))`,
  "MCP proxy": `# Point your agent's MCP server URL at the proxy instead.
# Every tool call is checked before it reaches the server.

npx abeyance init --mcp

# .env
MCP_UPSTREAM_URL=https://tools.internal.example/mcp
MCP_TOOL_MAP={"send_payment": "payment.send"}

# Your agent now connects to:
http://127.0.0.1:8787/mcp`,
};
type Tab = keyof typeof SNIPPETS;

export function InstallFigure() {
  const [tab, setTab] = useState<Tab>("TypeScript");
  const tabs = Object.keys(SNIPPETS) as Tab[];
  return (
    <Plate>
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 sm:px-5">
        <div role="tablist" aria-label="Integration" className="-mb-px flex gap-5">
          {tabs.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`border-b py-3 text-[13px] transition-colors ${tab === t ? "border-ink text-ink" : "border-transparent text-ink-3 hover:text-ink"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <span className="hidden font-mono text-[12px] text-ink-4 sm:block">$ npx abeyance init</span>
      </div>
      <pre className="overflow-x-auto px-4 py-5 font-mono text-[12.5px] leading-[1.6] text-ink sm:px-6 sm:text-[13px]" tabIndex={0} role="tabpanel">
        <Code source={SNIPPETS[tab]} />
      </pre>
    </Plate>
  );
}
