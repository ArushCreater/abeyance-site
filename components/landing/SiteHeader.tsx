"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { CONSOLE_URL, DOCS_URL, SIGN_IN_URL } from "@/lib/site";

const LINKS = [
  { href: DOCS_URL, label: "Docs" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/security", label: "Security" },
  { href: SIGN_IN_URL, label: "Sign in" },
];

/**
 * A quiet bar: the mark and name on the left, a few words on the right.
 * Transparent over the hero; a hairline and a little frost once you scroll.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    queueMicrotask(on);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top,0px)] transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open ? "border-b border-line bg-bg/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 sm:px-8">
        <Logo />
        <div className="flex items-center gap-1">
          <ul className="hidden items-center md:flex">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="px-3 py-2 text-[14px] text-ink-2 transition-colors hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={`${CONSOLE_URL}/login?mode=signup`}
            className="ml-2 hidden h-9 items-center rounded-full bg-ink px-4 text-[14px] font-medium text-bg transition-opacity hover:opacity-85 sm:inline-flex"
          >
            Start free
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="-mr-2 px-3 py-2 text-[14px] text-ink md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="h-[calc(100dvh-4rem)] overflow-y-auto px-5 pb-10 pt-4 md:hidden"
          >
            <ul>
              {[...LINKS, { href: `${CONSOLE_URL}/login?mode=signup`, label: "Start free" }].map((l, i) => (
                <motion.li key={l.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }} className="border-b border-line">
                  <a href={l.href} onClick={() => setOpen(false)} className="block py-4 font-serif text-[1.9rem] leading-tight text-ink">
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
