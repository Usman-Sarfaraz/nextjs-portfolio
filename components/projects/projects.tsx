"use client";

import ShinyText from "@/components/react-bits/ShinyText";
import { useEffect, useRef, useState } from "react";
import { ProjectPreview, TiltCard } from "./project-preview";
import { ArrowUpRight } from "lucide-react";
import { TitleReveal } from "@/components/ui/title-reveal";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/motion";
import { useSiteRevealed } from "@/components/layout/site-loader";
import styles from "./projects.module.css";

const PROJECTS = [
  { id: "acrylica", name: "Acrylica", category: "Branding & signage", description: "A website showcasing signage, printing, and brand production services.", url: "https://acrylica-zeta.vercel.app/" },
  { id: "bitlogicx", name: "Bitlogicx", category: "Our company · Software & AI", description: "Our company website showcasing custom software development, AI solutions, and digital products.", url: "https://bitlogicx.com/" },
  { id: "ai-export", name: "AI Export", category: "AI consulting", description: "A website introducing AI consulting services, products, and adoption programmes.", url: "https://ai-export.vercel.app/" },
  { id: "psi-algebra", name: "PSI Algebra", category: "Privacy, security & AI", description: "A website presenting privacy, cybersecurity, and AI advisory services.", url: "https://psi-algebra.vercel.app/" },
  { id: "cleovici", name: "Cleovici", category: "Fintech consulting", description: "A website for fintech consulting, financial services, and compliance expertise.", url: "https://cleovici.vercel.app/" },
] as const;

export type ProjectsProps = { withHeadline?: boolean };

export function Projects({ withHeadline = false }: ProjectsProps) {
  const [selected, setSelected] = useState(0);
  const reducedMotion = useReducedMotion();
  const cards = useRef<HTMLDivElement>(null);
  const revealed = useSiteRevealed();


  useEffect(() => {
    if (!revealed) return;
    let frame = 0;
    const update = () => {
      const articles = Array.from(cards.current?.querySelectorAll<HTMLElement>("article") ?? []);
      let current = 0;
      articles.forEach((article, index) => {
        if (article.getBoundingClientRect().top <= window.innerHeight * 0.35) current = index;
      });
      setSelected(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [revealed]);

  return (
    <section className={styles.section} aria-label="Frontend projects">
      {withHeadline && (
        <header className={styles.header}>
          <div className={styles.sectionMeta}><p className={`section-label ${styles.label}`}>01 / Selected work</p><span>Design in the details. Development at the core.</span></div>
          <div className={styles.headingRow}><h2 className={styles.heading}><TitleReveal>A few things<br />I’ve <em><ShinyText text="built." speed={2.5} delay={1} color="var(--accent)" shineColor="var(--accent-shine)" className="heading-shine" /></em></TitleReveal></h2><p className={styles.headingNote}>Real websites. Thoughtful interfaces.<br />Explore the work, then see it in action.</p></div>
        </header>
      )}
      <div className={styles.showcase}>
        <nav aria-label="Project navigation" className={styles.list}>
          {PROJECTS.map((item, index) => (
            <a key={item.id} data-project={item.id} href={`#project-${item.id}`} aria-current={selected === index ? "location" : undefined} className={styles.tab}>
              <span className={styles.tabNumber}>0{index + 1}</span><span>{item.name}</span><ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ))}
        </nav>
        <div ref={cards} className={styles.cards}>
          {PROJECTS.map((project, index) => (
            <motion.article key={project.id} id={`project-${project.id}`} aria-labelledby={`title-${project.id}`} className={styles.panel}
              initial={reducedMotion ? false : { opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <TiltCard>
                <ProjectPreview project={project} />
                <div className={styles.details}>
                  <div><p className={styles.category}><span>0{index + 1}</span> {project.category}</p>
                    <h3 id={`title-${project.id}`} className={styles.name}>{project.name}</h3>
                    <p className={styles.description}>{project.description}</p></div>
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.visit}>
                    Visit website <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              </TiltCard>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
