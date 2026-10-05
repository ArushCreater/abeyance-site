"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * The hero object: a Newton's cradle that holds the last ball.
 *
 * An action's momentum runs down the line of balls. Most of the time the
 * end ball swings out and back, as it should. Now and then it stops at the
 * top of its swing and stays there, lit amber: held. A note hangs from it
 * saying what the action is and why. Approve, and it drops and the
 * momentum carries on through; deny, and it's lowered back to rest and the
 * energy dies in the line. If nobody decides, the named approver does.
 *
 * Real pendulum physics (equal masses, elastic contacts, slight loss),
 * drawn as a quiet physical object: twin strings to front and back rails,
 * matte spheres, soft shadows on the base. Pull any ball to set it going.
 * Canvas 2D, DPR-aware, paused off-screen. Reduced motion: a still of the
 * held moment, and the buttons still work.
 */

type Held = { kind: string; what: string; why: string; risk: string; who: string; approver: string };

const ACTIONS: Held[] = [
  { kind: "email.send", what: "“We’ll refund the full $4,800 and waive your excess.”", why: "A promise of money to a customer", risk: "0.89", who: "claims-assistant", approver: "Maya, Claims lead" },
  { kind: "crm.delete", what: "Delete 2,400 customer records", why: "Above the bulk limit of 50", risk: "0.93", who: "data-hygiene-bot", approver: "Compliance" },
  { kind: "payment.release", what: "€18,000 to a payee added this morning", why: "A new payee and a large amount", risk: "0.91", who: "ap-agent", approver: "two people in Finance" },
  { kind: "github.pr.merge", what: "Merge #2214 into main", why: "Deploys to production in four minutes", risk: "0.72", who: "release-agent", approver: "the on-call lead" },
  { kind: "ticket.close", what: "Close an open complaint as resolved", why: "The customer hasn’t replied yet", risk: "0.68", who: "support-agent", approver: "Sam, Support" },
];

const N = 5;
const G_OVER_L = 26; // swing period ≈ 1.2 s
const LOSS = 0.988; // per collision
const AIR = 0.035; // per second
const SUBSTEPS = 12;

