import ShinyText from "@/components/react-bits/ShinyText";
import { ArrowDownRight } from "lucide-react";
import ScrollReveal from "@/components/react-bits/ScrollReveal";
import { TitleReveal } from "@/components/ui/title-reveal";
import styles from "./intro-section.module.css";

export function IntroSection() {
  return (
    <section id="intro" aria-labelledby="intro-heading" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.aside}>
          <p className={`section-label ${styles.label}`}>A little introduction</p>
          <p className={styles.experience}><span>3+</span>years of building<br />for the web</p>
        </div>
        <div>
          <h2 id="intro-heading" className={styles.heading}><TitleReveal>Design mindset.<br /><em><ShinyText text="Developer’s precision." speed={2.5} delay={1} color="var(--accent)" shineColor="var(--accent-shine)" className="heading-shine" /></em></TitleReveal></h2>
          <ScrollReveal className={styles.statement ?? ""} baseOpacity={0.45} blurStrength={0}>
            {"I’m Usman, a frontend developer who cares about how a website feels as much as how it works. I turn ideas into thoughtful interfaces, with careful attention to the details people notice—and the ones they don’t."}
          </ScrollReveal>
          <a href="#projects" className={styles.workLink}>Explore selected work <ArrowDownRight size={20} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
