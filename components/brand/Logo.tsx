import Link from "next/link";
import { MARK_PATH, MARK_VIEWBOX, WORDMARK_PATH, WORDMARK_VIEWBOX } from "@/lib/brand";

export function LogoWordmark({ className = "", title }: { className?: string; title?: string }) {
  return <svg viewBox={WORDMARK_VIEWBOX} className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}><path d={WORDMARK_PATH} fill="currentColor" /></svg>;
}
export function LogoMark({ className = "", title }: { className?: string; title?: string }) {
  return <svg viewBox={MARK_VIEWBOX} className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}><path d={MARK_PATH} fill="currentColor" /></svg>;
}
export function Logo({ href = "/", size = "md", className = "" }: { href?: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const h = { sm: "h-[18px]", md: "h-[23px]", lg: "h-9" }[size];
  return <Link href={href} aria-label="Abeyance home" className={`inline-flex items-center text-ink transition-opacity hover:opacity-75 ${className}`}><LogoWordmark className={`${h} w-auto`} /></Link>;
}
