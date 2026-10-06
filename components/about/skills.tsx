import { Braces, PanelsTopLeft, Workflow } from "lucide-react";
import ShinyText from "@/components/react-bits/ShinyText";
import { TitleReveal } from "@/components/ui/title-reveal";
import styles from "./about-section.module.css";

const CAPABILITIES = [
  { title: "Build the interface", icon: PanelsTopLeft, items: ["Responsive UI", "UI design & implementation", "Animation & interaction"] },
  { title: "Engineer the experience", icon: Braces, items: ["React & Next.js", "Vue & Nuxt", "JavaScript & TypeScript", "Internationalization & RTL"] },
  { title: "Connect the product", icon: Workflow, items: ["REST APIs", "Real-time dashboards", "Role-based interfaces", "Full-stack integration"] },
];

export function Skills() {
  return (
    <div className={styles.skills}>
      <h3 className={styles.smallHeading}><TitleReveal>What I do</TitleReveal></h3>
      <div className={styles.skillsBody}>
        <p className={styles.skillsIntro}>Thoughtful UI. <ShinyText text="Solid engineering." speed={2.5} delay={1} color="var(--experience-accent)" shineColor="var(--experience-shine)" /></p>
        <div className={styles.capabilityList}>
          {CAPABILITIES.map(({ title, icon: Icon, items }) => (
            <div key={title} className={styles.capability}>
              <span className={styles.capabilityIcon}><Icon size={20} strokeWidth={1.4} aria-hidden="true" /></span>
              <div><h4 className={styles.capabilityTitle}>{title}</h4><ul className={styles.capabilityItems}>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
