"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { arrowClass, buttonClass } from "@/components/ui/button";

/** The footer's design-partner invitation. Hidden on /partners, where it would link to itself. */
export function FooterCTA() {
  const pathname = usePathname();
  if (pathname === "/partners") return null;
  return (
    <div className="lg:pb-4">
      <p className="max-w-[36ch] leading-relaxed text-ink-2">
        We’re working with a small number of regulated teams who have agents ready to go but can’t risk the irreversible actions.
      </p>
      <Link href="/partners" className={buttonClass("ghost", "mt-7 !h-12 w-full !px-6 text-[15px] sm:w-auto")}>
        Become a design partner <span aria-hidden className={arrowClass}>→</span>
      </Link>
    </div>
  );
}
