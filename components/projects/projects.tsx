"use client";

import { useEffect, useRef, useState } from "react";
import { ProjectPreview, TiltCard } from "./project-preview";
import { ArrowUpRight } from "lucide-react";
import { TitleReveal } from "@/components/ui/title-reveal";
import ShinyText from "@/components/react-bits/ShinyText";
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
  const cards = useRef<HTMLDivElement>(null);
  const revealed = useSiteRevealed();
  const navigation = useRef<HTMLElement>(null);


  useEffect(() => {
    if (!revealed) return;
    let frame = 0;
    const update = () => {
      const articles = Array.from(cards.current?.querySelectorAll<HTMLElement>("article") ?? []);
      let current = 0;
      articles.forEach((article, index) => {
        if (article.getBoundingClientRect().top <= window.innerHeight * 0.35) current = index;
      });
      const threshold = window.innerHeight * 0.35;
      articles.forEach((article, index) => {
        const bounds = article.getBoundingClientRect();
        const next = articles[index + 1]?.getBoundingClientRect();
        const span = next ? next.top - bounds.top : bounds.height;
        const progress = Math.min(1, Math.max(0, (threshold - bounds.top) / Math.max(1, span)));
        navigation.current?.querySelector<HTMLElement>(`[data-project="${PROJECTS[index]?.id}"]`)
          ?.style.setProperty("--project-progress", String(progress));
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
          <p className={styles.label}><span className={styles.labelText}>Work</span></p>
          <h2 className={styles.heading}><TitleReveal><ShinyText text="Recent frontend projects" className={styles.headingShine ?? ""} speed={2.5} delay={1} color="var(--work-heading-color)" shineColor="var(--work-heading-shine)" /></TitleReveal></h2>
        </header>
      )}
      <div className={styles.showcase}>
        <nav ref={navigation} aria-label="Project navigation" className={styles.list}>
          {PROJECTS.map((item, index) => (
            <a key={item.id} data-project={item.id} href={`#project-${item.id}`} aria-current={selected === index ? "location" : undefined} className={styles.tab}>
              <ShinyText text={item.name} disabled={selected !== index} speed={2.5} delay={1} color={selected === index ? "var(--work-heading-color)" : "inherit"} shineColor="var(--work-heading-shine)" /><ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ))}
        </nav>
        <div ref={cards} className={styles.cards}>
          {PROJECTS.map((project) => (
            <article key={project.id} id={`project-${project.id}`} aria-labelledby={`title-${project.id}`} className={styles.panel}>
              <TiltCard>
                <ProjectPreview project={project} />
                <div className={styles.details}>
                  <div><p className={styles.category}>{project.category} <span>· Frontend development</span></p>
                    <h3 id={`title-${project.id}`} className={styles.name}><ShinyText text={project.name} speed={2.5} delay={1} color="var(--work-heading-color)" shineColor="var(--work-heading-shine)" /></h3>
                    <p className={styles.description}>{project.description}</p></div>
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.visit}>
                    Visit website <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              </TiltCard>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
