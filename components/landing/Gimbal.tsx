"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * The hero object: a gimbal holding an amber point perfectly still.
 *
 * Three nested rings turn on their pivots at unrelated speeds, so the
 * figure never quite repeats, while the core at the centre stays level:
 * the product's idea as a physical thing. A fixed dial ring and a faint
 * stippled sphere give it scale and depth.
 *
 * Drag to spin it; it coasts, then settles back into a slow idle turn.
 * Canvas 2D with a small hand-rolled 3D projection (no WebGL, no library).
 * Pauses off-screen and in background tabs. Reduced motion: no idle
 * spin or ring motion, but it can still be turned by hand.
 */

type V = [number, number, number];
type M = [number, number, number, number, number, number, number, number, number];

const INK: V = [236, 232, 225];
const AMBER: V = [235, 164, 63];

const mul = (a: M, b: M): M => [
  a[0] * b[0] + a[1] * b[3] + a[2] * b[6], a[0] * b[1] + a[1] * b[4] + a[2] * b[7], a[0] * b[2] + a[1] * b[5] + a[2] * b[8],
  a[3] * b[0] + a[4] * b[3] + a[5] * b[6], a[3] * b[1] + a[4] * b[4] + a[5] * b[7], a[3] * b[2] + a[4] * b[5] + a[5] * b[8],
  a[6] * b[0] + a[7] * b[3] + a[8] * b[6], a[6] * b[1] + a[7] * b[4] + a[8] * b[7], a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
];
const apply = (m: M, v: V): V => [
  m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
  m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
  m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
];
const rx = (a: number): M => {
  const c = Math.cos(a), s = Math.sin(a);
  return [1, 0, 0, 0, c, -s, 0, s, c];
};
const ry = (a: number): M => {
  const c = Math.cos(a), s = Math.sin(a);
  return [c, 0, s, 0, 1, 0, -s, 0, c];
};
/** Keep an accumulated rotation orthonormal (drift from many small multiplies). */
function orthonormalize(m: M): M {
  let [ax, ay, az] = [m[0], m[3], m[6]];
  let l = Math.hypot(ax, ay, az);
  ax /= l; ay /= l; az /= l;
  let [bx, by, bz] = [m[1], m[4], m[7]];
  const d = ax * bx + ay * by + az * bz;
  bx -= d * ax; by -= d * ay; bz -= d * az;
  l = Math.hypot(bx, by, bz);
  bx /= l; by /= l; bz /= l;
  const cx = ay * bz - az * by, cy = az * bx - ax * bz, cz = ax * by - ay * bx;
  return [ax, bx, cx, ay, by, cy, az, bz, cz];
}

const rgba = (c: V, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;
const mix = (a: V, b: V, k: number): V => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k].map(Math.round) as V;

/** A circle of radius r in the local XY plane. */
const circle = (r: number, n: number): V[] => Array.from({ length: n }, (_, i) => [r * Math.cos((i / n) * Math.PI * 2), r * Math.sin((i / n) * Math.PI * 2), 0]);

/** Evenly spread points on a sphere (Fibonacci lattice). */
const shell = (r: number, n: number): V[] =>
  Array.from({ length: n }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / n;
    const rr = Math.sqrt(1 - y * y);
    const th = i * Math.PI * (3 - Math.sqrt(5));
    return [r * rr * Math.cos(th), r * y, r * rr * Math.sin(th)];
  });

const RINGS = [
  { r: 1.0, n: 168, tone: INK, alpha: 0.9 },
  { r: 0.8, n: 144, tone: INK, alpha: 0.8 },
  { r: 0.6, n: 120, tone: mix(INK, AMBER, 0.55), alpha: 0.85 },
];
const DIAL = circle(1.18, 200).map(([x, y]) => [x, 0, y] as V); // horizontal, fixed
const TICKS = Array.from({ length: 72 }, (_, i) => {
  const a = (i / 72) * Math.PI * 2;
  const long = i % 6 === 0;
  return [[1.18 * Math.cos(a), 0, 1.18 * Math.sin(a)], [(long ? 1.3 : 1.24) * Math.cos(a), 0, (long ? 1.3 : 1.24) * Math.sin(a)]] as [V, V];
});
const SHELL = shell(1.42, 560);
const RING_PTS = RINGS.map((r) => circle(r.r, r.n));

type Item = { z: number; draw: (ctx: CanvasRenderingContext2D) => void };