const INK = [236, 232, 225] as const;
const AMBER = [235, 164, 63] as const;
const rgba = (c: readonly number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;

type Sim = {
  th: number[];
  om: number[];
  held: boolean;
  denying: number; // seconds left of the deny: lower the ball, absorb the energy
  apexes: number; // right-end apexes since the last hold
  holdOn: number; // hold at this apex
  idle: number; // seconds since anything moved
  userAt: number; // last time a person touched it (performance.now ms)
  lift: { t: number; from: number; to: number; k: number } | null; // an unseen hand lifting the first ball
};

export function Cradle({ className = "" }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion() ?? false;
  const sim = useRef<Sim>({ th: Array(N).fill(0), om: Array(N).fill(0), held: false, denying: 0, apexes: 0, holdOn: 2, idle: 0, userAt: 0, lift: null });
  const [note, setNote] = useState<{ action: Held; x: number; y: number; base: number; w: number } | null>(null);
  const [verdict, setVerdict] = useState<{ approved: boolean; by: string } | null>(null);
  const actionIx = useRef(0);
  const noteHover = useRef(false);
  const decideRef = useRef<(approved: boolean, by: string) => void>(() => {});

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const s = sim.current;

    let W = 0, H = 0, dpr = 1;
    const gap = 0.6;
    let R = 20, L = 160, pivotY = 0, x0 = 0, baseY = 0;
    const DX = 16, DY = -12; // the back frame, for depth
    const PAD = 56; // the canvas bleeds past its box, so glows and swings aren't clipped
    let raf = 0;
    let last = performance.now();
    let visible = true;
    let heldAt = 0;
    let decisionTimer = 0;
    const drag = { current: null as null | { i: number; side: -1 | 1 } };

    const layout = () => {
      const r = el.getBoundingClientRect();
      W = r.width;
      H = r.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round((W + 2 * PAD) * dpr);
      cv.height = Math.round((H + 2 * PAD) * dpr);
      cv.style.width = `${W + 2 * PAD}px`;
      cv.style.height = `${H + 2 * PAD}px`;
      cv.style.left = cv.style.top = `${-PAD}px`;
      R = Math.max(12, W * 0.05);
      L = H * 0.42;
      pivotY = H * 0.17;
      baseY = pivotY + L + R + H * 0.07;
      x0 = W / 2 - ((N - 1) * (2 * R + gap)) / 2 - DX / 2;
      if (reduce) still();
    };
    const pivotX = (i: number) => x0 + i * (2 * R + gap) + DX / 2;
    const pos = (i: number) => ({ x: pivotX(i) + L * Math.sin(s.th[i]), y: pivotY + L * Math.cos(s.th[i]) });

    const showNote = () => {
      const p = pos(N - 1);
      const action = ACTIONS[actionIx.current % ACTIONS.length];
      setVerdict(null);
      setNote({ action, x: p.x, y: p.y + R, base: baseY, w: W });
    };

    // Approve: let it fall and carry on. Deny: lower it, and let the line come to rest.
    decideRef.current = (approved: boolean, by: string) => {
      if (!s.held) return;
      s.held = false;
      s.userAt = by === "you" ? performance.now() : s.userAt;
      if (!approved) s.denying = 2.2;
      s.apexes = 0;
      s.holdOn = 2 + Math.floor(Math.random() * 2);
      actionIx.current++;
      setVerdict({ approved, by });
      window.clearTimeout(decisionTimer);
      decisionTimer = window.setTimeout(() => setNote(null), 2600);
      if (reduce) {
        s.th[N - 1] = 0;
        draw();
      }
    };

    const step = (dt: number) => {
      const h = dt / SUBSTEPS;
      for (let k = 0; k < SUBSTEPS; k++) {
        const prevEnd = s.om[N - 1];
        for (let i = 0; i < N; i++) {
          if (i === N - 1 && s.held) continue;
          if (s.lift && i === 0) continue;
          s.om[i] += -G_OVER_L * Math.sin(s.th[i]) * h;
          s.om[i] *= 1 - AIR * h * (s.denying > 0 ? 40 : 1);
          s.th[i] += s.om[i] * h;
        }
        // Contacts, swept a few times so a knock travels the whole line in one step.
        for (let pass = 0; pass < N; pass++) {
          for (let i = 0; i < N - 1; i++) {
            const a = pos(i), b = pos(i + 1);
            const d = Math.hypot(b.x - a.x, b.y - a.y);
            const va = L * s.om[i] * Math.cos(s.th[i]);
            const vb = L * s.om[i + 1] * Math.cos(s.th[i + 1]);
            if (d <= 2 * R && va > vb) {
              if (s.held && i + 1 === N - 1) {
                // The held ball doesn't move: the knock comes straight back.
                s.om[i] = -s.om[i] * LOSS;
              } else if (s.denying > 0) {
                s.om[i] = s.om[i + 1] = 0;
              } else {
                const t = s.om[i];
                s.om[i] = s.om[i + 1] * LOSS;
                s.om[i + 1] = t * LOSS;
              }
            }
          }
        }
        // The end ball reaching the top of its swing: sometimes, that's where it's held.
        if (!s.held && s.denying <= 0 && prevEnd > 0 && s.om[N - 1] <= 0 && s.th[N - 1] > 0.22) {
          s.apexes++;
          if (s.apexes >= s.holdOn) {
            s.held = true;
            s.om[N - 1] = 0;
            heldAt = performance.now();
            showNote();
          }
        }
      }
      if (s.denying > 0) {
        s.denying -= dt;
        // Lower the denied ball gently back to rest.
        s.th[N - 1] *= Math.exp(-dt * 2.4);
        s.om[N - 1] = 0;
      }

      // Nobody touching it: an unseen hand lifts the first ball and lets go.
      const energy = s.om.reduce((e, w) => e + w * w, 0) + s.th.reduce((e, t) => e + t * t * G_OVER_L, 0);
      s.idle = energy < 0.02 && !s.held ? s.idle + dt : 0;
      if (s.lift) {
        s.lift.t += dt;
        const k = Math.min(1, s.lift.t / 0.9);
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        s.th[0] = s.lift.from + (s.lift.to - s.lift.from) * e;
        s.om[0] = 0;
        if (k >= 1) s.lift = null;
      } else if (s.idle > 1.1 && performance.now() - s.userAt > 5000) {
        s.lift = { t: 0, from: s.th[0], to: -(0.55 + Math.random() * 0.15), k: 0 };
        s.idle = 0;
      }
      // Holds wait for a person; if none comes, the named approver decides.
      if (s.held && !noteHover.current && performance.now() - heldAt > 5200) {
        const a = ACTIONS[actionIx.current % ACTIONS.length];
        decideRef.current(actionIx.current % 3 !== 1, a.approver.replace(/^two people in /, "").split(",")[0]);
      }
    };

    const sphere = (x: number, y: number, held: boolean, glow: number) => {
      if (held) {
        const halo = ctx.createRadialGradient(x, y, R * 0.6, x, y, R * (3.2 + glow));
        halo.addColorStop(0, rgba(AMBER, 0.28));
        halo.addColorStop(1, rgba(AMBER, 0));
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, R * 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      const g = ctx.createRadialGradient(x - R * 0.38, y - R * 0.42, R * 0.08, x, y, R);
      if (held) {
        g.addColorStop(0, "#fff1d6");
        g.addColorStop(0.35, "#f0b257");
        g.addColorStop(1, "#7a4a12");
      } else {
        g.addColorStop(0, "#c9c4bb");
        g.addColorStop(0.3, "#57534d");
        g.addColorStop(0.85, "#1b1a19");
        g.addColorStop(1, "#111");
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.fill();
      // A thin rim of light from the room.
      ctx.strokeStyle = rgba(INK, held ? 0.25 : 0.12);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, R - 0.5, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);
      ctx.clearRect(-PAD, -PAD, W + 2 * PAD, H + 2 * PAD);
      const left = x0 - R * 1.7, right = x0 + (N - 1) * (2 * R + gap) + R * 1.7 + DX;
      const line = (x1: number, y1: number, x2: number, y2: number, a: number, w = 1) => {
        ctx.strokeStyle = rgba(INK, a);
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      };

      // Base: a thin slab in perspective.
      ctx.fillStyle = rgba(INK, 0.025);
      ctx.beginPath();
      ctx.moveTo(left - 10, baseY);
      ctx.lineTo(right + 10, baseY);
      ctx.lineTo(right + 10 + DX * 1.6, baseY + DY * 1.6);
      ctx.lineTo(left - 10 + DX * 1.6, baseY + DY * 1.6);
      ctx.closePath();
      ctx.fill();
      line(left - 10, baseY, right + 10, baseY, 0.22);
      line(left - 10, baseY + 5, right + 10, baseY + 5, 0.08);

      // Shadows, softer the higher the ball.
      for (let i = 0; i < N; i++) {
        const p = pos(i);
        const lift = (baseY - p.y - R) / (H * 0.3);
        const held = i === N - 1 && s.held;
        const sh = ctx.createRadialGradient(p.x + DX * 0.6, baseY + DY * 0.6, 0, p.x + DX * 0.6, baseY + DY * 0.6, R * (1.3 + lift));
        sh.addColorStop(0, held ? rgba(AMBER, 0.12) : `rgba(0,0,0,${(0.55 / (1 + lift)).toFixed(3)})`);
        sh.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = sh;
        ctx.beginPath();
        ctx.ellipse(p.x + DX * 0.6, baseY + DY * 0.6, R * (1.3 + lift), R * 0.35 * (1 + lift * 0.3), 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Frame: two bent-rod arches, the back one fainter, with a little sheen along the rod.
      const top = pivotY - 6;
      const arch = (ox: number, oy: number, alpha: number, width: number) => {
        const rr = R * 1.1;
        const sheen = ctx.createLinearGradient(left + ox, 0, right + ox, 0);
        sheen.addColorStop(0, rgba(INK, alpha * 0.55));
        sheen.addColorStop(0.3, rgba(INK, alpha));
        sheen.addColorStop(0.55, rgba(INK, alpha * 0.6));
        sheen.addColorStop(1, rgba(INK, alpha * 0.45));
        ctx.strokeStyle = sheen;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(left + ox, baseY + oy * 1.6);
        ctx.lineTo(left + ox, top + oy + rr);
        ctx.arcTo(left + ox, top + oy, left + ox + rr, top + oy, rr);
        ctx.lineTo(right + ox - rr, top + oy);
        ctx.arcTo(right + ox, top + oy, right + ox, top + oy + rr, rr);
        ctx.lineTo(right + ox, baseY + oy * 1.6);
        ctx.stroke();
      };
      arch(DX, DY, 0.16, 1.4);

      // Strings to both rails, then the balls (back to front doesn't matter in a line).
      const glow = 0.5 + 0.5 * Math.sin(performance.now() / 420);
      for (let i = 0; i < N; i++) {
        const p = pos(i);
        const px = pivotX(i);
        const held = i === N - 1 && s.held;
        const a = held ? 0.45 : 0.24;
        ctx.strokeStyle = held ? rgba(AMBER, 0.55) : rgba(INK, a);
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(px - DX / 2, top);
        ctx.lineTo(p.x, p.y - R * 0.9);
        ctx.moveTo(px + DX / 2, top + DY);
        ctx.lineTo(p.x, p.y - R * 0.9);
        ctx.stroke();
      }
      for (let i = 0; i < N; i++) {
        const p = pos(i);
        sphere(p.x, p.y, i === N - 1 && s.held, glow);
      }
      arch(0, 0, 0.42, 1.8);
    };

    // Reduced motion: the held moment, still.
    const still = () => {
      s.th = [0, 0, 0, 0, 0.62];
      s.held = true;
      showNote();
      draw();
    };

    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (!drag.current) step(dt);
      draw();
      if (visible) raf = requestAnimationFrame(loop);
    };

    // Pull a ball (and those outside it) by hand.
    const local = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      return { x: e.clientX - r.left - PAD, y: e.clientY - r.top - PAD };
    };
    const onDown = (e: PointerEvent) => {
      const p = local(e);
      for (let i = 0; i < N; i++) {
        const b = pos(i);
        if (Math.hypot(p.x - b.x, p.y - b.y) <= R * 1.4) {
          drag.current = { i, side: i < N / 2 ? -1 : 1 };
          s.userAt = performance.now();
          if (s.held) decideRef.current(true, "you");
          s.lift = null;
          cv.setPointerCapture(e.pointerId);
          e.preventDefault();
          return;
        }
      }
    };
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      const p = local(e);
      cv.style.cursor = d ? "grabbing" : [...Array(N).keys()].some((i) => Math.hypot(p.x - pos(i).x, p.y - pos(i).y) <= R * 1.4) ? "grab" : "default";
      if (!d) return;
      const raw = Math.atan2(p.x - pivotX(d.i), Math.max(10, p.y - pivotY));
      const th = d.side < 0 ? Math.max(-1.1, Math.min(0, raw)) : Math.max(0, Math.min(1.1, raw));
      for (let i = 0; i < N; i++) {
        const outside = d.side < 0 ? i <= d.i : i >= d.i;
        s.th[i] = outside ? th : 0;
        s.om[i] = 0;
      }
      s.userAt = performance.now();
      if (reduce) draw();
    };
    const onUp = () => {
      drag.current = null;
      s.apexes = 0;
    };

    const ro = new ResizeObserver(layout);
    ro.observe(el);
    layout();
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting && !document.hidden;
      cancelAnimationFrame(raf);
      if (visible && !reduce) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(el);
    cv.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    if (reduce) still();
    else s.lift = { t: 0, from: 0, to: -0.62, k: 0 };
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.clearTimeout(decisionTimer);
      cv.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [reduce]);

  const noteW = 280;
  const noteLeft = note ? Math.max(0, Math.min(note.w - noteW, note.x - noteW + 36)) : 0;
  const noteTop = note ? note.base + 26 : 0;

  return (
    <div ref={wrap} className={`relative select-none ${className}`}>
      <canvas ref={canvas} aria-hidden className="absolute touch-none" />
      <AnimatePresence>
        {note && (
          <motion.div
            key={note.action.kind}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="pointer-events-none absolute inset-0"
          >
            {/* The thread from the held ball to its note. */}
            <svg aria-hidden className="absolute inset-0 h-full w-full overflow-visible">
              <motion.path
                d={`M ${note.x} ${note.y + 2} L ${note.x} ${noteTop - 8} L ${Math.min(note.x, noteLeft + noteW - 12)} ${noteTop - 8}`}
                fill="none"
                stroke={verdict && !verdict.approved ? "rgb(201 118 107 / 0.6)" : "rgb(235 164 63 / 0.6)"}
                strokeWidth={1}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: verdict ? 0 : 1 }}
                transition={{ duration: verdict ? 0.4 : 0.6, ease: [0.3, 0.7, 0.2, 1] }}
              />
            </svg>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.45 }}
              className="pointer-events-auto absolute text-right"
              style={{ left: noteLeft, top: noteTop, width: noteW }}
              onPointerEnter={() => (noteHover.current = true)}
              onPointerLeave={() => (noteHover.current = false)}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-hold">
                Held · <span className="normal-case tracking-normal text-ink-3">{note.action.kind}</span>
              </p>
              <p className="mt-1.5 text-[13px] leading-snug text-ink">{note.action.what}</p>
              <p className="mt-1 text-[12px] leading-snug text-ink-3">{note.action.why}</p>
              <p className="mt-0.5 font-mono text-[11px] text-ink-4">
                risk <span className="text-hold">{note.action.risk}</span> · {note.action.who}
              </p>
              <div className="mt-2.5 h-5 font-mono text-[11px]">
                {verdict ? (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={verdict.approved ? "text-allow" : "text-block"}>
                    {verdict.approved ? "✓ approved" : "✕ denied"} by {verdict.by}
                  </motion.p>
                ) : (
                  <span className="inline-flex gap-4">
                    <button type="button" onClick={() => decideRef.current(false, "you")} className="text-ink-3 underline decoration-line-strong underline-offset-4 transition-colors hover:text-block hover:decoration-block">
                      Deny
                    </button>
                    <button type="button" onClick={() => decideRef.current(true, "you")} className="text-hold underline decoration-hold/50 underline-offset-4 transition-colors hover:decoration-hold">
                      Approve
                    </button>
                  </span>
                )}
              </div>
              {!verdict && <p className="mt-1 text-[11px] text-ink-4">waiting for {note.action.approver}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <p aria-hidden className="pointer-events-none absolute left-0 top-0 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-4">Pull a ball</p>
    </div>
  );
}
