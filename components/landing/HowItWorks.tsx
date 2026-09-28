"use client";

import { motion, useInView, useScroll, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import { CountUp } from "@/components/type/CountUp";
import { Typewriter } from "@/components/type/Typewriter";
import { spring } from "@/lib/motion";

/**
 * Five steps between intent and commit. A single example action — a refund
 * promise — travels through each station; a hairline draws down the page
 * as you scroll.
 */
export function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="how" aria-labelledby="how-title" className="mx-auto max-w-[1200px] px-5 py-28 sm:px-8 md:py-40">
      <p className="label">How it works</p>
      <h2 id="how-title" className="display-tight mt-5 max-w-[15ch] text-[clamp(2.2rem,5.5vw,4.25rem)] font-[300]">
        Five steps between intent and commit.
      </h2>
      <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink-2">
        Abeyance sits in the path of the action. Nothing irreversible happens until a decision is made and
        written down, and for most actions that takes well under half a second.
      </p>

      <ol ref={listRef} className="relative mt-20 md:mt-28">
        <span aria-hidden className="absolute bottom-0 left-[0.6rem] top-2 w-px bg-line md:left-[0.95rem]" />
        <motion.span
          aria-hidden
          className="absolute bottom-0 left-[0.6rem] top-2 w-px origin-top bg-ink-3 md:left-[0.95rem]"
          style={{ scaleY: progress }}
        />
        <Step n="01" title="Propose" body="Before calling the tool, the agent calls gate.propose() with the tool, arguments, its own identity, the user it's acting for, and context.">
          <ProposeArtifact />
        </Step>
        <Step
          n="02"
          title="Hard rules"
          body="Deterministic checks run first, in plain code: spending caps, recipient allowlists, blocked actions, business hours. Money, dates and audit logic never go through a model."
        >
          <RulesArtifact />
        </Step>
        <Step
          n="03"
          title="Risk score"
          body="A fast, calibrated risk model reads what the action actually says and does: how irreversible it is, blast radius, data sensitivity, whether it's unusual for this agent, any external commitment, and who receives it."
        >
          <RiskArtifact />
        </Step>
        <Step
          n="04"
          title="Decision"
          body="Allow, hold or block, against thresholds you set per action type. A hold goes to the person who owns that customer or process, with a plain-English reason and a timeout that defaults to deny."
        >
          <DecisionArtifact />
        </Step>
        <Step
          n="05"
          title="Ledger"
          body="Every decision and every approval is appended to a hash-chained audit ledger: what was attempted, the score, the rule or reason, who approved it and when. Export it to your SIEM."
          last
        >
          <LedgerArtifact />
        </Step>
      </ol>
    </section>
  );
}

function Step({ n, title, body, children, last }: { n: string; title: string; body: string; children: ReactNode; last?: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { once: true, margin: "-25% 0px" });
  return (
    <li ref={ref} className={`relative grid grid-cols-1 gap-8 pl-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 md:pl-16 ${last ? "" : "pb-24 md:pb-32"}`}>
      <span aria-hidden className="absolute left-0 top-1.5 flex h-[1.25rem] w-[1.25rem] items-center justify-center md:h-8 md:w-8 md:top-0">
        <span className="absolute inset-0 rounded-full border border-line bg-bg" />
        <motion.span
          className="absolute inset-[5px] rounded-full bg-ink md:inset-[11px]"
          initial={{ scale: 0 }}
          animate={{ scale: seen ? 1 : 0 }}
          transition={spring.settle}
        />
      </span>
      <div>
        <p className="font-mono text-xs text-ink-3">{n}</p>
        <h3 className="mt-2 font-display text-2xl font-[420] tracking-[-0.02em] [font-variation-settings:'wdth'_86] md:text-3xl">{title}</h3>
        <p className="mt-4 max-w-[42ch] leading-relaxed text-ink-2">{body}</p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={seen ? { opacity: 1, y: 0 } : undefined}
        transition={{ ...spring.settle, delay: 0.1 }}
        className="min-w-0"
      >
        <div className="rounded-xl border border-line bg-raised/60 p-5 sm:p-6">{children}</div>
      </motion.div>
    </li>
  );
}

/* ----------------------------- artifacts ----------------------------- */

const K = ({ children }: { children: ReactNode }) => <span className="text-ink">{children}</span>;
const S = ({ children }: { children: ReactNode }) => <span className="text-ink-2">{children}</span>;
const C = ({ children }: { children: ReactNode }) => <span className="text-ink-4">{children}</span>;

function ProposeArtifact() {
  return (
    <pre className="overflow-x-auto font-mono text-[12.5px] leading-[1.75] text-ink-3" aria-label="Python SDK example">
      <C># LangGraph tool node, Python SDK</C>
      {"\n"}
      <K>decision</K> = <K>gate</K>.propose(
      {"\n"}    tool=<S>&quot;email.send&quot;</S>,
      {"\n"}    args={"{"}<S>&quot;to&quot;</S>: customer.email, <S>&quot;body&quot;</S>: draft{"}"},
      {"\n"}    agent=<S>&quot;claims-assist&quot;</S>,
      {"\n"}    on_behalf_of=<S>&quot;p.raman&quot;</S>,
      {"\n"}    context={"{"}<S>&quot;customer_id&quot;</S>: <S>&quot;C-20417&quot;</S>{"}"},
      {"\n"})
      {"\n"}
      {"\n"}
      <K>if</K> decision.outcome == <S>&quot;ALLOW&quot;</S>:
      {"\n"}    send(draft)
      {"\n"}
      <K>elif</K> decision.outcome == <S>&quot;HOLD&quot;</S>:
      {"\n"}    <K>await</K> decision.wait()  <C># approved → send, denied/timeout → reason</C>
    </pre>
  );
}