export function Gimbal({ className = "" }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion() ?? false;
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, dpr = 1;
    let view: M = mul(rx(-0.42), ry(0.55)); // the whole object, turned by hand
    let vel = { x: 0, y: 0 }; // rad/s around screen X and Y
    let dragging = false;
    let last = { x: 0, y: 0, t: 0 };
    let clock = 0;
    let raf = 0;
    let visible = true;
    let prev = performance.now();

    const layout = () => {
      const r = el.getBoundingClientRect();
      W = r.width;
      H = r.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = `${W}px`;
      cv.style.height = `${H}px`;
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const scale = Math.min(W, H) * 0.31; // the sphere (r 1.42) projects to ~1.5 r at the near side
      const cam = 4.2;
      const project = (p: V): [number, number, number, number] => {
        const k = cam / (cam - p[2]);
        return [cx + p[0] * scale * k, cy - p[1] * scale * k, p[2], k];
      };
      const depth = (z: number) => (z + 1.45) / 2.9; // 0 far … 1 near

      // Gimbal kinematics: each ring turns inside the one around it.
      const t = reduce ? 0 : clock;
      const outer = mul(view, ry(t * 0.19));
      const middle = mul(outer, rx(0.9 + t * 0.31));
      const inner = mul(middle, ry(0.5 + t * 0.47));
      const frames = [outer, middle, inner];

      const items: Item[] = [];

      // Faint stippled sphere.
      for (const p of SHELL) {
        const q = apply(view, p);
        const [x, y, z, k] = project(q);
        const d = depth(z);
        items.push({
          z,
          draw: (c) => {
            c.fillStyle = rgba(INK, 0.04 + 0.2 * d * d);
            const s = 0.6 + 0.9 * d * k;
            c.fillRect(x - s / 2, y - s / 2, s, s);
          },
        });
      }

      // The fixed dial and its ticks.
      const dial = DIAL.map((p) => project(apply(view, p)));
      for (let i = 0; i < dial.length; i++) {
        const a = dial[i], b = dial[(i + 1) % dial.length];
        const z = (a[2] + b[2]) / 2;
        items.push({
          z,
          draw: (c) => {
            c.strokeStyle = rgba(INK, 0.06 + 0.28 * depth(z));
            c.lineWidth = 0.8;
            c.beginPath();
            c.moveTo(a[0], a[1]);
            c.lineTo(b[0], b[1]);
            c.stroke();
          },
        });
      }
      TICKS.forEach(([p0, p1], i) => {
        const a = project(apply(view, p0)), b = project(apply(view, p1));
        const z = (a[2] + b[2]) / 2;
        items.push({
          z,
          draw: (c) => {
            c.strokeStyle = rgba(i % 6 === 0 ? mix(INK, AMBER, 0.35) : INK, (i % 6 === 0 ? 0.2 : 0.08) + 0.4 * depth(z));
            c.lineWidth = i % 6 === 0 ? 1.1 : 0.8;
            c.beginPath();
            c.moveTo(a[0], a[1]);
            c.lineTo(b[0], b[1]);
            c.stroke();
          },
        });
      });

      // The three rings, each with its pivot pins.
      RINGS.forEach((ring, ri) => {
        const pts = RING_PTS[ri].map((p) => project(apply(frames[ri], p)));
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i], b = pts[(i + 1) % pts.length];
          const z = (a[2] + b[2]) / 2;
          const d = depth(z);
          items.push({
            z,
            draw: (c) => {
              c.strokeStyle = rgba(ring.tone, ring.alpha * (0.12 + 0.88 * d * d));
              c.lineWidth = 0.7 + 1.5 * d * a[3];
              c.beginPath();
              c.moveTo(a[0], a[1]);
              c.lineTo(b[0], b[1]);
              c.stroke();
            },
          });
        }
        // Pins where this ring is held by the next one in (±X for outer→middle, ±Y for middle→inner).
        if (ri < 2) {
          const inward = RINGS[ri + 1].r;
          const axis: V[] = ri === 0 ? [[ring.r, 0, 0], [-ring.r, 0, 0]] : [[0, ring.r, 0], [0, -ring.r, 0]];
          const axisIn: V[] = ri === 0 ? [[inward, 0, 0], [-inward, 0, 0]] : [[0, inward, 0], [0, -inward, 0]];
          axis.forEach((p, j) => {
            // Pins turn with the inner ring's frame so they stay on its pivot line.
            const f = frames[ri + 1];
            const a = project(apply(f, p)), b = project(apply(f, axisIn[j]));
            const z = (a[2] + b[2]) / 2;
            items.push({
              z: z + 0.001,
              draw: (c) => {
                const d = depth(z);
                c.strokeStyle = rgba(INK, 0.2 + 0.6 * d);
                c.lineWidth = 1.2;
                c.beginPath();
                c.moveTo(a[0], a[1]);
                c.lineTo(b[0], b[1]);
                c.stroke();
                c.fillStyle = rgba(INK, 0.35 + 0.6 * d);
                c.beginPath();
                c.arc(a[0], a[1], 1.6 + 1.4 * d, 0, Math.PI * 2);
                c.fill();
              },
            });
          });
        }
      });

      // The held core: still, level, breathing slightly.
      const breathe = reduce ? 0.5 : 0.5 + 0.5 * Math.sin(clock * 1.1);
      items.push({
        z: 0,
        draw: (c) => {
          const r = scale * 0.11;
          const glow = c.createRadialGradient(cx, cy, 0, cx, cy, r * (5 + breathe));
          glow.addColorStop(0, rgba(AMBER, 0.28 + 0.08 * breathe));
          glow.addColorStop(1, rgba(AMBER, 0));
          c.fillStyle = glow;
          c.beginPath();
          c.arc(cx, cy, r * (5 + breathe), 0, Math.PI * 2);
          c.fill();
          const body = c.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r);
          body.addColorStop(0, "rgba(255,226,170,1)");
          body.addColorStop(0.55, rgba(AMBER, 1));
          body.addColorStop(1, "rgba(150,92,24,1)");
          c.fillStyle = body;
          c.beginPath();
          c.arc(cx, cy, r, 0, Math.PI * 2);
          c.fill();
        },
      });

      items.sort((a, b) => a.z - b.z);
      for (const it of items) it.draw(ctx);
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (!reduce) clock += dt;
      if (!dragging) {
        // Coast, then ease back towards a slow idle turn.
        const idle = reduce ? 0 : 0.14;
        const k = Math.exp(-dt * 1.6);
        vel = { x: vel.x * k, y: idle + (vel.y - idle) * k };
        view = orthonormalize(mul(mul(ry(vel.y * dt), rx(vel.x * dt)), view));
      }
      draw();
      if (visible && (!reduce || dragging || Math.hypot(vel.x, vel.y) > 0.01)) raf = requestAnimationFrame(frame);
      else raf = 0;
    };
    const start = () => {
      if (!raf && visible) {
        prev = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      setTouched(true);
      cv.setPointerCapture(e.pointerId);
      last = { x: e.clientX, y: e.clientY, t: performance.now() };
      vel = { x: 0, y: 0 };
      start();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - last.x, dy = e.clientY - last.y;
      const dt = Math.max(0.008, (now - last.t) / 1000);
      const k = 0.0085;
      view = orthonormalize(mul(mul(ry(dx * k), rx(dy * k)), view));
      // Smoothed velocity for the throw.
      vel = { x: vel.x * 0.6 + ((dy * k) / dt) * 0.4, y: vel.y * 0.6 + ((dx * k) / dt) * 0.4 };
      last = { x: e.clientX, y: e.clientY, t: now };
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (performance.now() - last.t > 80) vel = { x: 0, y: 0 }; // held still before letting go
      vel = { x: Math.max(-6, Math.min(6, vel.x)), y: Math.max(-6, Math.min(6, vel.y)) };
      cv.releasePointerCapture?.(e.pointerId);
    };

    layout();
    draw();
    start();

    const ro = new ResizeObserver(() => {
      layout();
      draw();
    });
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      if (visible) start();
    });
    io.observe(el);
    const onVis = () => {
      visible = !document.hidden;
      if (visible) start();
    };
    document.addEventListener("visibilitychange", onVis);
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointercancel", onUp);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerup", onUp);
      cv.removeEventListener("pointercancel", onUp);
    };
  }, [reduce]);

  return (
    <figure className={`relative select-none ${className}`}>
      <div ref={wrap} className="absolute inset-0">
        <canvas
          ref={canvas}
          className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
          role="img"
          aria-label="A gimbal of three turning rings holding an amber point perfectly still. Drag to spin it."
        />
      </div>
      <figcaption
        className={`pointer-events-none absolute inset-x-0 bottom-0 text-center font-mono text-[11px] tracking-[0.14em] text-ink-4 uppercase transition-opacity duration-700 ${touched ? "opacity-0" : "opacity-100"}`}
      >
        Drag to spin
      </figcaption>
    </figure>
  );
}
