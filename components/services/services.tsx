"use client";

import gsap from "gsap";

import ShinyText from "@/components/react-bits/ShinyText";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { SELECT_SERVICE_EVENT } from "@/lib/contact";
import { useReducedMotion } from "@/lib/motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { TitleReveal } from "@/components/ui/title-reveal";
import { SectionHeader } from "@/components/ui/section-header";
import styles from "./services.module.css";

// A small looping picture for each service, drawn in CSS so it costs nothing to load.
// Bar heights for the mini dashboard, as a share of the chart height.
const BARS = [38, 52, 44, 66, 58, 74, 62, 81, 70, 88, 79, 94];

function FrontendVisual() {
  return (
    <div className={styles.dash} aria-hidden="true">
      <div className={styles.dashKpis}>
        <p className={styles.kpi}><span>Deliveries</span><b>1,284</b><em>+12%</em></p>
        <p className={styles.kpi}><span>On time</span><b>98.2%</b><em>+3.1%</em></p>
        <p className={styles.kpi}><span>Live fleet</span><b>312</b><em className={styles.kpiLive}>live</em></p>
      </div>
      <div className={styles.dashChart}>
        {BARS.map((height, index) => <i key={index} style={{ "--h": `${height}%`, "--i": index } as CSSProperties} />)}
        <svg viewBox="0 0 120 60" preserveAspectRatio="none">
          <path className={styles.dashLine} pathLength={1} d="M0 46 L11 40 L22 43 L33 31 L44 35 L55 24 L66 29 L77 17 L88 22 L99 11 L110 15 L120 6" />
        </svg>
      </div>
    </div>
  );
}

const CURVE = "M8 92 C 62.6 92, 37.4 8, 92 8";
const MORPH_STATES = [
  { name: "button", w: 116, h: 40, r: 20 },
  { name: "toggle", w: 60, h: 30, r: 15 },
  { name: "card", w: 140, h: 96, r: 14 },
] as const;

// UI & motion: the graph and the component share one clock. As the dot runs along the easing curve,
// the element on the right morphs to its next state at exactly that pace: button, toggle, card, and round again.
function DesignVisual() {
  const root = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = root.current;
    if (!el || reducedMotion) return;
    const q = <T extends Element>(name: string) => el.querySelector<T>(`[data-${name}]`)!;
    const morph = q<HTMLElement>("morph");
    const dot = q<SVGGElement>("dot");
    const playhead = q<SVGLineElement>("playhead");
    const readout = q<HTMLElement>("readout");
    const caption = q<HTMLElement>("caption");
    const knob = q<HTMLElement>("knob");
    const layers = [q<HTMLElement>("label"), knob, q<HTMLElement>("card")];
    const ease = gsap.parseEase("power2.inOut"); // power2.inOut is cubic-bezier(.65, 0, .35, 1)
    const lerp = (a: number, b: number, e: number) => a + (b - a) * e;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    const render = (from: number, to: number, t: number) => {
      const e = ease(t);
      const x = 8 + 84 * t;
      const y = 92 - 84 * e;
      dot.setAttribute("transform", `translate(${x} ${y})`);
      playhead.setAttribute("x1", String(x));
      playhead.setAttribute("x2", String(x));
      readout.textContent = `${String(Math.round(e * 100)).padStart(2, "0")}%`;
      const A = MORPH_STATES[from]!;
      const B = MORPH_STATES[to]!;
      Object.assign(morph.style, { width: `${lerp(A.w, B.w, e)}px`, height: `${lerp(A.h, B.h, e)}px`, borderRadius: `${lerp(A.r, B.r, e)}px` });
      // The old content fades out in the first half and the new one fades in over the second, so a frame is never empty.
      layers.forEach((layer, index) => {
        layer.style.opacity = index === from ? String(clamp(1 - e * 1.8)) : index === to ? String(clamp((e - 0.35) / 0.55)) : "0";
      });
    };

    const timeline = gsap.timeline({ repeat: -1, paused: true });
    MORPH_STATES.forEach((_, from) => {
      const to = (from + 1) % MORPH_STATES.length;
      const clock = { t: 0 };
      timeline
        .call(() => { caption.textContent = `${MORPH_STATES[from]!.name} \u2192 ${MORPH_STATES[to]!.name}`; gsap.set(dot, { opacity: 1 }); })
        .fromTo(clock, { t: 0 }, { t: 1, duration: 1.2, ease: "none", onUpdate: () => render(from, to, clock.t) })
        .call(() => { caption.textContent = MORPH_STATES[to]!.name; });
      // Resting on the toggle, the knob flips across.
      if (MORPH_STATES[to]!.name === "toggle") timeline.fromTo(knob, { x: -13 }, { x: 13, duration: 0.5, ease: "power2.inOut" }, "+=0.15");
      timeline.to(dot, { opacity: 0, duration: 0.25 }, "+=0.7");
    });
    render(0, 0, 0);

    // Only animate while it is on screen.
    const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) timeline.play(); else timeline.pause(); });
    observer.observe(el);
    return () => { observer.disconnect(); timeline.kill(); };
  }, [reducedMotion]);

  return (
    <div ref={root} className={styles.designStage} aria-hidden="true">
      <div className={styles.graph}>
        <p className={styles.graphHead}><span>ease-in-out</span><span data-readout>00%</span></p>
        <svg viewBox="0 0 100 100" className={styles.graphSvg}>
          <path className={styles.graphAxis} d="M8 4 L8 92 L96 92" />
          <path className={styles.curveGuide} d="M8 92 L92 8" />
          <path className={styles.curvePath} d={CURVE} />
          <line data-playhead className={styles.playhead} x1="8" x2="8" y1="8" y2="92" />
          <g data-dot transform={reducedMotion ? "translate(92 8)" : "translate(8 92)"}>
            <circle className={styles.curveHalo} r="7" />
            <circle className={styles.curveDot} r="3.5" />
          </g>
        </svg>
        <p className={styles.graphFoot}><span>time</span><span>.65, 0, .35, 1</span></p>
      </div>
      <div className={styles.morphStage}>
        <div data-morph className={styles.morph}>
          <span data-label className={styles.morphLabel}>Get started</span>
          <span data-knob className={styles.morphKnob} />
          <span data-card className={styles.morphCard}><i /><i /><i /></span>
        </div>
        <p data-caption className={styles.morphCaption}>{reducedMotion ? "card" : "button"}</p>
      </div>
    </div>
  );
}

