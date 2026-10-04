import { headingFont } from "@/lib/fonts";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Code2, BriefcaseBusiness } from "lucide-react";
import type { ReactNode } from "react";
import { profile } from "@/lib/profile";
import { FadeIn } from "@/components/ui/motion-primitives";
import { StackMarquee } from "./stack-marquee";
import { RotatingHeadline } from "./rotating-headline";
import styles from "./hero.module.css";
import { PortraitReveal } from "./portrait-reveal";
import ShinyText from "@/components/react-bits/ShinyText";
import { TitleReveal } from "@/components/ui/title-reveal";
import portrait from "@/public/images/portfolio_portrait.png";
import { HeroRevealSequence } from "./hero-reveal-sequence";

export function Hero(): ReactNode {
  return (
    <HeroRevealSequence>
    <section aria-labelledby="hero-heading" className={`${styles.hero} hero-screen relative mx-3 my-5 lg:flex lg:h-[calc(100svh-2.5rem)] lg:flex-col overflow-hidden rounded-[2rem] bg-[#afb5b6] text-[#162022] sm:mx-5 sm:rounded-[2.5rem] dark:bg-[#333b3e] dark:text-white`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_50%,#e0e3e3_0%,transparent_65%)] dark:bg-[radial-gradient(ellipse_at_85%_50%,#687174_0%,transparent_65%)]" />

      <div className="hero-navigation-space" aria-hidden="true" />

      <div className={`${styles.body} hero-screen__body relative w-full lg:flex lg:min-h-0 lg:flex-1 lg:flex-col px-8 sm:px-20 lg:px-32 xl:px-40 2xl:px-48`}>
        <div className={`${styles.content} hero-screen__content relative grid items-center gap-8 lg:min-h-0 lg:flex-1 lg:grid-cols-[1.08fr_1fr] lg:gap-10`}>
          <FadeIn className={`${styles.copy} relative z-10 min-w-0 pt-12 pb-8 sm:pt-16 lg:flex lg:flex-col lg:justify-center lg:py-4`}>
            <div className="mb-7 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <span className="text-current/65">Frontend development &amp; UI design</span>
            </div>
            <h1 id="hero-heading" className={`${headingFont.className} max-w-full [container-type:inline-size] text-[clamp(2.875rem,4.8vw,5.5rem)] font-normal tracking-[-0.025em] leading-[1.18] lg:text-[clamp(2.5rem,min(4.8vw,8svh),5.5rem)]`}>
              <span className="block text-[min(1em,8.7cqw)]">
              <span className="block"><TitleReveal>Thoughtful <span className="text-emerald-800 dark:text-emerald-300">Design.</span></TitleReveal></span>
              <RotatingHeadline />
              <span className="block"><TitleReveal completesHeroText>Websites that <span className="underline decoration-emerald-700/50 decoration-[0.04em] underline-offset-[0.14em] dark:decoration-emerald-300/60"><ShinyText text="work." speed={2.5} delay={1} color="var(--work-text)" shineColor="var(--work-shine)" className={styles.shinyWork ?? ""} /></span></TitleReveal></span>
              </span>
            </h1>
            <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-current/70 sm:text-lg">
              I&rsquo;m {profile.shortName}, a frontend developer crafting fast, intuitive web experiences with thoughtful design and clean code.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={`mailto:${profile.email}`} className="focus-ring group inline-flex items-center gap-4 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition-all duration-300 hover:bg-[#162022] hover:text-white hover:shadow-xl motion-safe:hover:-translate-y-1 motion-safe:active:scale-95 motion-reduce:transition-none sm:text-base">
                Let&rsquo;s talk
                <ArrowUpRight aria-hidden="true" className="h-5 w-5 transition-transform duration-300 motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1 motion-reduce:transition-none" />
              </a>
              <a href="#projects" className="focus-ring group inline-flex items-center gap-3 rounded-full border border-current/15 bg-white/30 px-6 py-3.5 text-sm transition-all duration-300 hover:border-current/30 hover:bg-white/50 hover:shadow-lg dark:border-white/20 dark:bg-white/10 dark:hover:border-white/30 dark:hover:bg-white/20 motion-safe:hover:-translate-y-1 motion-safe:active:scale-95 motion-reduce:transition-none sm:text-base">
                View work <ArrowDown aria-hidden="true" className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:translate-y-1 motion-reduce:transition-none" />
              </a>
            </div>
          </FadeIn>

          <PortraitReveal className={`${styles.portrait} hero-screen__portrait relative mx-auto h-[440px] w-full self-center sm:h-[540px] lg:h-full lg:min-h-0 lg:max-h-[660px]`}>
            <Image
              src={portrait}
              alt={`${profile.name}, frontend developer and software engineer`}
              fill
              priority
              unoptimized
              sizes="(min-width: 1024px) 46vw, calc(100vw - 48px)"
              className="object-contain object-center "
            />
            <div className={styles.portraitCards}>
            <div data-magnetic-card className={`${styles.floatingCard} ${styles.experienceCard}`}>
              <span className={styles.cardIcon}><BriefcaseBusiness aria-hidden="true" size={18} /></span>
              <div><p className={styles.cardTitle}>{profile.experience}</p><p className={styles.cardCaption}>of experience</p></div>
            </div>
            <div data-magnetic-card className={`${styles.floatingCard} ${styles.developmentCard}`}>
              <span className={styles.cardIcon}><Code2 aria-hidden="true" size={18} /></span>
              <div><p className={styles.cardTitle}>Frontend developer</p><p className={styles.cardCaption}>React &amp; Vue</p></div>
            </div>
            </div>
          </PortraitReveal>
        </div>

        <div className={`${styles.stack} relative z-10 flex flex-col gap-6 border-t border-current/10 py-7 sm:py-9 lg:shrink-0 lg:flex-row lg:py-5 lg:items-center lg:gap-10`}>
          <p className="shrink-0 text-base font-medium leading-snug tracking-tight text-black dark:text-white sm:text-lg lg:max-w-[22ch]">Built with a modern stack</p>
          <StackMarquee />
        </div>
      </div>
    </section>
    </HeroRevealSequence>
  );
}
