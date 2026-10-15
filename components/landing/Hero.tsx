"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { CONSOLE_URL, DOCS_URL } from "@/lib/site";
import { storyChapter } from "@/lib/hero-motion.mjs";
import { AgentMascot } from "./AgentMascot";

const CHAPTERS = [
  { line: "Autonomy.", accent: "With a pause.", body: "Let your agent work. You decide before it moves money, deletes a file, or hits send." },
  { line: "Your rules.", accent: "Your call.", body: "A $600 payment meets your $500 rule. It waits for approval before anything runs." },
  { line: "Approved.", accent: "Back to it.", body: "Approve in Slack. Your agent resumes where it left off. Deny, and the action stops." },
  { line: "Every action.", accent: "On record.", body: "The action, the rule and the person who approved it. Together in one verifiable audit trail." },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 32, mass: .35 });
  const reduce = useReducedMotion();
  const [chapter, setChapter] = useState(0);
  const active = useRef(0);
  useMotionValueEvent(reduce ? scrollYProgress : progress, "change", (value) => {
    const next = storyChapter(value, active.current);
    if (next !== active.current) { active.current = next; setChapter(next); }
  });
  const copy = CHAPTERS[chapter];
  return <section ref={ref} id="how" className="agent-story" aria-labelledby="hero-title">
    <div className="agent-viewport">
      <AgentMascot progress={progress} />
      <div className="agent-copy">
        <div className="agent-panel">
          <div className="hero-message">
            <AnimatePresence initial={false} mode="wait">
              <motion.div key={chapter} className="hero-message-frame" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : .16 }}>
                <h1 id="hero-title" className="hero-heading">{copy.line}<br /><em>{copy.accent}</em></h1>
                <p className="hero-description">{copy.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="hero-actions">
            <a className="site-cta" href={`${CONSOLE_URL}/login?mode=signup`}>Start building <span aria-hidden>↗</span></a>
            <a className="text-link" href={`${DOCS_URL}/quickstart`}>Read the docs <span aria-hidden>→</span></a>
          </div>
        </div>
      </div>
      <a href="#start" className="hero-scroll" aria-label="Continue to the SDK quickstart"><span aria-hidden>↓</span></a>
    </div>
  </section>;
}