// Backend: a request travels from the interface to the API to the database, and the response comes back.
function BackendVisual() {
  return (
    <div className={styles.flow} aria-hidden="true">
      <div className={styles.flowRow}>
        <span className={styles.flowNode}>Client</span>
        <span className={styles.flowNode}>API</span>
        <span className={styles.flowNode}>Postgres</span>
        <span className={styles.flowTrack}><i className={styles.flowPacket} /></span>
      </div>
      <ul className={styles.flowLog}>
        <li><span>&rarr; GET</span> /api/deliveries</li>
        <li><em>&nbsp;&nbsp;SELECT * FROM deliveries</em></li>
        <li><b>&larr; 200 OK</b> <em>42ms</em></li>
      </ul>
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
  // Hover opens a panel only after a short pause, so sweeping the mouse across doesn't open each one.
  const hoverTimer = useRef(0);
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);
  const hoverOpen = (index: number) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setActive(index), 140);
  };
  const hoverCancel = () => window.clearTimeout(hoverTimer.current);

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
            <li key={type} className={styles.panel} data-open={isOpen || undefined} onMouseEnter={() => hoverOpen(index)} onMouseLeave={hoverCancel}>
              <h3 id={`service-${type}`} className={styles.panelHead}>
                <button type="button" className={styles.panelButton} onClick={() => setActive(index)} onFocus={() => setActive(index)} aria-expanded={isOpen} aria-controls={`service-body-${type}`}>
                  <span className={styles.closedTitle} aria-hidden="true">{lead}</span>
                  <span className={styles.panelTitle}><span className={styles.titleLead}>{lead}</span> <span className={styles.titleDetail}>{detail}</span></span>
                  <span className={styles.panelIcon} aria-hidden="true"><Plus size={20} strokeWidth={1.5} /></span>
                </button>
              </h3>
              <div id={`service-body-${type}`} className={styles.panelBody} inert={!isOpen}>
                <div className={styles.panelInner}>
                <div className={styles.panelGrid}>
                <div className={styles.panelCopy}>
                  <p className={styles.description}>{description}</p>
                  <ul className={styles.capabilities}>{capabilities.map((item) => <li key={item}>{item}</li>)}</ul>
                  <a href="#contact" className={styles.serviceLink} aria-label={`Discuss ${title}`} onClick={() => window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: title }))}>
                    Let&rsquo;s build something <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                </div>
                <div className={styles.visual}>{visual}</div>
                </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
