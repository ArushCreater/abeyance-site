"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { arrowClass, buttonClass } from "@/components/ui/button";
import { DOCS_URL } from "@/lib/site";

/** The footer's design-partner invitation. Hidden on /partners, where it would link to itself. */
export function FooterCTA() {
  const pathname = usePathname();
  if (pathname === "/partners") return null;
  return (
    <div className="lg:pb-4">
      <p className="max-w-[36ch] leading-relaxed text-ink-2">
        One tool call is all it takes to start. Set a boundary, hold an action, and see the whole story in your console.
      </p>
      <Link href={`${DOCS_URL}/quickstart`} className={buttonClass("ghost", "mt-7 !h-12 w-full !px-6 text-[15px] sm:w-auto")}>
        Read the quickstart <span aria-hidden className={arrowClass}>↗</span>
      </Link>
    </div>
  );
}
