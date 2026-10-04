import { ContactCard } from "@/components/contact/contact-card";
import { AboutSection } from "@/components/about/about-section";
import { TechnologyTrail } from "@/components/ui/technology-trail";
import { Hero } from "@/components/hero/hero";
import { IntroSection } from "@/components/intro/intro-section";
import { HeroNavigation } from "@/components/hero/hero-navigation";
import { Projects } from "@/components/projects/projects";
import { profile } from "@/lib/profile";
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
    <main id="main-content" className="flex flex-1 flex-col gap-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: profile.name,
        alternateName: siteConfig.name,
        jobTitle: "Frontend Developer & UI Engineer",
        description: siteConfig.description,
        sameAs: [profile.linkedin],
        knowsAbout: ["Frontend Development", "UI Development", "React", "Next.js", "Vue", "Nuxt", "TypeScript"],
        ...(siteConfig.url ? { url: siteConfig.url, image: new URL("/images/portfolio_portrait.png", siteConfig.url).toString() } : {}),
      }).replace(/</g, "\\u003c") }} />
      <section id="home"><Hero /></section>
      <TechnologyTrail>
        <div className="pb-16"><IntroSection /></div>
        <section id="projects" className="scroll-mt-24"><Projects withHeadline /></section>
        <AboutSection />
        <section id="contact" className="scroll-mt-24"><ContactCard /></section>
        <div className="h-12 sm:h-16" />
      </TechnologyTrail>
    </main>
    </div>
  );
}
