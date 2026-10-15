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

export function SiteFooter() {
  return <footer className="site-footer"><div className="footer-grid"><div><Logo /><p>The approval and audit layer<br />for AI agent actions.</p></div><nav aria-label="Footer">{GROUPS.map(group => <div key={group.title}><h2>{group.title}</h2><ul>{group.links.map(link => <li key={link.label}><FooterAnchor {...link} /></li>)}</ul></div>)}</nav></div><div className="footer-bottom"><p>© 2026 Abeyance</p><p>Built for agents. Answerable to people.</p></div></footer>;
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
