import { Hero } from "@/components/landing/Hero";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { DeveloperStart, PolicyPlayground, PolicyEditor } from "@/components/landing/DeveloperSections";
import { AuditSection, ShadowScoring, Pricing, FAQ, DeveloperCTA } from "@/components/landing/ProductSections";

export default function Home() {
  return <><SiteHeader /><main id="main"><Hero /><PolicyPlayground /><DeveloperStart /><PolicyEditor /><AuditSection /><ShadowScoring /><Pricing /><FAQ /><DeveloperCTA /></main><SiteFooter /></>;
}
