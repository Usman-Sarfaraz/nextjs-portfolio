import ScrollReveal from "@/components/react-bits/ScrollReveal";
import styles from "./intro-section.module.css";

export function IntroSection() {
  return (
    <section id="intro" aria-labelledby="intro-label" className={styles.section}>
      <div className={styles.inner}>
        <h2 id="intro-label" className={styles.label}>
          <span className={styles.tag}>Intro</span>
        </h2>
        <ScrollReveal className={styles.statement ?? ""} highlights={["frontend developer", "easier to use"]}>
          {"I’m Usman, a frontend developer with 3+ years of experience. I build websites and web apps, and I like figuring out the details that make them easier to use. I enjoy taking a design from the first idea to a website people can actually use. Here’s a look at some of my recent work."}
        </ScrollReveal>
      </div>
    </section>
  );
}
