import ShinyText from "@/components/react-bits/ShinyText";
import { TitleReveal } from "@/components/ui/title-reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { Journey } from "./journey";
import { Stack } from "./stack";
import { Toolkit } from "./toolkit";
import styles from "./about-section.module.css";


export function AboutSection() {
  return (
    <section id="about" aria-labelledby="experience-title" className={styles.section}>
      <SectionHeader
        id="experience-title"
        title={<TitleReveal>Journey <em><ShinyText text="so far." speed={2.5} delay={1} color="var(--accent)" shineColor="var(--accent-shine)" className="heading-shine" /></em></TitleReveal>}
        note={<>The work behind my approach,<br />and the tools I build with.</>}
      />
      <Journey />
      {/* The toolkit: what I use, grouped, beside the playable stack box. */}
      <div className={styles.expertise}>
        <Toolkit />
        <Stack />
      </div>
    </section>
  );
}
