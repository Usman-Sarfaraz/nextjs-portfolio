import type { CSSProperties } from "react";
import ShinyText from "@/components/react-bits/ShinyText";
import { TitleReveal } from "@/components/ui/title-reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { Journey } from "./journey";
import { Stack } from "./stack";
import styles from "./about-section.module.css";

// Same solid colours as the pills in the Stack box next to it.
const TOOL_GROUPS = [
  { name: "Interface", tools: [["React", "#1FB6CB"], ["Next.js", "#1f1f1f"], ["Vue", "#23875d"], ["Nuxt", "#008b65"], ["TypeScript", "#2F74C0"]] },
  { name: "Styling & UI", tools: [["Tailwind CSS", "#087da3"], ["shadcn/ui", "#27272a"], ["Nuxt UI", "#007f5f"]] },
  { name: "Motion", tools: [["GSAP", "#366800"], ["Framer Motion", "#673ac2"], ["Lenis", "#b4234f"]] },
  { name: "Backend", tools: [["AdonisJS", "#5a42cc"], ["Supabase", "#1f7a52"], ["MySQL", "#296782"], ["PostgreSQL", "#336791"]] },
] as const;

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
        {/* Mirrors the Stack card: same heading style, same height, mirrored corners. */}
        <div className={styles.toolkit}>
          <h3 className={styles.stackHeading}><TitleReveal>Toolkit</TitleReveal></h3>
          <div className={styles.toolkitCard}>
            <p className={styles.toolkitIntro}>What I reach for every day, from the first component to the API behind it. Go on, throw them around.</p>
            <dl className={styles.toolGroups}>
              {TOOL_GROUPS.map((group) => (
                <div key={group.name} className={styles.toolGroup}>
                  <dt>{group.name}</dt>
                  <dd>
                    <ul className={styles.toolChips}>
                      {group.tools.map(([tool, color]) => (
                        <li key={tool} style={{ "--tool": color } as CSSProperties}>{tool}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <Stack />
      </div>
    </section>
  );
}
