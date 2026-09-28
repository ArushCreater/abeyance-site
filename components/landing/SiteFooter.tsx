import { Logo } from "@/components/brand/Logo";
import { SIGN_IN_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-5 py-14 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-[40ch] text-sm text-ink-3">The commit control for AI agents. Made in Sydney.</p>
        </div>
        <div className="space-y-3 text-sm text-ink-3 md:text-right">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end">
            <a href="#how" className="hover:text-ink">How it works</a>
            <a href="#security" className="hover:text-ink">Security</a>
            <a href={SIGN_IN_URL} className="hover:text-ink">Sign in</a>
            <a href="#partner" className="hover:text-ink">Design partners</a>
          </nav>
          <p className="text-xs">All figures on this site are example data from a simulated deployment. © 2026 Abeyance.</p>
        </div>
      </div>
    </footer>
  );
}
