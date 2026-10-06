import { GraduationCap } from "lucide-react";
import styles from "./about-section.module.css";

export function Education() {
  return (
    <aside className={styles.education} aria-labelledby="education-title">
      <h3 id="education-title" className={styles.smallHeading}>Education</h3>
      <div className={styles.educationBody}>
        <GraduationCap size={30} strokeWidth={1.3} className={styles.educationIcon} aria-hidden="true" />
        <p className={styles.educationPeriod}>2019 — 2024</p>
        <h4 className={styles.degree}>Bachelor of Science<br />in Computer Science</h4>
        <p className={styles.school}>Virtual University of Pakistan</p>
        <span className={styles.educationMark} aria-hidden="true">BSCS.</span>
      </div>
    </aside>
  );
}
