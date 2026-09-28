"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { evaluate } from "@/lib/engine/evaluate";
import { createRng, type Rng } from "@/lib/engine/random";
import { engine, generateAction, POLICIES, policyFor } from "@/lib/mock-data";
import type { Action, Decision, DecisionOutcome } from "@/lib/types";

/**
 * Landing-page stream. Runs the real (mock-backed) engine, but sped up and
 * with risky actions over-represented so visitors see holds within seconds.
 */

export interface DemoRow {
  id: string;
  action: Action;
  decision: Decision | null;
  resolution?: { status: "approved" | "denied"; by: string };
}

export interface DemoHold {
  id: string;
  action: Action;
  decision: Decision;
  /** ms of (dilated) time elapsed / total before auto-resolution. */
  elapsed: number;
  duration: number;
  status: "pending" | "approved" | "denied";
  by?: string;
}

const MAX_ROWS = 7;
const MAX_HOLDS = 3;
const TICK = 100;

export function useDemoStream({ running, dilation }: { running: boolean; dilation: number }) {
  const [rows, setRows] = useState<DemoRow[]>([]);
  const [holds, setHolds] = useState<DemoHold[]>([]);
  const [counts, setCounts] = useState<Record<DecisionOutcome, number>>({ ALLOW: 0, HOLD: 0, BLOCK: 0 });

  const rng = useRef<Rng | null>(null);
  const sinceRisky = useRef(0);
  const dilationRef = useRef(dilation);
  const holdsRef = useRef(holds);
  useEffect(() => {
    dilationRef.current = dilation;
    holdsRef.current = holds;
  }, [dilation, holds]);

  const resolve = useCallback((id: string, status: "approved" | "denied", by: string) => {
    setHolds((hs) => hs.map((h) => (h.id === id && h.status === "pending" ? { ...h, status, by } : h)));
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, resolution: { status, by } } : r)));
  }, []);

  const remove = useCallback((id: string) => setHolds((hs) => hs.filter((h) => h.id !== id)), []);

  // Producer: propose → (visual) scoring → decision.
  useEffect(() => {
    if (!running) return;
    rng.current ??= createRng(Math.floor(Math.random() * 1e9));
    const r = rng.current;
    let cancelled = false;
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const t = window.setTimeout(() => {
        timers.delete(t);
        fn();
      }, ms);
      timers.add(t);
    };

    const next = async () => {
      let action!: Action;
      let decision!: Decision;
      for (let i = 0; i < 40; i++) {
        action = generateAction(r, new Date());
        decision = await evaluate(action, policyFor(POLICIES, action.tool), engine);
        if (decision.outcome === "BLOCK" && r() < 0.5) continue; // keep blocks rare
        if (decision.outcome === "ALLOW" && sinceRisky.current >= 4 + Math.floor(r() * 4)) continue;
        break;
      }
      if (cancelled) return;
      sinceRisky.current = decision.outcome === "ALLOW" ? sinceRisky.current + 1 : 0;

      const row: DemoRow = { id: action.id, action, decision: null };
      setRows((rs) => [row, ...rs].slice(0, MAX_ROWS));

      const visualLatency = (350 + decision.latencyMs * 1.6) * dilationRef.current;
      later(() => {
        setRows((rs) => rs.map((x) => (x.id === action.id ? { ...x, decision } : x)));
        setCounts((c) => ({ ...c, [decision.outcome]: c[decision.outcome] + 1 }));
        if (decision.outcome === "HOLD") {
          // Make room: the oldest pending hold is approved by its owner.
          const pending = holdsRef.current.filter((h) => h.status === "pending");
          if (pending.length >= MAX_HOLDS) {
            const oldest = pending[pending.length - 1];
            resolve(oldest.id, "approved", oldest.decision.approver?.name ?? "approver");
          }
          const duration = 9000 + r() * 3000;
          setHolds((hs) => [{ id: action.id, action, decision, elapsed: 0, duration, status: "pending" }, ...hs]);
        }
      }, visualLatency);

      later(next, (1100 + r() * 1000) * dilationRef.current);
    };

    later(next, 400);
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [running, resolve]);

  // Clock for held items: runs in dilated time.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const step = TICK / dilationRef.current;
      // Owner responds from Slack/Teams when the demo timer runs out.
      for (const h of holdsRef.current) {
        if (h.status === "pending" && h.elapsed + step >= h.duration) {
          const risky = (h.decision.risk?.value ?? 0) > 0.7;
          const approved = Math.random() < (risky ? 0.45 : 0.85);
          resolve(h.id, approved ? "approved" : "denied", h.decision.approver?.name ?? "approver");
        }
      }
      setHolds((hs) =>
        hs.some((h) => h.status === "pending")
          ? hs.map((h) => (h.status === "pending" ? { ...h, elapsed: Math.min(h.duration, h.elapsed + step) } : h))
          : hs,
      );
    }, TICK);
    return () => window.clearInterval(id);
  }, [running, resolve]);

  return { rows, holds, counts, resolve, remove };
}
