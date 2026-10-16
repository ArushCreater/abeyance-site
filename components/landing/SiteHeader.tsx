"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { CONSOLE_URL, DOCS_URL, SIGN_IN_URL } from "@/lib/site";

const LINKS = [
  { href: "/#install", label: "Product" },
  { href: DOCS_URL, label: "Docs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/security", label: "Security" },
];
const START = `${CONSOLE_URL}/login?mode=signup`;
const spring = { type: "spring", stiffness: 420, damping: 36, mass: 0.7 } as const;

/**
 * The island: a floating glass bar. It settles a little tighter once you
 * scroll; a soft highlight follows the pointer between links; on phones the
 * island itself grows into the menu.
 */
export function SiteHeader() {
  const reduce = useReducedMotion() ?? false;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16);
    queueMicrotask(on);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const wide = window.matchMedia("(min-width: 768px)");
    const onWide = () => wide.matches && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  const current = (href: string) => (href === "/pricing" && pathname === "/pricing") || (href === "/security" && pathname === "/security");

  return (
    <>
    <AnimatePresence>
      {open && (
        <motion.div
          key="dim"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-[rgb(21_23_28/0.18)] backdrop-blur-[2px] md:hidden"
        />
      )}
    </AnimatePresence>
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] sm:px-5">
      <motion.nav
        aria-label="Main"
        layout={!reduce}
        transition={spring}
        className={`island pointer-events-auto mx-auto ${open ? "island-open" : scrolled ? "island-scrolled" : ""}`}
        style={{ borderRadius: open ? 22 : 999, maxWidth: scrolled || open ? 880 : 960 }}
      >
        <motion.div layout="position" transition={spring} className={`flex items-center justify-between gap-3 ${scrolled ? "h-12" : "h-14"} pl-4 pr-2 transition-[height] duration-300 sm:pl-5`}>
          <Logo />
          <LayoutGroup>
            <ul className="hidden items-center md:flex" onPointerLeave={() => setHover(null)}>
              {LINKS.map((l) => (
                <li key={l.label} className="relative">
                  {(hover ?? (LINKS.find((x) => current(x.href))?.label ?? null)) === l.label && (
                    <motion.span layoutId="island-hover" transition={spring} className="absolute inset-0 rounded-full bg-ink/[0.055]" />
                  )}
                  <a
                    href={l.href}
                    onPointerEnter={() => setHover(l.label)}
                    onFocus={() => setHover(l.label)}
                    aria-current={current(l.href) ? "page" : undefined}
                    className={`relative block px-3.5 py-1.5 text-[14px] transition-colors ${current(l.href) ? "text-ink" : "text-ink-2 hover:text-ink"}`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </LayoutGroup>
          <div className="flex items-center gap-1">
            <a href={SIGN_IN_URL} className="hidden px-3 py-1.5 text-[14px] text-ink-2 transition-colors hover:text-ink sm:block">
              Sign in
            </a>
            <a href={START} className="island-cta group hidden sm:inline-flex">
              Start free
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                <path d="M2.5 6h7M6.5 3l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="island-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.05] md:hidden"
            >
              <span aria-hidden className="relative block h-2.5 w-4">
                <span className={`absolute left-0 h-[1.5px] w-4 rounded bg-current transition-transform duration-300 ${open ? "top-[4px] rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-[1.5px] w-4 rounded bg-current transition-transform duration-300 ${open ? "top-[4px] -rotate-45" : "top-[8.5px]"}`} />
              </span>
            </button>
          </div>
        </motion.div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="island-menu"
              key="menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={reduce ? { duration: 0 } : spring}
              className="overflow-hidden md:hidden"
            >
              <ul className="px-5 pb-2 pt-1">
                {[...LINKS, { href: SIGN_IN_URL, label: "Sign in" }].map((l, i) => (
                  <motion.li key={l.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 + i * 0.035 }} className="border-b border-line last:border-0">
                    <a href={l.href} onClick={() => setOpen(false)} className="flex items-center justify-between py-3.5 font-serif text-[1.55rem] leading-tight text-ink">
                      {l.label}
                      <span aria-hidden className="font-sans text-[15px] text-ink-4">
                        →
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="px-3 pb-3">
                <a href={START} className="island-cta flex h-12 w-full justify-center text-[15px]">
                  Start free
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
    </>
  );
}
