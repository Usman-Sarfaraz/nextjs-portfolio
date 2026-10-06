"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";
import ShinyText from "@/components/react-bits/ShinyText";
import { TitleReveal } from "@/components/ui/title-reveal";
import { useReducedMotion } from "@/lib/motion";
import styles from "./why-me.module.css";

const principles = [
  { id: "details", title: "The details get my attention.", summary: "Care you can see. Quality you can feel.", description: "The spacing, the loading state, the way a menu feels on a phone. I care about the small decisions that make an interface feel finished, alongside the bigger decisions that make it work.", note: "Responsive layouts · Accessibility · Thoughtful motion" },
  { id: "communication", title: "You’re part of the process.", summary: "Clear conversations, from start to finish.", description: "I explain decisions in plain language, share progress, and ask the questions that matter early. You know what’s being built, why it’s being built that way, and where your feedback fits.", note: "Progress updates · Shared decisions · Practical feedback" },
  { id: "ownership", title: "I connect design with development.", summary: "One consistent idea, all the way through.", description: "I work across interface design, reusable components, and API integration. That means I can think through how a design behaves with real data and turn it into an experience people can actually use.", note: "UI design · Frontend engineering · API integration" },
  { id: "handover", title: "Built for what comes next.", summary: "A solid foundation beyond the launch.", description: "I keep components reusable and code organized, so the next feature doesn’t need a fresh start. The aim is a product that’s straightforward to maintain, improve, and hand over.", note: "Reusable components · Organized code · Maintainability" },
] as const;

export function WhyMe() {
  const [active, setActive] = useState<string | null>("details");
  const reducedMotion = useReducedMotion();

  return (
    <section id="why-me" aria-labelledby="why-me-title" className={styles.section}>
      <div className={styles.layout}>
        <motion.div className={styles.manifesto} initial={reducedMotion ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .8 }}>
          <span className={styles.watermark} aria-hidden="true">US.</span>
          <p className={styles.statement}>Good work<br />starts with<br /><span>care.</span></p>
          <p className={styles.manifestoCopy}>For the product. For the people using it.<br />And for the people I’m building it with.</p>
          <div className={styles.signature}><span className={styles.monogram} aria-hidden="true">us.</span><div><span>Usman Sarfraz</span><span>Design mindset. Developer’s precision.</span></div></div>
        </motion.div>
        <div className={styles.principles}>
      <header className={styles.header}>
        <p className={styles.label}>Why me</p>
        <h2 id="why-me-title" className={styles.heading}><TitleReveal><ShinyText text="Why work with me" speed={2.5} delay={1} color="var(--why-accent)" shineColor="var(--why-shine)" /></TitleReveal></h2>
      </header>

          {principles.map((item, index) => {
            const expanded = active === item.id;
            return (
              <motion.article key={item.id} className={styles.principle} data-expanded={expanded} initial={reducedMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .6, delay: reducedMotion ? 0 : index * .06 }}>
                <h3 className={styles.principleTitle}><button type="button" aria-expanded={expanded} aria-controls={`why-${item.id}`} onClick={() => setActive(expanded ? null : item.id)} className={styles.trigger}><span>{item.title}</span><span className={styles.toggle}><Plus size={18} strokeWidth={1.5} aria-hidden="true" /></span></button></h3>
                <p className={styles.summary}>{item.summary}</p>
                <div id={`why-${item.id}`} className={styles.reveal} inert={!expanded} aria-hidden={!expanded}><div className={styles.revealInner}><p className={styles.description}>{item.description}</p><p className={styles.note}>{item.note}</p></div></div>
              </motion.article>
            );
          })}
          <a href="#about" className={styles.experienceLink}>The experience behind the approach <ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
