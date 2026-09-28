"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { arrowClass, buttonClass } from "@/components/ui/button";
import { DOCS_URL, SIGN_IN_URL } from "@/lib/site";
import { spring } from "@/lib/motion";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#proof", label: "Proof" },
  { href: "#security", label: "Security" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  // In-page links: close the menu (which unlocks scrolling), then glide to the section.
  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    if (!href.startsWith("#")) return;
    e.preventDefault();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", href);
      }),
    );
  };

  // Lock the page behind the menu, and close it on Escape or when the layout grows past it.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => wide.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-bg/80 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-3 px-5 sm:h-16 sm:px-8">
        <Logo className="-my-2 py-2.5" />
        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-full px-3 py-2 text-sm text-ink-2 transition-colors hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href={DOCS_URL} className="rounded-full px-3 py-2 text-sm text-ink-2 transition-colors hover:text-ink">
                Docs
              </a>
            </li>
          </ul>
          <a href={SIGN_IN_URL} className="hidden rounded-full px-3 py-2 text-sm text-ink-2 transition-colors hover:text-ink sm:inline-flex">
            Sign in
          </a>
          <a href="#partner" className={buttonClass("primary", "!h-9 whitespace-nowrap !px-4 max-sm:!hidden")}>
            Design partners <span aria-hidden className={arrowClass}>→</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="-mr-2 grid size-11 place-items-center rounded-full text-ink-2 transition-colors active:bg-raised lg:hidden"
          >
            <span aria-hidden className="relative block h-3 w-5">
              <span className={`absolute left-0 h-px w-5 bg-current transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-px w-5 bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-px w-5 bg-current transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
            transition={spring.settle}
            className="h-[calc(100dvh-3.5rem-env(safe-area-inset-top,0px))] overflow-y-auto border-t border-line bg-bg px-5 pb-[max(2rem,env(safe-area-inset-bottom,0px))] pt-4 sm:h-[calc(100dvh-4rem-env(safe-area-inset-top,0px))] sm:px-8 lg:hidden"
          >
            <ul className="divide-y divide-line">
              {[...LINKS, { href: DOCS_URL, label: "Documentation" }, { href: SIGN_IN_URL, label: "Sign in" }].map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring.settle, delay: 0.03 * i }}
                >
                  <a
                    href={l.href}
                    onClick={(e) => go(e, l.href)}
                    className="flex items-center justify-between py-4 font-display text-[1.75rem] font-[340] tracking-[-0.02em] text-ink [font-variation-settings:'wdth'_86]"
                  >
                    {l.label}
                    <span aria-hidden className="font-sans text-base text-ink-4">
                      {l.href.startsWith("#") ? "↓" : "↗"}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <a href="#partner" onClick={(e) => go(e, "#partner")} className={buttonClass("primary", "mt-8 !h-12 w-full text-base")}>
              Become a design partner <span aria-hidden className={arrowClass}>→</span>
            </a>
            <p className="mt-6 font-mono text-xs text-ink-3">Humans only for the actions that matter.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
