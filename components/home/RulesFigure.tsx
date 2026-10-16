"use client";

import { useMemo, useState } from "react";
import { demoDecision, DEMO_POLICY } from "@/lib/policy-demo.mjs";
import { Code } from "./Code";
import { Plate } from "./Essay";

const ACTIONS = [
  { id: "payment.send", label: "Send a payment" },
  { id: "email.send", label: "Send an email" },
  { id: "file.delete", label: "Delete a file" },
] as const;

const OUTCOME = {
  ALLOW: { word: "Allow", tone: "text-allow", note: "The guard calls your function and returns its result." },
  HOLD: { word: "Hold", tone: "text-ember", note: "The call pauses and an approval card goes to Slack." },
  BLOCK: { word: "Block", tone: "text-block", note: "Your function never runs. The agent gets the reason." },
} as const;

/** Which lines of the policy a rule occupies, so the one that decides can be lit. */
function ruleLines(policy: string, id: string): [number, number] | null {
  const lines = policy.split("\n");
  const start = lines.findIndex((l) => l.includes(`- id: ${id}`));
  if (start < 0) return null;
  let end = lines.findIndex((l, i) => i > start && l.includes("- id:"));
  if (end < 0) end = lines.length;
  return [start, end - 1];
}

export function RulesFigure() {
  const [action, setAction] = useState<(typeof ACTIONS)[number]["id"]>("payment.send");
  const [amount, setAmount] = useState(600);
  const [external, setExternal] = useState(true);
  const [env, setEnv] = useState<"production" | "development">("production");
  const result = demoDecision(action, amount, external, env) as { outcome: keyof typeof OUTCOME; rule: string; reason: string };
  const lit = useMemo(() => ruleLines(DEMO_POLICY, result.rule), [result.rule]);
  const o = OUTCOME[result.outcome];

  return (
    <Plate className="grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <div className="border-b border-line md:border-b-0 md:border-r">
        <p className="border-b border-line px-5 py-3 font-mono text-[12px] text-ink-3">abeyance.yaml</p>
        <pre className="overflow-x-auto py-4 font-mono text-[12.5px] leading-[1.6] text-ink" tabIndex={0}>
          {DEMO_POLICY.split("\n").map((line, i) => {
            const on = lit && i >= lit[0] && i <= lit[1];
            return (
              <span key={i} className={`block px-5 transition-colors duration-300 ${on ? "bg-[#f4efe9] shadow-[inset_2px_0_0_var(--color-ember)]" : ""}`}>
                <Code source={line} />
              </span>
            );
          })}
        </pre>
      </div>
      <div className="flex flex-col p-5 sm:p-7">
        <p className="text-[13px] text-ink-3">Test an action</p>
        <div role="radiogroup" aria-label="Action" className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {ACTIONS.map((a) => (
            <button
              key={a.id}
              role="radio"
              aria-checked={action === a.id}
              onClick={() => setAction(a.id)}
              className={`border-b pb-1 text-[14px] transition-colors ${action === a.id ? "border-ink text-ink" : "border-transparent text-ink-3 hover:text-ink"}`}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="mt-6 min-h-[5.5rem]">
          {action === "payment.send" && (
            <label className="block">
              <span className="flex items-baseline justify-between text-[13px] text-ink-3">
                Amount <output className="font-mono text-[15px] text-ink">${amount.toLocaleString("en-US")}</output>
              </span>
              <input type="range" min={0} max={1500} step={50} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-3 w-full accent-[#15171c]" />
              <span className="mt-1 flex justify-between font-mono text-[11px] text-ink-4">
                <span>$0</span>
                <span>hold above $500</span>
                <span>$1,500</span>
              </span>
            </label>
          )}
          {action === "email.send" && (
            <label className="flex items-center gap-3 text-[14px] text-ink-2">
              <input type="checkbox" checked={external} onChange={(e) => setExternal(e.target.checked)} className="size-4 accent-[#15171c]" />
              The recipient is outside your company
            </label>
          )}
          {action === "file.delete" && (
            <div role="radiogroup" aria-label="Environment" className="flex gap-5 text-[14px]">
              {(["production", "development"] as const).map((e) => (
                <button key={e} role="radio" aria-checked={env === e} onClick={() => setEnv(e)} className={`border-b pb-1 capitalize ${env === e ? "border-ink text-ink" : "border-transparent text-ink-3 hover:text-ink"}`}>
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto border-t border-line pt-5" aria-live="polite">
          <p className={`font-serif text-[2.6rem] leading-none tracking-[-0.02em] ${o.tone}`}>{o.word}</p>
          <p className="mt-3 text-[14px] leading-relaxed text-ink">{result.reason}</p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-3">{o.note}</p>
          <p className="mt-3 font-mono text-[11.5px] text-ink-4">rule {result.rule} · policy v1</p>
        </div>
      </div>
    </Plate>
  );
}
