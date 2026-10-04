import { TitleReveal } from "@/components/ui/title-reveal";
import { headingFont } from "@/lib/fonts";
import { Education } from "@/components/about/education";
import { Experience } from "@/components/about/experience";
import { Skills } from "@/components/about/skills";
import { Stack } from "@/components/about/stack";
import { FadeIn } from "@/components/ui/motion-primitives";
import type { ReactNode } from "react";
import { profile } from "@/lib/profile";

export function AboutSection(): ReactNode {
  return (
    <section id="about" className="flex flex-1 flex-col scroll-mt-24">
      <section className="mx-auto w-full max-w-160 px-6 pt-20 pb-16 sm:px-10 sm:pt-28 sm:pb-24">
        <FadeIn delay={0.5}>
          <div className="rounded-4xl border border-foreground/5 bg-foreground/1.5 p-8 sm:p-12 dark:bg-foreground/3">
            <h2 className={`${headingFont.className} text-[1.75rem] font-normal tracking-tight text-foreground sm:text-[2rem]`}><TitleReveal>Hello! I&rsquo;m <span className="border-b border-foreground/30 pb-0.5">{profile.name}</span>.</TitleReveal></h2>
            <div className="mt-8 space-y-6 text-[17px] leading-[1.7] tracking-tight text-foreground/75 sm:text-[18px]">
              <p>
                I&rsquo;m a <strong className="font-semibold text-foreground">frontend developer and software engineer</strong> based in {profile.location}, with <strong className="font-semibold text-foreground">{profile.experience} of experience</strong> turning ideas into responsive, intuitive web applications. I work with React, Next.js, Vue, Nuxt, TypeScript, and Tailwind CSS, taking interfaces from design through development.
              </p>
              <p>
                At Bitlogicx, I work on frontend development, from building reusable components to connecting interfaces with APIs. My experience includes dashboards, role-based navigation, and multilingual interfaces with RTL support.
              </p>
              <p>
                My focus is the frontend, with additional full-stack experience working with APIs, AdonisJS, and MySQL. I care about clean architecture, thoughtful interactions, and making complex workflows feel straightforward to use.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto w-full max-w-[40rem] px-6 pb-20 sm:px-10 sm:pb-28">
        <FadeIn delay={0.1}>
          <div className="flex flex-col gap-10">
            <Experience />
            <Education />
            <Skills />
            <Stack />
          </div>
        </FadeIn>
      </section>

      <div className="h-12 sm:h-16" />
    </section>
  );
}
