"use client";

import { useState } from "react";
import { DOCS_URL } from "@/lib/site";
import { demoDecision, DEMO_POLICY } from "@/lib/policy-demo.mjs";
import { LogoMark } from "@/components/brand/Logo";

const ACTIONS = [
  { value: "payment.send", label: "Send a payment", icon: "↗" },
  { value: "email.send", label: "Send an email", icon: "✉" },
  { value: "file.delete", label: "Delete a file", icon: "×" },
];

export function PolicyPlayground() {
  const [action, setAction] = useState("payment.send");
  const [amount, setAmount] = useState(600);
  const [external, setExternal] = useState(true);
  const [environment, setEnvironment] = useState("production");
  const [review, setReview] = useState<"approved" | "denied" | null>(null);
  const result = demoDecision(action, amount, external, environment);
  const pending = result.outcome === "HOLD" && !review;
  const title = action === "payment.send" ? `$${amount.toLocaleString("en-US")} to vendor_42` : action === "email.send" ? `Email to ${external ? "client@example.com" : "team@yourcompany.com"}` : `Delete /exports/customer-data.csv`;
  return <section className="product-demo section-wrap" id="how" aria-labelledby="demo-title">
    <div className="section-intro"><h2 id="demo-title" className="section-heading">Give every action<br />a clear answer.</h2><p className="section-description">Your agent proposes an action. Your rules decide what happens next. Try it with a payment, an email, or a file delete.</p></div>
    <div className="flow-demo">
      <fieldset className="action-picker"><legend className="sr-only">Choose an example action</legend>{ACTIONS.map(item => <label key={item.value} className={action === item.value ? "selected" : ""}><input type="radio" name="example-action" value={item.value} checked={action === item.value} onChange={() => { setAction(item.value); setReview(null); }} /><span aria-hidden>{item.icon}</span>{item.label}</label>)}</fieldset>
      <div className="demo-columns">
        <div className="proposed-action"><div className="window-title"><span className="agent-avatar" aria-hidden>↗</span><div><strong>Your agent</strong><span>Proposing a tool call</span></div></div><div className="action-name"><code>{action}</code><h3>{title}</h3></div>
          {action === "payment.send" ? <div className="demo-input"><label htmlFor="payment-amount">Payment amount <output htmlFor="payment-amount">${amount.toLocaleString("en-US")}</output></label><input id="payment-amount" type="range" min="0" max="1500" step="50" value={amount} onChange={e => { setAmount(Number(e.target.value)); setReview(null); }} /><div className="range-labels"><span>$0</span><span>$500 approval limit</span><span>$1,500</span></div></div> : action === "email.send" ? <label className="demo-checkbox"><input type="checkbox" checked={external} onChange={e => { setExternal(e.target.checked); setReview(null); }} /> Recipient is outside your organisation</label> : <div className="demo-input"><label htmlFor="delete-environment">Environment</label><select id="delete-environment" value={environment} onChange={e => { setEnvironment(e.target.value); setReview(null); }}><option value="production">Production</option><option value="development">Development</option></select></div>}
          <div className="matched-rule"><span>Matched policy</span><code>{result.rule}</code><p>{result.reason}</p></div>
        </div>
        <div className="decision-preview" aria-live="polite" aria-atomic="true">
          <div className="decision-heading"><LogoMark className="h-7 w-7 text-cobalt" /><strong>Abeyance</strong><span className={`decision-badge badge-${result.outcome.toLowerCase()}`}>{result.outcome}</span></div>
          {pending ? <><h3>Ready for your approval.</h3><p>The tool has paused. In your workspace, this request arrives in Slack with the action, rule and redacted arguments.</p><div className="approval-card"><div><span className="slack-icon" aria-hidden>✳</span><strong>Approve this action?</strong></div><p>{title}</p><div className="approval-buttons"><button type="button" className="approve" onClick={() => setReview("approved")}>Approve <span aria-hidden>✓</span></button><button type="button" onClick={() => setReview("denied")}>Deny <span aria-hidden>×</span></button></div></div></> : <><div className={`outcome-icon ${review === "denied" || result.outcome === "BLOCK" ? "stopped" : "allowed"}`} aria-hidden>{review === "denied" || result.outcome === "BLOCK" ? "×" : "↗"}</div><h3>{review === "approved" ? "Approved. The agent resumes." : review === "denied" ? "Denied. The action stops." : result.outcome === "BLOCK" ? "Blocked before it runs." : "Allowed to run."}</h3><p>{review === "approved" ? "The guard releases this tool call after approval. Your agent can continue its work." : review === "denied" ? "The guarded function does not execute. The agent receives the reason." : result.outcome === "BLOCK" ? "The policy prevents this action. A risk score cannot override the block." : "The guard calls the wrapped function and returns its result to your agent."}</p></>}
          <div className="mini-audit"><span aria-hidden>⤷</span><div><strong>{pending ? "Awaiting a reviewer" : "Decision added to the audit trail"}</strong><p>{pending ? "Timeout: 15 minutes · deny by default" : `${result.outcome} rule${review ? ` → ${review} by you` : ""} · policy v1`}</p></div></div>
          {review && <button type="button" className="reset-demo" onClick={() => setReview(null)}>Replay this example ↺</button>}
        </div>
      </div>
      <p className="demo-disclosure">Interactive example. No tools are executed and no Slack message is sent.</p>
    </div>
    <div className="outcome-explainer"><div><span className="decision-badge badge-allow">ALLOW</span><p>Let routine work run.</p></div><div><span className="decision-badge badge-hold">HOLD</span><p>Wait for a human decision.</p></div><div><span className="decision-badge badge-block">BLOCK</span><p>Stop it before it happens.</p></div></div>
  </section>;
}

