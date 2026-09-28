"use client";

import { motion, useInView } from "motion/react";
import { useId, useRef } from "react";
import { spring } from "@/lib/motion";

/**
 * A unit visualisation: one mark per `unit` items, laid out in rows that
 * draw themselves in (scaleX only). Scales to its container via SVG.
 */
export function TickField({
  count,
  unit = 10,
  perRow = 80,
  tone,
  label,
}: {
  count: number;
  unit?: number;
  perRow?: number;
  tone: string; // CSS colour
  label: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const seen = useInView(ref, { once: true, margin: "-15% 0px" });
  const id = useId().replace(/:/g, "");
  const ticks = Math.round(count / unit);
  const rows = Math.max(1, Math.ceil(ticks / perRow));
  const pitch = 6;
  const rowH = 12;
  const gap = 7;
  const width = perRow * pitch;
  const height = rows * rowH + (rows - 1) * gap;

  return (
    <svg ref={ref} viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full" role="img" aria-label={label}>
      <defs>
        <pattern id={`t${id}`} width={pitch} height={rowH} patternUnits="userSpaceOnUse">
          <rect width={1.6} height={rowH} rx={0.8} fill={tone} />
        </pattern>
      </defs>
      {Array.from({ length: rows }, (_, r) => {
        const inRow = Math.min(perRow, ticks - r * perRow);
        return (
          <motion.rect
            key={r}
            x={0}
            y={r * (rowH + gap)}
            width={inRow * pitch}
            height={rowH}
            fill={`url(#t${id})`}
            style={{ originX: 0, transformBox: "fill-box" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={seen ? { scaleX: 1, opacity: 1 } : undefined}
            transition={{ ...spring.settle, delay: r * 0.045 }}
          />
        );
      })}
    </svg>
  );
}
