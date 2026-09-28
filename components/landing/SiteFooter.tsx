import { Logo } from "@/components/brand/Logo";
import { DOCS_URL, SIGN_IN_URL } from "@/lib/site";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#security", label: "Security" },
  { href: DOCS_URL, label: "Docs" },
  { href: SIGN_IN_URL, label: "Sign in" },
  { href: "#partner", label: "Design partners" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line pb-[env(safe-area-inset-bottom,0px)]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 py-12 sm:gap-10 sm:px-8 sm:py-14 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-[40ch] text-sm text-ink-3">The commit control for AI agents. Made in Sydney.</p>
        </div>
        <div className="space-y-4 text-sm text-ink-3 md:space-y-3 md:text-right">
          <nav aria-label="Footer" className="-mx-2 grid grid-cols-2 sm:mx-0 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2 md:justify-end">
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} className="px-2 py-2.5 hover:text-ink sm:px-0 sm:py-2">
                {l.label}
              </a>
            ))}
          </nav>
          <p className="text-xs leading-relaxed">All figures on this site are example data from a simulated deployment. © 2026 Abeyance.</p>
        </div>
      </div>
    </footer>
  );
}
