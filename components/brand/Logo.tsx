import Link from "next/link";

// Drawn as outlines: substantial stems, compact spacing, and open counters.
// No dependency on a downloaded typeface, at navbar or billboard size.
import { MARK_PATH, WORDMARK_GLYPHS } from "@/lib/brand";

export function LogoWordmark({ className = "", title }: { className?: string; title?: string }) {
  return <svg viewBox="0 -2 654 104" className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
    {WORDMARK_GLYPHS.map(([x, d]) => <path key={x} d={d} transform={`translate(${x} 0)`} fill="currentColor" fillRule="evenodd" />)}
  </svg>;
}
export function LogoMark({ className = "", title }: { className?: string; title?: string }) {
  return <svg viewBox="0 0 82 100" className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}><path d={MARK_PATH} fill="currentColor" fillRule="evenodd" /></svg>;
}
export function Logo({ href = "/", size = "md", className = "" }: { href?: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const h = { sm: "h-[18px]", md: "h-[23px]", lg: "h-9" }[size];
  return <Link href={href} aria-label="Abeyance home" className={`inline-flex items-center text-ink transition-opacity hover:opacity-75 ${className}`}><LogoWordmark className={`${h} w-auto`} /></Link>;
}
