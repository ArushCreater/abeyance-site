import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { LEGAL_DOCS } from "@/lib/legal";
import { DOCS_URL, SIGN_IN_URL } from "@/lib/site";

type FooterLink = { href: string; label: string; external?: boolean };

const LEGAL_IN_FOOTER = ["/legal/terms", "/legal/privacy", "/legal/dpa", "/legal/aup", "/legal/cookies", "/legal/pilot"];

const GROUPS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/#install", label: "Install" },
      { href: "/#rules", label: "Rules" },
      { href: "/#approvals", label: "Approvals" },
      { href: "/#scoring", label: "Shadow scoring" },
      { href: "/#pricing", label: "Pricing" },
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

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 pb-10 pt-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-[30ch] font-serif text-[17px] leading-snug text-ink-2">The approval and audit layer for AI agent actions.</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="text-[13px] font-medium text-ink">{group.title}</h2>
              <ul className="mt-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <FooterAnchor {...link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-2 px-5 pb-8 text-[13px] text-ink-3 sm:px-8">
        <p>© 2026 Abeyance</p>
        <p>Built for agents. Answerable to people.</p>
      </div>
    </footer>
  );
}

function FooterAnchor({ href, label, external }: FooterLink) {
  const className = "group flex items-baseline gap-2 py-1.5 text-[14px] leading-snug text-ink-3 transition-colors hover:text-ink";
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
