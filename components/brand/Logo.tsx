import Link from "next/link";
import { WORDMARK_PATH, WORDMARK_VIEWBOX } from "@/lib/brand";
import { SYMBOL_PATHS, SYMBOL_VIEWBOX } from "@/lib/symbol";

export function LogoWordmark({ className = "", title }: { className?: string; title?: string }) {
  return <svg viewBox={WORDMARK_VIEWBOX} className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}><path d={WORDMARK_PATH} fill="currentColor" /></svg>;
}
export function LogoMark({ className = "", title }: { className?: string; title?: string }) {
  return <svg viewBox={SYMBOL_VIEWBOX} className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>{SYMBOL_PATHS.map((path, i) => <path key={i} d={path} fill="currentColor" />)}</svg>;
}
/** The aperture mark and the name, set in type: quieter than a drawn wordmark, and it scales cleanly. */
export function Logo({ href = "/", size = "md", className = "" }: { href?: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const mark = { sm: "h-5 w-5", md: "h-[22px] w-[22px]", lg: "h-8 w-8" }[size];
  const text = { sm: "text-[14px]", md: "text-[15.5px]", lg: "text-xl" }[size];
  return (
    <Link href={href} aria-label="Abeyance home" className={`inline-flex items-center gap-2 text-ink transition-opacity hover:opacity-70 ${className}`}>
      <LogoMark className={`${mark} shrink-0 text-[#3458d4]`} />
      <span className={`font-sans font-medium tracking-[-0.015em] ${text}`}>Abeyance</span>
    </Link>
  );
}
