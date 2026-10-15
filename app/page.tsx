import { Hero } from "@/components/landing/Hero";
import { Security } from "@/components/landing/Security";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { DeveloperStart, PolicyPlayground, ShadowScoring, DeveloperCTA, Pricing } from "@/components/landing/DeveloperSections";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <DeveloperStart />
        <PolicyPlayground />
        <ShadowScoring />
        <Security />
        <Pricing />
        <DeveloperCTA />
      </main>
      <SiteFooter />
    </>
  );
}
