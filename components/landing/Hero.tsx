"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { CONSOLE_URL, DOCS_URL } from "@/lib/site";
import { ActionSculpture } from "./ActionSculpture";

const STEPS = ["The action", "Your rules", "A human", "The record"];
const WINDOWS = [[0, 0, .18, .25], [.23, .30, .43, .50], [.48, .55, .70, .77], [.75, .83, 1, 1]];

function StoryPanel({ index, progress, active, children }: { index: number; progress: MotionValue<number>; active: boolean; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const opacity = useTransform(progress, WINDOWS[index], index === 0 ? [1, 1, 1, 0] : index === 3 ? [0, 1, 1, 1] : [0, 1, 1, 0]);
  const y = useTransform(progress, WINDOWS[index], [index === 0 ? 0 : 35, 0, 0, -35]);
  return <motion.div className={`paper-panel paper-panel-${index}`} style={{ opacity, y: reduce ? 0 : y, pointerEvents: active ? "auto" : "none" }} aria-hidden={!active} inert={!active}>{children}</motion.div>;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [chapter, setChapter] = useState(0);
  const activeChapter = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v < .24 ? 0 : v < .49 ? 1 : v < .76 ? 2 : 3;
    if (next !== activeChapter.current) { activeChapter.current = next; setChapter(next); }
  });
  const jump = (i: number) => {
    const el = ref.current; if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (el.offsetHeight - window.innerHeight) * [0, .34, .62, .94][i], behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return <section ref={ref} id="how" className="paper-story" aria-labelledby="hero-title">
    <div className="paper-viewport">
      <div className="paper-folio" aria-hidden><span>ABEYANCE / AUTONOMY, ACCOUNTED FOR.</span><span>EST. 2026 · SYDNEY</span></div>
      <ActionSculpture progress={scrollYProgress} />
      <div className="paper-copy">
        <StoryPanel index={0} progress={scrollYProgress} active={chapter === 0}>
          <p className="hero-eyebrow"><span className="brand-asterisk" aria-hidden>✳</span> APPROVALS & AUDIT FOR AI AGENTS</p>
          <h1 id="hero-title" className="hero-heading">Autonomy.<br />With a <em>pause.</em></h1>
          <p className="hero-description">Let your agent do its thing. Get the last word before it moves money, deletes a file, or hits send.</p>
          <div className="hero-actions"><a className="site-cta" href={`${CONSOLE_URL}/login?mode=signup`}>Start building <span aria-hidden>↗</span></a><a className="text-link" href={`${DOCS_URL}/quickstart`}>Read the docs <span aria-hidden>→</span></a></div>
          <p className="hero-footnote">One guard. Your rules. A record of everything.</p>
        </StoryPanel>
        <StoryPanel index={1} progress={scrollYProgress} active={chapter === 1}>
          <p className="hero-eyebrow">01 / THE RIGHT KIND OF FRICTION</p>
          <h2 className="hero-heading">A line<br />you <em>draw.</em></h2>
          <p className="hero-description">A $600 payment meets your $500 rule. Abeyance holds it before anything runs. Reads go through. Production deletes stop.</p>
          <div className="story-rule"><span className="story-verdict">Ⅱ HOLD</span><code>amount &gt; 500</code><span>rule / payment_limit</span></div>
          <p className="hero-footnote">Jev adds a risk score alongside the decision.<br />Your rules make the call.</p>
        </StoryPanel>
        <StoryPanel index={2} progress={scrollYProgress} active={chapter === 2}>
          <p className="hero-eyebrow">02 / A PERSON IN THE LOOP</p>
          <h2 className="hero-heading">Your call.<br /><em>Then go.</em></h2>
          <p className="hero-description">The payment lands in Slack with the rule, redacted arguments and risk reasons. One tap to approve. Your agent picks up where it left off.</p>
          <div className="story-rule"><span className="story-verdict story-approved">↗ APPROVED</span><code>send_payment($600)</code><span>status / resumed</span></div>
          <p className="hero-footnote">Deny to abort. No response? Denied by default.</p>
        </StoryPanel>
        <StoryPanel index={3} progress={scrollYProgress} active={chapter === 3}>
          <p className="hero-eyebrow">03 / A PAPER TRAIL, WITHOUT THE PAPERWORK</p>
          <h2 className="hero-heading">Every action.<br /><em>On record.</em></h2>
          <p className="hero-description">The action, the policy, the score, the person who said yes. Linked in a tamper-evident audit log. Ready to search, export and verify.</p>
          <div className="story-rule"><span className="story-verdict story-approved">✓ VERIFIED</span><code>previous_hash → next_hash</code><span>signature / Ed25519</span></div>
          <a className="text-link mt-6" href="#start">Make your first guard <span aria-hidden>↓</span></a>
        </StoryPanel>
      </div>
      <div className="paper-bottom"><p className="paper-scroll"><span aria-hidden>↓</span> Scroll to follow the action</p><nav aria-label="Action story" className="story-navigation">{STEPS.map((step, i) => <button type="button" key={step} onClick={() => jump(i)} aria-current={chapter === i ? "step" : undefined}><span>{String(i + 1).padStart(2, "0")}</span>{step}<i /></button>)}</nav><span className="paper-caption">INTERACTIVE PRODUCT ILLUSTRATION</span></div>
    </div>
  </section>;
}
