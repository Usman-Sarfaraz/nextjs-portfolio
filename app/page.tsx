import { ContactCard } from "@/components/contact/contact-card";
import { AboutSection } from "@/components/about/about-section";
import { TechnologyTrail } from "@/components/ui/technology-trail";
import { Hero } from "@/components/hero/hero";
import { IntroSection } from "@/components/intro/intro-section";
import { LayersSection } from "@/components/layers/layers-section";
import { HeroNavigation } from "@/components/hero/hero-navigation";
import { WhyMe } from "@/components/why-me/why-me";
import { Services } from "@/components/services/services";
import { Projects } from "@/components/projects/projects";
import { ScreensSection } from "@/components/screens/screens-section";
import { BugHuntProvider } from "@/components/bug-hunt/bug-hunt-context";
import { DebugFrog } from "@/components/bug-hunt/debug-frog";
import { HiddenBug } from "@/components/bug-hunt/hidden-bug";import { profile } from "@/lib/profile";
import { createMetadata, siteConfig } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  description: siteConfig.description,
  path: "/",
});

export default function HomePage(): ReactNode {
  return (
    <div>
      <HeroNavigation />
    <main id="main-content" className="flex flex-1 flex-col gap-8 md:gap-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: profile.name,
        alternateName: siteConfig.name,
        jobTitle: "Frontend Developer & UI Engineer",
        description: siteConfig.description,
        sameAs: [profile.linkedin, profile.github, profile.instagram],
        knowsAbout: ["Frontend Development", "UI Development", "React", "Next.js", "Vue", "Nuxt", "TypeScript"],
        ...(siteConfig.url ? { url: siteConfig.url, image: new URL("/images/portfolio_portrait.png", siteConfig.url).toString() } : {}),
      }).replace(/</g, "\\u003c") }} />
      <BugHuntProvider>
      <section id="home" className="relative"><Hero /><HiddenBug id="hero" rotate={-24} className="right-[38%] top-[16%]" /></section>
      <TechnologyTrail>
        {/* One block, no gap: the layers section overlaps the intro's final pinned screen. */}
        <div><IntroSection /><LayersSection /></div>
        <section id="projects" className="relative scroll-mt-24">
          <Projects withHeadline />
          <HiddenBug id="projects-top" rotate={35} className="right-[6%] top-12" />
          <HiddenBug id="projects-end" rotate={-60} className="bottom-16 left-[5%]" />
        </section>
        <div className="relative"><Services /><HiddenBug id="services" rotate={80} className="left-[46%] top-20" /></div>
        <ScreensSection />
        <div className="relative"><WhyMe /><HiddenBug id="why-me" rotate={-15} className="bottom-14 right-[9%]" /></div>
        <div className="relative"><AboutSection /><HiddenBug id="about" rotate={150} className="right-[4%] top-1/3" /></div>
        <section id="contact" className="relative scroll-mt-24"><ContactCard /><HiddenBug id="contact" rotate={20} className="right-[12%] top-10" /></section>
      </TechnologyTrail>
      <DebugFrog />
      </BugHuntProvider>
    </main>
    </div>
  );
}
