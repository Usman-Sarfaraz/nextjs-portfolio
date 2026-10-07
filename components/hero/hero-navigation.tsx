"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { NavThemeToggle } from "@/components/layout/nav";
import { profile } from "@/lib/profile";
import styles from "./hero-navigation.module.css";
import ShinyText from "@/components/react-bits/ShinyText";
import StaggeredMenu from "@/components/react-bits/StaggeredMenu";

const mobileItems = [
  { label: "About", link: "#intro", ariaLabel: "About Usman" },
  { label: "Work", link: "#projects", ariaLabel: "View selected work" },
  { label: "Services", link: "#services", ariaLabel: "Explore services" },
  { label: "Experience", link: "#about", ariaLabel: "View experience and expertise" },
];

export function HeroNavigation() {
  const [expanded, setExpanded] = useState(false);
  const brand = <><ShinyText text="Usman" speed={2.5} delay={1} color="var(--brand-text)" shineColor="var(--brand-shine)" className={styles.brandText ?? ""} /> Sarfraz<span className="opacity-50">.</span></>;

  useEffect(() => {
    const update = () => setExpanded(window.scrollY >= 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={`hero-navigation-anchor ${styles.anchor}`}>
      <div className={`hero-navigation ${styles.navigation}`} data-expanded={expanded}>
        <div className={`hero-navigation__notch ${styles.notch}`} aria-hidden="true">
          <svg className="hero-navigation__corner hero-navigation__corner--left" width="20" height="20" viewBox="0 0 20 20">
            <path d="M0 0H20V20C20 8.954 11.046 0 0 0Z" />
          </svg>
          <svg className="hero-navigation__corner hero-navigation__corner--right" width="20" height="20" viewBox="0 0 20 20">
            <path d="M0 0H20C8.954 0 0 8.954 0 20Z" />
          </svg>
        </div>
        <nav aria-label="Primary" className="hero-navigation__links">
          <a className="focus-ring rounded-md hover:opacity-60" href="#intro">About</a>
          <span aria-hidden="true" className="h-4 w-px bg-current/20" />
          <a className="focus-ring rounded-md hover:opacity-60" href="#projects">Work</a>
          <span aria-hidden="true" className="h-4 w-px bg-current/20" />
          <a className="focus-ring rounded-md hover:opacity-60" href="#services">Services</a>
          <span aria-hidden="true" className="h-4 w-px bg-current/20" />
          <a className="focus-ring rounded-md hover:opacity-60" href="#about">Experience</a>
        </nav>
        <a href="#home" className="hero-navigation__brand focus-ring rounded-md whitespace-nowrap font-semibold tracking-tight">
          {brand}
        </a>
        <div className="hero-navigation__actions">
          <NavThemeToggle />
          <a href={`mailto:${profile.email}`} className="focus-ring group inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-black transition-all duration-300 hover:bg-[#162022] hover:text-white hover:shadow-xl motion-safe:hover:-translate-y-1 motion-safe:active:scale-95 motion-reduce:transition-none sm:px-5 sm:py-3 sm:text-sm">
            Let&rsquo;s talk <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1 motion-reduce:transition-none" />
          </a>
        </div>
        <div className={styles.mobileMenu}>
          <StaggeredMenu items={mobileItems} logo={brand}>
            <a href={`mailto:${profile.email}`} className="focus-ring group inline-flex items-center gap-3 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-all duration-300 hover:bg-[#162022] hover:text-white hover:shadow-xl motion-safe:hover:-translate-y-1 motion-safe:active:scale-95 motion-reduce:transition-none">
              Let&rsquo;s talk <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1 motion-reduce:transition-none" />
            </a>
            <a href={profile.linkedin} className="focus-ring rounded-md text-sm underline underline-offset-4">LinkedIn</a>
            <NavThemeToggle />
          </StaggeredMenu>
        </div>
      </div>
    </header>
  );
}
