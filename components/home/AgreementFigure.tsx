"use client";

import { useState } from "react";
import { Plate } from "./Essay";

// Illustrative: weekly agreement between Jev's shadow score and reviewers, for one action type.
const WEEKS = [
  { w: 1, pct: 71, n: 38 },
  { w: 2, pct: 76, n: 52 },
  { w: 3, pct: 79, n: 61 },
  { w: 4, pct: 83, n: 74 },
  { w: 5, pct: 85, n: 90 },
  { w: 6, pct: 88, n: 104 },
  { w: 7, pct: 90, n: 118 },
  { w: 8, pct: 91, n: 131 },
  { w: 9, pct: 93, n: 140 },
  { w: 10, pct: 94, n: 152 },
  { w: 11, pct: 95.5, n: 166 },
  { w: 12, pct: 96.4, n: 171 },
];
const THRESHOLD = 95;
const W = 720, H = 280, L = 44, R = 92, T = 20, B = 36;
const x = (w: number) => L + ((w - 1) / (WEEKS.length - 1)) * (W - L - R);
const y = (p: number) => T + ((100 - p) / (100 - 60)) * (H - T - B);

export function AgreementFigure() {
  const [hover, setHover] = useState<number | null>(null);
  const path = WEEKS.map((d, i) => `${i ? "L" : "M"} ${x(d.w).toFixed(1)} ${y(d.pct).toFixed(1)}`).join(" ");
  const last = WEEKS[WEEKS.length - 1];
  const h = hover !== null ? WEEKS[hover] : null;
  return (
    <Plate className="px-3 pb-3 pt-5 sm:px-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-2">
        <p className="text-[14px] font-medium text-ink">
          Agreement with reviewers · <code className="font-mono text-[12.5px] font-normal">payment.send</code>
        </p>
        <p className="text-[12.5px] text-ink-3">{h ? `Week ${h.w}: ${h.pct}% of ${h.n} reviewed actions` : "Hover the line for a week"}</p>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-2 h-auto w-full touch-none"
        role="img"
        aria-label={`Agreement rises from ${WEEKS[0].pct}% in week 1 to ${last.pct}% in week ${last.w}, passing the ${THRESHOLD}% threshold for assisted mode in week 11.`}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * W;
          const i = Math.round(((px - L) / (W - L - R)) * (WEEKS.length - 1));
          setHover(Math.max(0, Math.min(WEEKS.length - 1, i)));
        }}
        onPointerLeave={() => setHover(null)}
      >
        {[60, 70, 80, 90, 100].map((p) => (
          <g key={p}>
            <line x1={L} x2={W - R} y1={y(p)} y2={y(p)} stroke="rgb(21 23 28 / 0.07)" />
            <text x={L - 10} y={y(p) + 4} textAnchor="end" className="fill-ink-4 font-mono text-[11px]">
              {p}%
            </text>
          </g>
        ))}
        {WEEKS.filter((d) => d.w % 2 === 1 || d.w === 12).map((d) => (
          <text key={d.w} x={x(d.w)} y={H - 12} textAnchor="middle" className="fill-ink-4 font-mono text-[11px]">
            {d.w === 1 ? "week 1" : d.w}
          </text>
        ))}
        {/* The opt-in line. */}
        <line x1={L} x2={W - R} y1={y(THRESHOLD)} y2={y(THRESHOLD)} stroke="rgb(21 23 28 / 0.45)" strokeDasharray="4 4" />
        <text x={W - R + 8} y={y(THRESHOLD) + 4} className="fill-ink-3 text-[11.5px]">
          assisted mode
        </text>
        {h && <line x1={x(h.w)} x2={x(h.w)} y1={T} y2={H - B} stroke="rgb(21 23 28 / 0.18)" />}
        <path d={path} fill="none" stroke="#3458d4" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {h && <circle cx={x(h.w)} cy={y(h.pct)} r={4.5} fill="#3458d4" stroke="white" strokeWidth={2} />}
        <circle cx={x(last.w)} cy={y(last.pct)} r={4} fill="#3458d4" stroke="white" strokeWidth={2} />
        <text x={x(last.w) + 10} y={y(last.pct) - 8} className="fill-ink text-[12px] font-medium">
          {last.pct}%
        </text>
      </svg>
      <div className="sr-only">
      <table>
        <caption>Weekly agreement between Jev and reviewers for payment.send</caption>
        <thead>
          <tr>
            <th>Week</th>
            <th>Agreement</th>
            <th>Reviewed actions</th>
          </tr>
        </thead>
        <tbody>
          {WEEKS.map((d) => (
            <tr key={d.w}>
              <td>{d.w}</td>
              <td>{d.pct}%</td>
              <td>{d.n}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </Plate>
  );
}
