"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ShinyText from "@/components/react-bits/ShinyText";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import { ProjectPreview } from "./project-preview";
import { ArrowUpRight } from "lucide-react";
import { TitleReveal } from "@/components/ui/title-reveal";
import { useReducedMotion } from "@/lib/motion";
import styles from "./projects.module.css";

const PROJECTS = [
  { id: "acrylica", name: "Acrylica", category: "Branding & signage", description: "A website showcasing signage, printing, and brand production services.", url: "https://acrylica-zeta.vercel.app/" },
  { id: "bitlogicx", name: "Bitlogicx", category: "Our company · Software & AI", description: "Our company website showcasing custom software development, AI solutions, and digital products.", url: "https://bitlogicx.com/" },
  { id: "ai-export", name: "AI Export", category: "AI consulting", description: "A website introducing AI consulting services, products, and adoption programmes.", url: "https://ai-export.vercel.app/" },
  { id: "psi-algebra", name: "PSI Algebra", category: "Privacy, security & AI", description: "A website presenting privacy, cybersecurity, and AI advisory services.", url: "https://psi-algebra.vercel.app/" },
  { id: "cleovici", name: "Cleovici", category: "Fintech consulting", description: "A website for fintech consulting, financial services, and compliance expertise.", url: "https://cleovici.vercel.app/" },
] as const;

// The gallery pins and slides only where there is room for it; elsewhere CSS shows a list.
const PIN_QUERY = "(min-width: 768px) and (min-height: 560px)";
const HEADING_GAP = 120;

export type ProjectsProps = { withHeadline?: boolean };

export function Projects({ withHeadline = false }: ProjectsProps) {
  const reducedMotion = useReducedMotion();
  const rail = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const dots = useRef<HTMLSpanElement>(null);
  // Bumped after a resize settles, so the fit check below runs again at the new size.
  const [size, setSize] = useState(0);

  useEffect(() => {
    let timer = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const onResize = () => {
      // Ignore the small height changes from mobile browser bars.
      if (window.innerWidth === width && Math.abs(window.innerHeight - height) < 120) return;
      width = window.innerWidth;
      height = window.innerHeight;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setSize((value) => value + 1), 250);
    };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); window.clearTimeout(timer); };
  }, []);

  // Desktop and tablet: the rail pins and vertical scrolling slides the gallery sideways.
  // Phones and reduced motion keep a plain vertical list (CSS handles that layout).
  useEffect(() => {
    const railEl = rail.current;
    const trackEl = track.current;
    if (!railEl || !trackEl || reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add(PIN_QUERY, () => {
      // If a card and its text can't fit between the navbar and the dots, show the grid instead of pinning.
      const stage = getComputedStyle(trackEl.parentElement!);
      const room = window.innerHeight - parseFloat(stage.paddingTop) - parseFloat(stage.paddingBottom);
      if (trackEl.offsetHeight > room) {
        railEl.dataset.list = "";
        return () => { delete railEl.dataset.list; };
      }
      const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);
      const measure = () => {
        railEl.style.height = `${window.innerHeight + distance()}px`;
        // On tall screens the centred cards would leave a big gap under the heading, so the rail
        // tucks up under it: the cards always start HEADING_GAP below the heading's rule.
        railEl.style.marginTop = "0px";
        const cardTop = trackEl.getBoundingClientRect().top - railEl.getBoundingClientRect().top;
        railEl.style.marginTop = `${-Math.max(0, cardTop - HEADING_GAP)}px`;
      };
      measure();
      gsap.to(trackEl, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: railEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefreshInit: measure,
          onUpdate: (self) => {
            // One dot per project: the dot for the project on screen stretches into a pill.
            const active = Math.min(PROJECTS.length - 1, Math.floor(self.progress * PROJECTS.length));
            dots.current?.querySelectorAll<HTMLElement>("[data-dot]").forEach((dot, index) => {
              if (index === active) dot.dataset.on = ""; else delete dot.dataset.on;
            });
          },
        },
      });
      return () => { railEl.style.height = ""; railEl.style.marginTop = ""; };
    });
    return () => mm.revert();
  }, [reducedMotion, size]);

  // Keyboard users: focusing a link in an off-screen panel scrolls the page to that panel.
  const bringIntoView = (event: FocusEvent<HTMLElement>) => {
    const railEl = rail.current;
    const trackEl = track.current;
    if (!railEl || !trackEl || !window.matchMedia(PIN_QUERY).matches || reducedMotion || "list" in railEl.dataset) return;
    const stage = trackEl.parentElement;
    if (stage) stage.scrollLeft = 0;
    const panel = event.currentTarget;
    const distance = Math.max(1, trackEl.scrollWidth - window.innerWidth);
    const target = Math.min(1, Math.max(0, (panel.offsetLeft - (window.innerWidth - panel.offsetWidth) / 2) / distance));
    window.scrollTo({ top: railEl.getBoundingClientRect().top + window.scrollY + target * distance, behavior: "auto" });
  };

  return (
    <section className={styles.section} aria-label="Frontend projects">
      {withHeadline && (
        <header className={styles.header}>
          <div className={styles.headingRow}>
            <h2 className={styles.heading}><TitleReveal>Shipped <em><ShinyText text="work." speed={2.5} delay={1} color="var(--accent)" shineColor="var(--accent-shine)" className="heading-shine" /></em></TitleReveal></h2>
            <div className={styles.headingAside}>
              <p className={styles.count}><span>{String(PROJECTS.length).padStart(2, "0")}</span> live projects</p>
              <p className={styles.headingNote}>Real websites. Thoughtful interfaces.<br />Explore the work, then see it in action.</p>
            </div>
          </div>
        </header>
      )}
      <div ref={rail} className={styles.rail}>
        <div className={styles.stage}>
          <div ref={track} className={styles.track}>
            {PROJECTS.map((project) => (
              <article key={project.id} id={`project-${project.id}`} aria-labelledby={`title-${project.id}`} className={styles.panel} onFocusCapture={bringIntoView}>
                <ProjectPreview project={project} />
                <div className={styles.meta}>
                  <div>
                    <p className={styles.category}>{project.category}</p>
                    <h3 id={`title-${project.id}`} className={styles.name}>{project.name}</h3>
                    <p className={styles.description}>{project.description}</p>
                  </div>
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.visit}>
                    Visit website <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              </article>
            ))}
            {/* The gallery ends on an invitation rather than just stopping. */}
            <div className={styles.endPanel} onFocusCapture={bringIntoView}>
              <p className={styles.endTitle}>Your project could be <em><ShinyText text="next" speed={2.5} delay={1} color="var(--accent)" shineColor="var(--accent-shine)" className="heading-shine" /></em><span className={styles.endDot} aria-hidden="true" /></p>
              <a href="#contact" className={styles.endLink}>Start a project <ArrowUpRight size={20} aria-hidden="true" /></a>
            </div>
          </div>
          <span ref={dots} className={styles.progress} aria-hidden="true">
            {PROJECTS.map((project, index) => <span key={project.id} className={styles.dot} data-dot data-on={index === 0 ? "" : undefined} />)}
          </span>
        </div>
      </div>
    </section>
  );
}
