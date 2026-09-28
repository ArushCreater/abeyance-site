import { Logo } from "@/components/brand/Logo";
import { arrowClass, buttonClass } from "@/components/ui/button";
import { SIGN_IN_URL } from "@/lib/site";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#proof", label: "Proof" },
  { href: "#security", label: "Security" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-bg/75 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Logo />
        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-full px-3 py-2 text-sm text-ink-2 transition-colors hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={SIGN_IN_URL} className="rounded-full px-3 py-2 text-sm text-ink-2 transition-colors hover:text-ink">
            Sign in
          </a>
          <a href="#partner" className={buttonClass("primary", "!h-9 whitespace-nowrap !px-4")}>
            Design partners <span aria-hidden className={arrowClass}>→</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
