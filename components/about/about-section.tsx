import ShinyText from "@/components/react-bits/ShinyText";
import { TitleReveal } from "@/components/ui/title-reveal";
import { Education } from "./education";
import { Experience } from "./experience";
import { Skills } from "./skills";
import { Stack } from "./stack";
import styles from "./about-section.module.css";

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="experience-title" className={styles.section}>
      <header className={styles.header}>
        <div><p className={`section-label ${styles.label}`}>04 / Experience & expertise</p><h2 id="experience-title" className={styles.heading}><TitleReveal>Experience,<br />put into <em><ShinyText text="practice." speed={2.5} delay={1} color="var(--accent)" shineColor="var(--accent-shine)" className="heading-shine" /></em></TitleReveal></h2></div>
        <p className={styles.intro}>The work behind my approach, the skills I bring, and the tools I build with.</p>
      </header>
      <div className={styles.history}><Experience /><Education /></div>
      <div className={styles.expertise}><Stack /><Skills /></div>
    </section>
  );
}
