"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/motion";
import { ArrowUpRight } from "lucide-react";
import ShinyText from "@/components/react-bits/ShinyText";
import { TitleReveal } from "@/components/ui/title-reveal";
import styles from "./services.module.css";

const services = [
  {
    title: "Frontend development",
    lead: "Frontend",
    detail: "development",
    eyebrow: "Websites & web applications",
    description: "Fast, responsive websites and web apps, built with care for every screen and interaction.",
    capabilities: ["Responsive websites", "Interactive web apps", "Performance & accessibility"],
    type: "frontend",
  },
  {
    title: "UI design & development",
    lead: "UI design",
    detail: "& development",
    eyebrow: "Interfaces & interactions",
    description: "Thoughtful interfaces that bring your ideas to life, from the first layout to the final polished component.",
    capabilities: ["Interface design", "Design systems", "Motion & microinteractions"],
    type: "design",
  },
  {
    title: "Backend development",
    lead: "Backend",
    detail: "development",
    eyebrow: "APIs & infrastructure",
    description: "Reliable foundations behind your product, connecting your interface to the data and logic it needs.",
    capabilities: ["APIs & integrations", "Database development", "Authentication & business logic"],
    type: "backend",
  },
] as const;

export function Services() {
  const stack = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = stack.current;
    if (!element || reducedMotion) return;
    const items = Array.from(element.querySelectorAll<HTMLElement>("[data-stack-item]"));
    let frame = 0;
    const update = () => {
      const section = element.closest<HTMLElement>("section");
      const header = section?.querySelector<HTMLElement>("header");
      const pinTop = 100 + (header?.offsetHeight ?? 140) + 16;
      const cards = items.map((item) => item.querySelector<HTMLElement>("article"));
      const tallestCard = Math.max(...cards.map((card) => card?.offsetHeight ?? 0));
      section?.style.setProperty("--stack-card-height", `${tallestCard}px`);
      const enabled = window.innerWidth >= 768 && window.innerHeight > pinTop + tallestCard + 64;
      if (section) {
        section.dataset.stackEnabled = String(enabled);
        section.style.setProperty("--stack-top", `${pinTop}px`);
      }
      const peek = 20;
      const last = items[items.length - 1];
      const release = enabled && last
        ? Math.min(0, last.getBoundingClientRect().top - (pinTop + (items.length - 1) * peek))
        : 0;
      section?.style.setProperty("--header-release", `${release}px`);
      // Use layout offsets rather than sticky bounds: sticky positions stop moving.
      const scroll = pinTop - element.getBoundingClientRect().top;
      const positions = items.map((item) => item.offsetTop);
      items.forEach((item, index) => {
        let depth = 0;
        if (enabled) {
          for (let next = index + 1; next < items.length; next++) {
            const arrival = (positions[next] ?? 0) - next * peek;
            const progress = Math.min(1, Math.max(0, (scroll - arrival + 280) / 280));
            depth += progress;
          }
        }
        item.style.setProperty("--stack-scale", String(1 - depth * .035));
      });
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    const header = element.closest("section")?.querySelector("header");
    if (header) observer.observe(header);
    items.forEach((item) => observer.observe(item));
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      const section = element.closest<HTMLElement>("section");
      section?.removeAttribute("data-stack-enabled");
      section?.style.removeProperty("--stack-top");
      section?.style.removeProperty("--stack-card-height");
      section?.style.removeProperty("--header-release");
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      items.forEach((item) => item.style.removeProperty("--stack-scale"));
    };
  }, [reducedMotion]);

  return (
    <section id="services" aria-labelledby="services-title" className={styles.section}>
      <header className={styles.header}>
        <p className={styles.label}>Services</p>
        <div>
          <h2 id="services-title" className={styles.heading}>
            <TitleReveal><ShinyText text="From idea to experience" speed={2.5} delay={1} color="var(--services-accent)" shineColor="var(--services-shine)" /></TitleReveal>
          </h2>
          <p className={styles.intro}>Design, development, and the details in between. I help bring your next digital product to life.</p>
        </div>
      </header>
      <div ref={stack} className={styles.services}>
        {services.map(({ title, lead, detail, eyebrow, description, capabilities, type }, index) => (
          <div key={type} data-stack-item className={styles.stackItem} style={{ "--stack-index": index } as CSSProperties}>
          <article className={styles.service} aria-labelledby={`service-${type}`}>
            <div className={styles.identity}>
              <p className={styles.eyebrow}>{eyebrow}</p>
              <h3 id={`service-${type}`} className={styles.title}>
                <ShinyText text={lead} className={styles.titleShine ?? ""} speed={2.5} delay={1} color="var(--services-accent)" shineColor="var(--services-shine)" />
                <span className={styles.titleDetail}>{detail}</span>
              </h3>
            </div>
            <div className={styles.content}>
              <p className={styles.description}>{description}</p>
              <ul className={styles.capabilities}>{capabilities.map((item) => <li key={item}>{item}</li>)}</ul>
              <a href="#contact" className={styles.serviceLink} aria-label={`Discuss ${title}`}>
                <span>Let’s build something</span><span className={styles.arrow}><ArrowUpRight size={22} strokeWidth={1.5} aria-hidden="true" /></span>
              </a>
            </div>
          </article>
          </div>
        ))}
      </div>
      <footer className={styles.footer}>
        <p>Have something in mind? Let’s build it together.</p>
        <a href="#contact" className={styles.cta}>Let’s talk about your project <ArrowUpRight size={18} aria-hidden="true" /></a>
      </footer>
    </section>
  );
}
