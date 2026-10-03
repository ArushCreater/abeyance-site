"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; title: string };

/**
 * The in-page contents: a hairline list that marks the section you're reading.
 * Server-rendered with nothing marked, so it works without JavaScript.
 */
export function LegalToc({ items, track = true }: { items: TocItem[]; track?: boolean }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!track) return;
    const els = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    // The current section is the last one whose top has passed a line a quarter of the way down.
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.25;
      let current: string | null = null;
      for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id;
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items, track]);

  return (
    <ol className="border-t border-line">
      {items.map((item, i) => {
        const on = active === item.id;
        return (
          <li key={item.id} className="border-b border-line">
            <a
              href={`#${item.id}`}
              aria-current={on ? "location" : undefined}
              className={`relative flex items-baseline gap-3 py-2.5 pl-4 text-sm leading-snug transition-colors ${on ? "text-ink" : "text-ink-3 hover:text-ink-2"}`}
            >
              <span
                aria-hidden
                className={`absolute left-0 top-[1.2rem] h-px w-2 origin-left bg-ink transition-transform duration-300 ease-out ${on ? "scale-x-100" : "scale-x-0"}`}
              />
              <span aria-hidden className="w-5 shrink-0 font-mono text-[11px] text-ink-4">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.title}
            </a>
          </li>
        );
      })}
    </ol>
  );
}
