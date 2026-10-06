import { Check } from "lucide-react";
import { TitleReveal } from "@/components/ui/title-reveal";
import styles from "./about-section.module.css";

const SKILLS = [
  "React & Next.js", "Vue & Nuxt", "JavaScript & TypeScript",
  "Responsive UI development", "UI design & implementation", "REST API integration",
  "Real-time dashboards", "Role-based interfaces", "Internationalization & RTL",
  "Animation & interaction", "Full-stack integration",
];

export function Skills() {
  return (
    <div className={styles.skills}>
      <h3 className={styles.smallHeading}><TitleReveal>What I do</TitleReveal></h3>
      <div className={styles.skillsBody}><p className={styles.skillsIntro}>Interfaces that look considered.<br /><span>Engineering that holds up.</span></p>
        <ul className={styles.skillList}>{SKILLS.map((skill) => <li key={skill}><Check size={13} strokeWidth={1.5} aria-hidden="true" />{skill}</li>)}</ul>
      </div>
    </div>
  );
}
