import { headingFont } from "@/lib/fonts";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Code2 } from "lucide-react";
import type { ReactNode } from "react";
import { profile } from "@/lib/profile";
import { NavThemeToggle } from "@/components/layout/nav";
import { FadeIn } from "@/components/ui/motion-primitives";
import { StackMarquee } from "./stack-marquee";
import { RotatingHeadline } from "./rotating-headline";
import portrait from "@/public/images/portfolio_portrait.png";

export function Hero(): ReactNode {
  return (
    <section aria-labelledby="hero-heading" className="hero-screen relative mx-3 my-5 lg:flex lg:h-[calc(100svh-2.5rem)] lg:flex-col overflow-hidden rounded-[2rem] bg-[#afb5b6] text-[#162022] sm:mx-5 sm:rounded-[2.5rem] dark:bg-[#333b3e] dark:text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_50%,#e0e3e3_0%,transparent_65%)] dark:bg-[radial-gradient(ellipse_at_85%_50%,#687174_0%,transparent_65%)]" />

      <header className="relative z-20 grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-8 py-6 sm:px-16 lg:px-24 xl:px-32">
        <a href="#home" className="focus-ring col-start-2 row-start-1 justify-self-center whitespace-nowrap rounded-md text-lg font-semibold tracking-tight sm:text-xl">Usman Sarfraz<span className="opacity-50">.</span></a>
        <nav aria-label="Primary" className="col-span-3 col-start-1 row-start-2 flex items-center gap-6 text-sm text-current/70 lg:col-span-1 lg:row-start-1 lg:justify-self-start">
          <a className="focus-ring rounded-md transition-opacity hover:opacity-60" href="#projects">Work</a>
          <span aria-hidden="true" className="h-4 w-px bg-current/20" />
          <a className="focus-ring rounded-md transition-opacity hover:opacity-60" href="#about">About</a>
          <span aria-hidden="true" className="h-4 w-px bg-current/20" />
          <a className="focus-ring rounded-md transition-opacity hover:opacity-60" href="#contact">Contact</a>
        </nav>
        <div className="col-start-3 row-start-1 flex items-center justify-self-end gap-3">
          <NavThemeToggle />
          <a href={`mailto:${profile.email}`} className="focus-ring group hidden items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-all duration-300 hover:bg-[#162022] hover:text-white hover:shadow-lg motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95 motion-reduce:transition-none sm:inline-flex">
            Let&rsquo;s talk
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 motion-reduce:transition-none" />
          </a>
        </div>
      </header>

      <div className="hero-screen__body relative w-full lg:flex lg:min-h-0 lg:flex-1 lg:flex-col px-8 sm:px-20 lg:px-32 xl:px-40 2xl:px-48">
        <div className="hero-screen__content relative grid items-center gap-8 lg:min-h-0 lg:flex-1 lg:grid-cols-[1.08fr_1fr] lg:gap-10">
          <FadeIn className="relative z-10 min-w-0 pt-12 pb-8 sm:pt-16 lg:flex lg:flex-col lg:justify-center lg:py-4">
            <div className="mb-7 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-2 rounded-lg border border-current/20 bg-white/10 px-3 py-2 font-medium">
                <Code2 aria-hidden="true" className="h-4 w-4" />{profile.experience} of experience
              </span>
              <span className="text-current/65">Frontend development &amp; UI design</span>
            </div>
            <h1 id="hero-heading" className={`${headingFont.className} max-w-full [container-type:inline-size] text-[clamp(2.875rem,4.8vw,5.5rem)] font-normal tracking-[-0.025em] leading-[1.18] lg:text-[clamp(2.5rem,min(4.8vw,8svh),5.5rem)]`}>
              <span className="block text-[min(1em,8.7cqw)]">
              <span className="block">Thoughtful <span className="text-emerald-800 dark:text-emerald-300">Design.</span></span>
              <RotatingHeadline />
              <span className="block">Websites that <span className="underline decoration-emerald-700/50 decoration-[0.04em] underline-offset-[0.14em] dark:decoration-emerald-300/60">work.</span></span>
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

          <div className="hero-screen__portrait relative mx-auto h-[440px] w-full self-center sm:h-[540px] lg:h-full lg:min-h-0 lg:max-h-[660px]">
            <Image
              src={portrait}
              alt={`${profile.name}, frontend developer and software engineer`}
              fill
              priority
              unoptimized
              sizes="(min-width: 1024px) 46vw, calc(100vw - 72px)"
              className="object-contain object-center "
            />
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-6 border-t border-current/10 py-7 sm:py-9 lg:shrink-0 lg:flex-row lg:py-5 lg:items-center lg:gap-10">
          <p className="shrink-0 text-base font-medium leading-snug tracking-tight text-black dark:text-white sm:text-lg lg:max-w-[22ch]">Built with a modern stack</p>
          <StackMarquee />
        </div>
      </div>
    </section>
  );
}
