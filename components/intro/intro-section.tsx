import { ArrowDownRight } from "lucide-react";
import ScrollReveal from "@/components/react-bits/ScrollReveal";
import styles from "./intro-section.module.css";

export function IntroSection() {
  return (
    <section id="intro" aria-labelledby="intro-heading" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          {/* Kept for screen readers and the section label; the statement carries the section visually. */}
          <h2 id="intro-heading" className="sr-only">Design mindset. Developer’s precision.</h2>
          {/* A moving spotlight: words light up as you scroll and fade back behind you; key phrases shine. */}
          <ScrollReveal className={styles.statement ?? ""} baseOpacity={0.16} blurStrength={0} spotlight={14} highlights={["how it feels,", "design and code", "people enjoy using."]}>
            {"I believe a great website is more than how it looks. It’s about how it feels, how fast it responds and how clearly it works. I bring design and code together, sweating the small details so every interaction feels intentional. I build interfaces people enjoy using."}
          </ScrollReveal>

          <a href="#projects" className={styles.workLink}>Explore selected work <ArrowDownRight size={20} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
