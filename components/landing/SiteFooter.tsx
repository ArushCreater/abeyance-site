import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Placeholder } from "@/components/legal/Placeholder";
import { ExampleTag } from "@/components/ui/ExampleTag";
import { LEGAL_DOCS } from "@/lib/legal";
import { DOCS_URL, SIGN_IN_URL } from "@/lib/site";
import { FooterCTA } from "./FooterCTA";
import { FooterThreshold } from "./FooterThreshold";

type FooterLink = { href: string; label: string; external?: boolean };

const LEGAL_IN_FOOTER = ["/legal/terms", "/legal/privacy", "/legal/dpa", "/legal/aup", "/legal/cookies", "/legal/pilot"];

const GROUPS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/#how", label: "How it works" },
      { href: "/#proof", label: "Shadow mode" },
      { href: "/#integrations", label: "Integrations" },
      { href: "/#security", label: "Security" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: DOCS_URL, label: "Docs", external: true },
      { href: `${DOCS_URL}/api/overview`, label: "API reference", external: true },
      { href: SIGN_IN_URL, label: "Console sign in", external: true },
    ],
  },
  {
    title: "Trust",
    links: [
      { href: "/trust", label: "Trust centre" },
      { href: "/security", label: "Security overview" },
      { href: "/responsible-ai", label: "Responsible AI" },
      { href: "/legal/subprocessors", label: "Subprocessors" },
      { href: "/legal/vulnerability-disclosure", label: "Vulnerability disclosure" },
    ],
  },
  {
    title: "Legal",
    links: LEGAL_IN_FOOTER.map((href) => {
      const doc = LEGAL_DOCS.find((d) => d.href === href);
      return { href, label: doc?.short ?? href };
    }),
  },
];

/*
 * The footer: one calm line, a threshold with something held at it, and the
 * links as hairline lists. Amber appears once, on the held dot.
 */
export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="grid gap-10 pt-20 sm:pt-28 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:items-end lg:gap-16 lg:pt-36">
          <p className="display-tight text-[clamp(2.75rem,8.4vw,6.75rem)] font-[280] text-ink">
            Nothing irreversible
            <span className="block text-ink-3">without a reason.</span>
          </p>
          <FooterCTA />
        </div>

        <FooterThreshold className="mt-16 sm:mt-24 lg:mt-28" />

        <div className="grid gap-14 pb-16 pt-16 sm:pb-20 sm:pt-20 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div className="flex flex-col items-start">
            <Logo />
            <p className="mt-4 max-w-[30ch] text-sm leading-relaxed text-ink-3">The commit control for AI agents.</p>
            <p className="label mt-8">Made in Sydney</p>
            <p aria-hidden className="mt-1.5 font-mono text-[11px] tracking-[0.04em] text-ink-4">
              33.87° S · 151.21° E
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-x-8">
            {GROUPS.map((g) => (
              <div key={g.title} className="min-w-0">
                <h2 className="label">{g.title}</h2>
                <ul className="mt-4 border-t border-line">
                  {g.links.map((l) => (
                    <li key={l.label} className="border-b border-line">
                      <FooterAnchor {...l} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-5 border-t border-line pb-[max(2rem,env(safe-area-inset-bottom,0px))] pt-8 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="space-y-1.5 text-xs leading-relaxed text-ink-3">
            <p>
              © 2026 <Placeholder>COMPANY LEGAL NAME</Placeholder>
            </p>
            <p>All figures on this site are example data from a simulated deployment.</p>
          </div>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] text-ink-3">
            <ExampleTag>Example</ExampleTag>
            <span>
              ledger <span aria-hidden className="text-ink-4">·</span> seq 000000 <span aria-hidden className="text-ink-4">·</span> sha256 9f3c…e1
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterAnchor({ href, label, external }: FooterLink) {
  const className = "group flex items-baseline justify-between gap-3 py-2.5 text-sm leading-snug text-ink-2 transition-colors hover:text-ink";
  const inner = (
    <>
      <span className="transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:translate-x-1">{label}</span>
      {external && (
        <span aria-hidden className="text-xs text-ink-4 transition-colors group-hover:text-ink-3">
          ↗
        </span>
      )}
    </>
  );
  // Hash links and other sites are plain anchors; pages on this site get client navigation.
  return href.startsWith("/") && !href.startsWith("/#") ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={className}>
      {inner}
    </a>
  );
}
