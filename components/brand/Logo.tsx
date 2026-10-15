import Link from "next/link";
import { WORDMARK_PATH, WORDMARK_VIEWBOX } from "@/lib/brand";
import { SYMBOL_PATHS, SYMBOL_VIEWBOX } from "@/lib/symbol";

export function LogoWordmark({ className = "", title }: { className?: string; title?: string }) {
  return <svg viewBox={WORDMARK_VIEWBOX} className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}><path d={WORDMARK_PATH} fill="currentColor" /></svg>;
}
export function LogoMark({ className = "", title }: { className?: string; title?: string }) {
  return <svg viewBox={SYMBOL_VIEWBOX} className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>{SYMBOL_PATHS.map((path, i) => <path key={i} d={path} fill="currentColor" />)}</svg>;
}
export function Logo({ href = "/", size = "md", className = "" }: { href?: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const wordHeight = { sm: "h-[18px]", md: "h-[22px]", lg: "h-8" }[size];
  const markHeight = { sm: "h-6 w-6", md: "h-[30px] w-[30px]", lg: "h-11 w-11" }[size];
  return <Link href={href} aria-label="Abeyance home" className={`inline-flex items-center gap-2.5 text-ink transition-opacity hover:opacity-75 ${className}`}><LogoMark className={`${markHeight} shrink-0 text-[#3458d4]`} /><LogoWordmark className={`${wordHeight} w-auto`} /></Link>;
}
