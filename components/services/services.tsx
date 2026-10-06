"use client";

import { ArrowUpRight } from "lucide-react";
import ShinyText from "@/components/react-bits/ShinyText";
import { TitleReveal } from "@/components/ui/title-reveal";
import styles from "./services.module.css";

const services = [
  {
    title: "Frontend development",
    description: "Fast, responsive websites and web apps, built with care for every screen and interaction.",
    capabilities: ["Responsive websites", "Interactive web apps", "Performance & accessibility"],
    type: "frontend",
  },
  {
    title: "UI design & development",
    description: "Thoughtful interfaces that bring your ideas to life, from the first layout to the final polished component.",
    capabilities: ["Interface design", "Design systems", "Motion & microinteractions"],
    type: "design",
  },
  {
    title: "Backend development",
    description: "Reliable foundations behind your product, connecting your interface to the data and logic it needs.",
    capabilities: ["APIs & integrations", "Database development", "Authentication & business logic"],
    type: "backend",
  },
] as const;

export function Services() {
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
      <div className={styles.services}>
        {services.map(({ title, description, capabilities, type }) => (
          <article key={type} className={styles.service}>
            <h3 className={styles.title}><ShinyText text={title} speed={2.5} delay={1} color="var(--services-accent)" shineColor="var(--services-shine)" /></h3>
            <div className={styles.content}>
              <p className={styles.description}>{description}</p>
              <ul className={styles.capabilities}>{capabilities.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
      <footer className={styles.footer}>
        <p>Have something in mind? Let’s build it together.</p>
        <a href="#contact" className={styles.cta}>Let’s talk about your project <ArrowUpRight size={18} aria-hidden="true" /></a>
      </footer>
    </section>
  );
}
