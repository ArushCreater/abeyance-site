"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ScrollLogo } from "@/components/brand/ScrollLogo";
import { arrowClass, buttonClass } from "@/components/ui/button";
import { DOCS_URL, SIGN_IN_URL } from "@/lib/site";
import { spring } from "@/lib/motion";

const LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/#policies", label: "Policies" },
  { href: "/#proof", label: "Smart scoring" },
  { href: "/#pricing", label: "Pricing" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Section links on the home page: close the menu (which unlocks scrolling), then glide there.
  // Anywhere else they're ordinary links to /#section.
  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    if (!href.startsWith("/#") || pathname !== "/") return;
    e.preventDefault();
    const hash = href.slice(1);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", hash);
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
    <header className="site-header">
      <nav aria-label="Main" className="glass-navbar">
        <ScrollLogo className="nav-wordmark" />
        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-full px-2.5 py-2 text-[13px] text-ink-2 transition-colors hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href={DOCS_URL} className="rounded-full px-2.5 py-2 text-[13px] text-ink-2 transition-colors hover:text-ink">
                Docs
              </a>
            </li>
          </ul>
          <a href={SIGN_IN_URL} className="hidden rounded-full px-2.5 py-2 text-[13px] text-ink-2 transition-colors hover:text-ink sm:inline-flex">
            Sign in
          </a>
          <Link href="/#start" className={buttonClass("primary", "nav-start whitespace-nowrap !h-10 !px-5")}>
            Start building <span aria-hidden className={arrowClass}>↗</span>
          </Link>
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
            className="glass-mobile-menu lg:hidden"
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
                      {l.href.startsWith("/#") ? "↓" : "↗"}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <Link href="/#start" onClick={(e) => go(e, "/#start")} className={buttonClass("primary", "mt-8 !h-12 w-full text-base")}>
              Start building <span aria-hidden className={arrowClass}>↗</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
