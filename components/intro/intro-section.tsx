import { Check, MousePointer2 } from "lucide-react";
import Image from "next/image";
import ScrollReveal from "@/components/react-bits/ScrollReveal";
import portrait from "@/public/images/portfolio_portrait.png";
import styles from "./intro-section.module.css";

// Tiny live interface pieces inside the sentence: each pops in as the spotlight reaches its word.
const MEDIA = {
  I: <span className={`${styles.chip} ${styles.chipPortrait}`}><Image src={portrait} alt="" fill sizes="96px" className={styles.chipImage} /></span>,
  "feels,": <span className={`${styles.chip} ${styles.chipToggle}`}><span className={styles.toggleThumb} /></span>,
  "works.": <span className={`${styles.chip} ${styles.chipCheck}`}><Check strokeWidth={3} /></span>,
  code: <span className={`${styles.chip} ${styles.chipCode}`}>{"</>"}</span>,
  details: <span className={`${styles.chip} ${styles.chipCursor}`}><MousePointer2 strokeWidth={2.2} /></span>,
};

export function IntroSection() {
  return (
    <section id="intro" aria-labelledby="intro-heading" className={styles.section}>
      <div className={styles.inner} data-pin-stage>
        <div className={styles.copy}>
          {/* Kept for screen readers and the section label; the statement carries the section visually. */}
          <h2 id="intro-heading" className="sr-only">Design mindset. Developer’s precision.</h2>
          {/* The section stays pinned while scrolling drives the spotlight; key phrases shine; chips pop in. */}
          <ScrollReveal className={styles.statement ?? ""} baseOpacity={0.16} blurStrength={0} spotlight={36} pinned highlights={["how it feels,", "design and code", "people enjoy using."]} media={MEDIA}>
            {"I believe a great website is more than how it looks. It’s about how it feels, how fast it responds and how clearly it works. I bring design and code together, sweating the small details so every interaction feels intentional. I build interfaces people enjoy using."}
          </ScrollReveal>

        </div>
      </div>
      {/* Scroll distance for the pinned reading; the stage above stays put while this passes. */}
      <div className={styles.scrollSpace} aria-hidden="true" />
    </section>
  );
}
