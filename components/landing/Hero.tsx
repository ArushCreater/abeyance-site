"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { CONSOLE_URL, DOCS_URL } from "@/lib/site";
import { storyChapter } from "@/lib/hero-motion.mjs";
import { Aperture } from "./Aperture";

const STATES = [
  { title: "$600 payment proposed", detail: "Your agent asks to send a payment.", state: "Proposed" },
  { title: "Held by your $500 rule", detail: "The payment waits for a person to approve.", state: "Paused" },
  { title: "Approved. Agent resumes.", detail: "Approval releases this action to run.", state: "Resumed" },
  { title: "The full decision, on record.", detail: "Action, rule and approval in one audit trail.", state: "Recorded" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 30, mass: .3 });
  const reduce = useReducedMotion();
  const [chapter, setChapter] = useState(0);
  const active = useRef(0);
  useMotionValueEvent(progress, "change", value => {
    const next = storyChapter(value, active.current);
    if (next !== active.current) { active.current = next; setChapter(next); }
  });
  const status = STATES[reduce ? 0 : chapter];
  return <section ref={ref} className="aperture-story" aria-labelledby="hero-title">
    <div className="hero-viewport">
      <div className="hero-layout">
        <div className="hero-copy">
          <h1 id="hero-title">Control what<br />your AI agents<br /><em>can do.</em></h1>
          <p className="hero-description">Abeyance checks tool calls against your rules before they run. Allow routine actions, pause sensitive ones for approval, and block the rest.</p>
          <div className="hero-actions"><a className="site-cta" href={`${CONSOLE_URL}/login?mode=signup`}>Start free <span aria-hidden>↗</span></a><a className="text-link" href={`${DOCS_URL}/quickstart`}>Read the quickstart <span aria-hidden>→</span></a></div>
          <p className="hero-support">TypeScript, Python & MCP. Built for your existing agent.</p>
        </div>
        <div className="hero-visual">
          <Aperture progress={progress} />
          <div className="hero-status" aria-label="Illustrated payment approval flow">
            <span className={`decision-badge hero-badge state-${chapter}`}>{status.state}</span>
            <p>{status.title}</p><span>{status.detail}</span>
            <div className="story-track" aria-hidden>{STATES.map((_, i) => <i key={i} data-active={i <= chapter} />)}</div>
          </div>
        </div>
      </div>
      <a href="#how" className="hero-continue">Follow an action through Abeyance <span aria-hidden>↓</span></a>
    </div>
  </section>;
}
