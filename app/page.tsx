import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Integrations } from "@/components/landing/Integrations";
import { PartnerCTA } from "@/components/landing/PartnerCTA";
import { Security } from "@/components/landing/Security";
import { ShadowProof } from "@/components/landing/ShadowProof";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { ThresholdStream } from "@/components/landing/ThresholdStream";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <ThresholdStream />
        <HowItWorks />
        <ShadowProof />
        <Integrations />
        <Security />
        <PartnerCTA />
      </main>
      <SiteFooter />
    </>
  );
}
