import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { Story } from "@/components/home/Story";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";

export default function Home() {
  return (
    <>
      <Intro />
      <SiteHeader />
      <main id="main">
        <Hero />
        <Story />
      </main>
      <SiteFooter />
    </>
  );
}