const SNIPPETS = {
  TypeScript: `import { Abeyance } from "./abeyance/client.mjs";
import { sendPayment } from "./tools"; // your existing tool

const abeyance = new Abeyance(); // reads your API key and URL

await abeyance.guard({
  agent_id: "accounts-payable",
  tool: "send_payment",
  action: "payment.send",
  args: { payee: "vendor_42", amount: 600 },
  amount: 600,
}, () => sendPayment({ payee: "vendor_42", amount: 600 }));

// The function runs only after a final ALLOW or approval.`,
  Python: `from abeyance import Gate
from tools import send_payment  # your existing tool

gate = Gate()  # reads your API key and URL

gate.guard({
    "agent_id": "accounts-payable",
    "tool": "send_payment",
    "action": "payment.send",
    "args": {"payee": "vendor_42", "amount": 600},
    "amount": 600,
}, lambda: send_payment(payee="vendor_42", amount=600))

# A matching HOLD rule pauses until a final decision.`,
  MCP: `# After downloading the CLI from your console:
node abeyance.mjs init --mcp

# Set these in .env with your Abeyance API key and URL:
# MCP_UPSTREAM_URL=https://your-server.example/mcp
# MCP_TOOL_MAP={"send_payment":"payment.send"}

# Start the proxy in front of your existing MCP server.
node --env-file=.env abeyance/proxy.mjs

# Set your agent's MCP server URL to:
# http://127.0.0.1:8787/mcp`,
};

export function DeveloperStart() {
  const [tab, setTab] = useState<keyof typeof SNIPPETS>("TypeScript");
  const [copied, setCopied] = useState<"idle" | "done" | "error">("idle");
  async function copy() { try { await navigator.clipboard.writeText(SNIPPETS[tab]); setCopied("done"); } catch { setCopied("error"); } }
  return <section id="start" className="developer-section section-wrap"><div className="developer-grid"><div><h2 className="section-heading">Your tools.<br />One extra guard.</h2><p className="section-description">Keep the agent you already built. Wrap the function that sends a payment, changes a record, or calls an external tool. Abeyance checks permission before your code executes.</p><ol className="setup-steps"><li><span>1</span><div><h3>Create a workspace</h3><p>Get an API key and connect your Slack channel.</p></div></li><li><span>2</span><div><h3>Run the installer</h3><p>Download the SDK or local MCP proxy from your console.</p></div></li><li><span>3</span><div><h3>Wrap a tool and set a rule</h3><p>Try your first held action with the payment template.</p></div></li></ol><a href={`${DOCS_URL}/quickstart`} className="text-link">Follow the quickstart <span aria-hidden>→</span></a></div><div className="code-editor"><div className="code-toolbar"><div role="tablist" aria-label="Integration example" onKeyDown={e => { const tabs = Object.keys(SNIPPETS) as (keyof typeof SNIPPETS)[]; const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!delta && e.key !== "Home" && e.key !== "End") return; e.preventDefault(); const next = e.key === "Home" ? tabs[0] : e.key === "End" ? tabs[tabs.length - 1] : tabs[(tabs.indexOf(tab) + delta + tabs.length) % tabs.length]; setTab(next); setCopied("idle"); document.getElementById(`sdk-${next}`)?.focus(); }}>{(Object.keys(SNIPPETS) as (keyof typeof SNIPPETS)[]).map(lang => <button key={lang} role="tab" aria-selected={tab === lang} aria-controls="sdk-example" id={`sdk-${lang}`} tabIndex={tab === lang ? 0 : -1} onClick={() => { setTab(lang); setCopied("idle"); }}>{lang}</button>)}</div><button type="button" onClick={copy} className="copy-button" aria-live="polite">{copied === "done" ? "Copied ✓" : copied === "error" ? "Select code to copy" : "Copy"}</button></div><pre id="sdk-example" role="tabpanel" aria-labelledby={`sdk-${tab}`} tabIndex={0}><code>{SNIPPETS[tab]}</code></pre><div className="code-footer">{tab === "MCP" ? "Your existing MCP server stays behind the proxy." : "A denied or blocked action never calls your function."}</div></div></div><div id="integrations" className="framework-list"><p>Works around your existing tools</p><span>LangChain</span><span>OpenAI Agents SDK</span><span>CrewAI</span><span>MCP</span><span>HTTP API</span></div></section>;
}

export function PolicyEditor() {
  return <section id="policies" className="policy-section"><div className="section-wrap developer-grid"><div><h2 className="section-heading">Write down<br />your boundaries.</h2><p className="section-description">Hold payments over $500. Block deletes in production. Ask before emailing someone outside your company. Policies are readable YAML, versioned with every decision.</p><p className="section-description">Start with a template, edit it in the dashboard, and test an action before saving. The same action and policy produce the same rule decision.</p><a href={`${DOCS_URL}/operate/policies`} className="text-link">Explore policies <span aria-hidden>→</span></a></div><div className="policy-code"><div className="window-title"><span className="file-icon" aria-hidden>≡</span><strong>abeyance.yaml</strong><span>Shadow scoring</span></div><pre tabIndex={0}><code>{DEMO_POLICY}</code></pre></div></div></section>;
}
