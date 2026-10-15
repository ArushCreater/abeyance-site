"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
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
  // The stacked layout can fit inside a tall tablet screen. Finish its story
  // before the section leaves the viewport, without requiring a sticky panel.
  const { scrollYProgress: compactProgress } = useScroll({ target: ref, offset: ["start start", "end 80%"] });
  const input = useMotionValue(0);
  useEffect(() => {
    const compact = window.matchMedia("(max-width: 900px)");
    const sync = () => input.set(compact.matches ? compactProgress.get() : scrollYProgress.get());
    const offDesktop = scrollYProgress.on("change", sync);
    const offCompact = compactProgress.on("change", sync);
    compact.addEventListener("change", sync);
    sync();
    return () => { offDesktop(); offCompact(); compact.removeEventListener("change", sync); };
  }, [input, compactProgress, scrollYProgress]);
  const progress = useSpring(input, { stiffness: 150, damping: 30, mass: .3 });
  const reduce = useReducedMotion();
  const [chapter, setChapter] = useState(0);
  const active = useRef(0);
  useMotionValueEvent(progress, "change", value => {
    const next = storyChapter(value, active.current);
    if (next !== active.current) { active.current = next; setChapter(next); }
  });
  const displayChapter = reduce ? 1 : chapter;
  const status = STATES[displayChapter];
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
            <span className={`decision-badge hero-badge state-${displayChapter}`}>{status.state}</span>
            <p>{status.title}</p><span>{status.detail}</span>
            <div className="story-track" aria-hidden>{STATES.map((_, i) => <i key={i} data-active={i <= displayChapter} />)}</div>
          </div>
        </div>
      </div>
      <a href="#how" className="hero-continue">Follow an action through Abeyance <span aria-hidden>↓</span></a>
    </div>
  </section>;
}
