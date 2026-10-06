import { ArrowUpRight } from "lucide-react";
import styles from "./about-section.module.css";

export function Experience() {
  return (
    <div className={styles.experience}>
      <h3 className={styles.smallHeading}>Experience</h3>
      <article className={styles.role}>
        <div className={styles.timeline}>
          <span className={styles.current}><span className={styles.statusDot} />Current role</span>
          <div className={styles.dateStamp}><span>Aug</span><strong>2024</strong></div>
          <span className={styles.dateConnector} aria-hidden="true" />
          <span className={styles.datePresent}>Present</span>
        </div>
        <div className={styles.roleContent}>
          <a href="https://bitlogicx.com/" target="_blank" rel="noopener noreferrer" className={styles.company}>Bitlogicx <ArrowUpRight size={20} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
          <h4 className={styles.roleTitle}>Frontend Developer</h4>
          <p className={styles.location}>Lahore, Pakistan</p>
          <ul className={styles.contributions}>
            <li>Led frontend development for web applications, working with designers and backend engineers.</li>
            <li>Built reusable Vue and Nuxt components, role-based interfaces, and analytics dashboards.</li>
            <li>Integrated REST APIs and Socket.io, with bilingual English/Arabic interfaces and RTL support.</li>
          </ul>
          <p className={styles.roleTools}>Vue · Nuxt · REST APIs · Socket.io</p>
        </div>
      </article>
    </div>
  );
}
