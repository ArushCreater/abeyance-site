"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { DOCS_URL } from "@/lib/site";
import { ActionSculpture } from "./ActionSculpture";

const CHAPTERS = [
  { number: "01", eyebrow: "Your rules. The final say.", title: "A boundary you can read.", text: "Hold payments over $500. Block deletes in production. Allow reads. Put the policy in YAML, review it in Git, and know exactly why an action stopped.", code: "payment.amount > 500 → HOLD", label: "Rule matched", tone: "hold" },
  { number: "02", eyebrow: "A pause. Then a person.", title: "One tap. Back in motion.", text: "A $600 payment waits in Slack, with its arguments, the rule that caught it, and a risk score alongside. Approve to resume. Deny to abort. No answer? Denied.", code: "approved_by: you\nstatus: resumed", label: "Human approved", tone: "allow" },
  { number: "03", eyebrow: "The action leaves a trace.", title: "Nothing lost between steps.", text: "The action, policy, score and human decision become one verifiable story. Every audit entry connects to the one before it. Search it. Export it. Prove what happened.", code: "previous_hash → entry → next_hash", label: "Chain verified", tone: "allow" },
] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [chapter, setChapter] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setChapter(Math.min(3, Math.floor(v * 3.65))));
  return (
    <section ref={ref} className="action-journey" aria-labelledby="hero-title">
      <div className="journey-intro">
        <p className="label hero-eyebrow"><span className="status-dot" /> The approval layer for AI agents</p>
        <h1 id="hero-title" className="display-tight hero-heading">Let your<br />agent act.<br /><span className="text-ink-3">Keep the</span><br /><span className="hero-last-word">last word.</span></h1>
        <p className="hero-description">Ship the agent. Set the boundaries. Get a say before a payment, a delete, or an email becomes permanent.</p>
        <div className="hero-actions"><a className="site-cta" href="#start">Start building <span aria-hidden>↗</span></a><a className="text-link" href={`${DOCS_URL}/quickstart`}>Read the docs <span aria-hidden>→</span></a></div>
        <p className="hero-footnote">Rules enforce. Smart scoring observes. You stay in control.</p>
        <a href="#how" className="scroll-cue"><span aria-hidden>↓</span> Follow an action</a>
      </div>
      <div className="journey-art"><div className="journey-stage">
        <div className="scene-corner scene-corner-top"><span>AB / ACTION CONTROL</span><span>ILLUSTRATIVE SEQUENCE</span></div>
        <ActionSculpture progress={scrollYProgress} />
        <div className={`scene-receipt scene-receipt-${chapter}`}>
          <div className="scene-receipt-header"><span className={`receipt-status ${chapter === 1 ? "text-hold" : chapter > 1 ? "text-allow" : "text-ink-2"}`}><span className="status-dot" />{["Action proposed", "Held by your rule", "Approved in Slack", "Recorded forever"][chapter]}</span><span className="text-ink-3">#000042</span></div>
          <div className="receipt-amount"><span>send_payment</span><strong>$600<span>.00</span></strong></div>
          <div className="receipt-meta"><span>agent / accounts-payable</span><span>{["awaiting policy", "amount > $500", "approved → resume", "SHA-256 · verified"][chapter]}</span></div>
          <div className="receipt-score"><span>Jev <span className="shadow-badge">SHADOW</span></span><span>0.78 risk <span className="text-ink-3">/ new payee</span></span></div>
        </div>
        <div className="scene-corner scene-corner-bottom"><span>{String(chapter + 1).padStart(2, "0")} / 04</span><span>{["PROPOSE", "CHECK", "APPROVE", "RECORD"][chapter]}</span><span className="scene-progress"><i style={{ transform: `scaleX(${(chapter + 1) / 4})` }} /></span></div>
      </div></div>
      <div id="how" className="journey-chapters">{CHAPTERS.map((item) => <article className="journey-chapter" key={item.number}>
        <p className="label"><span className="chapter-number">{item.number}</span>{item.eyebrow}</p><h2 className="display-tight">{item.title}</h2><p>{item.text}</p><div className="chapter-code"><span className={item.tone === "hold" ? "text-hold" : "text-allow"}>{item.label}</span><code>{item.code}</code></div>
      </article>)}</div>
    </section>
  );
}