function RulesArtifact() {
  const ref = useRef<HTMLUListElement>(null);
  const seen = useInView(ref, { once: true, margin: "-20% 0px" });
  const rules = [
    ["spending_cap", "$4,800 ≤ $5,000 cap"],
    ["recipient_allowlist", "customer of record"],
    ["blocked_action", "email.send permitted"],
    ["business_hours", "not a campaign send"],
  ];
  return (
    <ul ref={ref} className="divide-y divide-line font-mono text-[12.5px]" aria-label="Hard rule results">
      {rules.map(([rule, detail], i) => (
        <li key={rule} className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
          <span className="text-ink">{rule}</span>
          <span className="flex items-center gap-3 text-right text-ink-3">
            <span className="hidden sm:inline">{detail}</span>
            <motion.span
              className="text-allow"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={seen ? { opacity: 1, scale: 1 } : undefined}
              transition={{ ...spring.ui, delay: 0.25 + i * 0.16 }}
            >
              pass
            </motion.span>
          </span>
        </li>
      ))}
    </ul>
  );
}

const FACTORS: [string, number][] = [
  ["External commitment", 0.92],
  ["Irreversibility", 0.9],
  ["Unusual for this agent", 0.51],
  ["Recipient", 0.08],
  ["Data sensitivity", 0.05],
  ["Blast radius", 0.15],
];

function RiskArtifact() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-20% 0px" });
  return (
    <div ref={ref}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="label">Risk</p>
          <p className="mt-1 font-mono text-4xl text-hold">
            <CountUp value={0.71} format="fixed2" />
          </p>
        </div>
        <p className="text-right font-mono text-xs leading-relaxed text-ink-3">
          confidence 0.93
          <br />
          scored in 142 ms
        </p>
      </div>
      <ul className="mt-6 space-y-3" aria-label="Risk factors">
        {FACTORS.map(([label, v], i) => (
          <li key={label} className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)_2.5rem] items-center gap-4 text-sm">
            <span className="truncate text-ink-2">{label}</span>
            <span className="relative h-[3px] overflow-hidden rounded-full bg-line">
              <motion.span
                className={`absolute inset-0 origin-left rounded-full ${v > 0.5 ? "bg-ink-2" : "bg-ink-4"}`}
                initial={{ scaleX: 0 }}
                animate={seen ? { scaleX: v } : undefined}
                transition={{ ...spring.settle, delay: 0.15 + i * 0.07 }}
              />
            </span>
            <span className="text-right font-mono text-xs text-ink-3">{v.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 border-t border-line pt-4 text-sm text-ink-2">
        “Promises a $4,800 refund and a 12-month premium waiver. This agent has never offered a waiver before.”
      </p>
    </div>
  );
}

function DecisionArtifact() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-20% 0px" });
  return (
    <div ref={ref}>
      <div className="relative overflow-hidden pb-2 pt-10">
        <div className="flex h-[3px] overflow-hidden rounded-full">
          <span className="h-full bg-allow/35" style={{ width: "50%" }} />
          <span className="h-full bg-hold/60" style={{ width: "42%" }} />
          <span className="h-full bg-block/50" style={{ width: "8%" }} />
        </div>
        <div className="mt-3 grid grid-cols-[50fr_42fr_8fr] font-mono text-micro uppercase tracking-[0.12em] text-ink-3">
          <span>Allow</span>
          <span>Hold · 0.50</span>
          <span className="text-right">0.92</span>
        </div>
        {/* Full-width track translated by a % of its own width = % of the scale. */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 top-0"
          initial={{ x: "0%", opacity: 0 }}
          animate={seen ? { x: "71%", opacity: 1 } : undefined}
          transition={{ ...spring.settle, delay: 0.3 }}
        >
          <span className="flex w-10 -translate-x-1/2 flex-col items-center">
            <span className="font-mono text-xs text-hold">0.71</span>
            <span className="mt-1 h-5 w-px bg-hold" />
          </span>
        </motion.div>
      </div>
      <div className="mt-8 rounded-lg border border-hold-line bg-hold-soft/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-hold">Hold</span>
          <span className="font-mono text-xs text-ink-3">auto-deny in 15:00</span>
        </div>
        <p className="mt-2 text-sm text-ink">
          Routed to <span className="text-ink">Maya Okafor</span>
          <span className="text-ink-3">, team lead who owns this customer · Slack</span>
        </p>
      </div>
    </div>
  );
}

function LedgerArtifact() {
  const lines = [
    "#18243  09:41:05  decision.allow  ticket.update  support-triage  risk=0.06",
    "#18244  09:41:07  decision.hold   email.send     claims-assist   risk=0.71  → a.okafor",
  ];
  return (
    <div className="overflow-x-auto font-mono text-[12px] leading-[1.9]">
      <div className="min-w-[42rem]">
        {lines.map((l) => (
          <p key={l} className="whitespace-pre text-ink-3">
            {l}
          </p>
        ))}
        <p className="whitespace-pre text-ink">
          <Typewriter text="#18245  09:43:52  hold.approved   email.send     claims-assist   by=Maya Okafor via slack" cps={70} delay={0.4} />
        </p>
        <p className="mt-3 whitespace-pre text-ink-4">prev=3fa9…c1d0  hash=91be…07aa  chain ✓</p>
      </div>
    </div>
  );
}
