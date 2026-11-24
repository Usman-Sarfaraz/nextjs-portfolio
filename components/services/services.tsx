"use client";

import ShinyText from "@/components/react-bits/ShinyText";
import { useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { TitleReveal } from "@/components/ui/title-reveal";
import { SectionHeader } from "@/components/ui/section-header";
import styles from "./services.module.css";

// A small looping picture for each service, drawn in CSS so it costs nothing to load.
function FrontendVisual() {
  return (
    <div className={styles.visualBrowser} aria-hidden="true">
      <span className={styles.visualBar}><i /><i /><i /></span>
      <span className={styles.visualHero} />
      <span className={styles.visualLine} style={{ "--w": "62%" } as CSSProperties} />
      <span className={styles.visualLine} style={{ "--w": "44%" } as CSSProperties} />
      <span className={styles.visualCards}><i /><i /><i /></span>
    </div>
  );
}

function DesignVisual() {
  const reducedMotion = useReducedMotion();
  const curve = "M10 90 C 90 90, 110 10, 190 10";
  return (
    <div className={styles.visualCurve} aria-hidden="true">
      <svg viewBox="0 0 200 100">
        <path className={styles.curveGuide} d="M10 90 L190 10" />
        <path className={styles.curvePath} d={curve} />
        <circle className={styles.curveHalo} r="9" cx={reducedMotion ? 190 : 0} cy={reducedMotion ? 10 : 0}>
          {!reducedMotion && <animateMotion dur="2.4s" repeatCount="indefinite" path={curve} keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="spline" keySplines=".65 0 .35 1;.65 0 .35 1" />}
        </circle>
        <circle className={styles.curveDot} r="5" cx={reducedMotion ? 190 : 0} cy={reducedMotion ? 10 : 0}>
          {!reducedMotion && <animateMotion dur="2.4s" repeatCount="indefinite" path={curve} keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="spline" keySplines=".65 0 .35 1;.65 0 .35 1" />}
        </circle>
      </svg>
      <span className={styles.curveLabel}>cubic-bezier(.65, 0, .35, 1)</span>
    </div>
  );
}

function BackendVisual() {
  return (
    <div className={styles.visualTerminal} aria-hidden="true">
      <p><span>GET</span> /api/projects <b>200</b> <em>12ms</em></p>
      <p><span>POST</span> /api/contact <b>201</b> <em>48ms</em></p>
      <p><span>GET</span> /api/auth/session <b>200</b> <em>9ms</em></p>
      <p className={styles.terminalCursor}>&gt;</p>
    </div>
  );
}

const services = [
  {
    title: "Frontend development",
    lead: "Frontend",
    detail: "development",
    description: "Landing pages, company websites, dashboards and web apps, including dashboards for logistics and transport teams, built to load fast and feel smooth on every screen.",
    capabilities: ["Landing pages & company sites", "Dashboards & web apps", "Next.js · Nuxt · Tailwind"],
    type: "frontend",
    visual: <FrontendVisual />,
  },
  {
    title: "UI & motion engineering",
    lead: "UI & motion",
    detail: "engineering",
    description: "Designs and ideas turned straight into clean, reusable components, then brought to life with transitions that feel natural.",
    capabilities: ["Design to code", "shadcn/ui · HeroUI · Nuxt UI", "GSAP · Framer Motion"],
    type: "design",
    visual: <DesignVisual />,
  },
  {
    title: "Backend development",
    lead: "Backend",
    detail: "development",
    description: "The backend your interface needs: REST APIs, sign-in, admin panels and contact forms that actually send.",
    capabilities: ["Node.js · AdonisJS · Supabase", "PostgreSQL · MongoDB", "Auth & admin panels"],
    type: "backend",
    visual: <BackendVisual />,
  },
] satisfies { title: string; lead: string; detail: string; description: string; capabilities: string[]; type: string; visual: ReactNode }[];

// Desktop: three panels side by side; hovering, focusing or clicking one widens it to show the details.
// Below 1024px every panel is open and they stack.
export function Services() {
  const [active, setActive] = useState(0);

  return (
    <section id="services" aria-labelledby="services-title" className={styles.section}>
      <SectionHeader
        id="services-title"
        title={<TitleReveal>What I <em><ShinyText text="do." speed={2.5} delay={1} color="var(--accent)" shineColor="var(--accent-shine)" className="heading-shine" /></em></TitleReveal>}
        note={<>From first idea to the final detail.<br />Design, development and everything in between.</>}
      />
      <ul className={styles.panels}>
        {services.map(({ title, lead, detail, description, capabilities, type, visual }, index) => {
          const isOpen = index === active;
          return (
            <li key={type} className={styles.panel} data-open={isOpen || undefined} onMouseEnter={() => setActive(index)}>
              <h3 id={`service-${type}`} className={styles.panelHead}>
                <button type="button" className={styles.panelButton} onClick={() => setActive(index)} onFocus={() => setActive(index)} aria-expanded={isOpen} aria-controls={`service-body-${type}`}>
                  <span className={styles.panelTitle}><span className={styles.titleLead}>{lead}</span> <span className={styles.titleDetail}>{detail}</span></span>
                  <span className={styles.panelIcon} aria-hidden="true"><Plus size={20} strokeWidth={1.5} /></span>
                </button>
              </h3>
              <div id={`service-body-${type}`} className={styles.panelBody}>
                <div className={styles.panelCopy}>
                  <p className={styles.description}>{description}</p>
                  <ul className={styles.capabilities}>{capabilities.map((item) => <li key={item}>{item}</li>)}</ul>
                  <a href="#contact" className={styles.serviceLink} aria-label={`Discuss ${title}`}>
                    Let&rsquo;s build something <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                </div>
                <div className={styles.visual}>{visual}</div>
              </div>
            </li>
          );
        })}
      </ul>
      <footer className={styles.footer}>
        <p>Have something in mind? Let&rsquo;s build it together.</p>
        <a href="#contact" className={styles.cta}>Let&rsquo;s talk about your project <ArrowUpRight size={18} aria-hidden="true" /></a>
      </footer>
    </section>
  );
}
