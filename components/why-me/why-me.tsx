"use client";

import gsap from "gsap";
import ShinyText from "@/components/react-bits/ShinyText";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { TitleReveal } from "@/components/ui/title-reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { useReducedMotion } from "@/lib/motion";
import styles from "./why-me.module.css";

const principles = [
  { id: "details", tag: "Detail", title: "The details get my attention", description: "The spacing, the loading state, the way a menu feels on a phone. The small decisions that make an interface feel finished.", note: ["Responsive layouts", "Accessibility", "Thoughtful motion"] },
  { id: "communication", tag: "Clarity", title: "You’re part of the process", description: "Decisions explained in plain language, progress you can see, and the right questions asked early.", note: ["Progress updates", "Shared decisions", "Practical feedback"] },
  { id: "connect", tag: "Design ↔ code", title: "One idea, all the way through", description: "From the layout to reusable components to the API behind them, I think through how a design behaves with real data.", note: ["Components", "Real data", "API integration"] },
  { id: "handover", tag: "After launch", title: "Built for what comes next", description: "Organised code and reusable pieces, so the next feature doesn’t need a fresh start and the product is easy to hand over.", note: ["Reusable components", "Organised code", "Easy handover"] },
] as const;

// Each row repeats its phrase enough times to cover a wide screen; the copy is doubled so it can loop seamlessly.
const REPEAT = 4;

export function WhyMe() {
  const list = useRef<HTMLUListElement>(null);
  const reducedMotion = useReducedMotion();

  // Rows drift sideways in alternating directions. Page scroll speeds them up (and reverses them when
  // scrolling up) and skews them with the scroll velocity; a hovered or focused row slows right down.
  useEffect(() => {
    const root = list.current;
    if (!root || reducedMotion) return;
    const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-row]")).map((row, index) => ({
      row,
      track: row.querySelector<HTMLElement>("[data-track]")!,
      dir: index % 2 === 0 ? -1 : 1,
      // Different start points and speeds per row, so the phrases never line up in a grid.
      x: -index * 173,
      base: [58, 70, 52, 64][index] ?? 60,
      slow: 1,
    }));
    let lastY = window.scrollY;
    let velocity = 0;
    let skew = 0;
    let running = false;

    const tick = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 50) / 1000;
      const y = window.scrollY;
      const instant = dt > 0 ? (y - lastY) / dt : 0;
      lastY = y;
      velocity += (instant - velocity) * 0.12;
      skew += (Math.max(-7, Math.min(7, velocity * -0.006)) - skew) * 0.15;
      rows.forEach((item) => {
        const target = item.row.dataset.hover !== undefined ? 0.18 : 1;
        item.slow += (target - item.slow) * 0.08;
        const half = item.track.scrollWidth / 2;
        // Base drift plus a boost from scrolling; scrolling up flips the drift for a moment.
        const speed = (item.base + Math.abs(velocity) * 0.35) * (velocity < -40 ? -1 : 1);
        item.x += item.dir * speed * item.slow * dt;
        if (half > 0) item.x = gsap.utils.wrap(-half, 0, item.x);
        item.track.style.transform = `translate3d(${item.x}px, 0, 0) skewX(${skew * item.slow}deg)`;
      });
    };

    const start = () => { if (!running) { running = true; lastY = window.scrollY; gsap.ticker.add(tick); } };
    const stop = () => { if (running) { running = false; gsap.ticker.remove(tick); } };
    const observer = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? start() : stop()));
    observer.observe(root);
    return () => { observer.disconnect(); stop(); rows.forEach(({ track }) => { track.style.transform = ""; }); };
  }, [reducedMotion]);

  const setHover = (row: HTMLElement, on: boolean) => {
    if (on) row.dataset.hover = ""; else delete row.dataset.hover;
  };

  return (
    <section id="why-me" aria-labelledby="why-me-title" className={styles.section}>
      <div className={styles.inner}>
        <SectionHeader
          id="why-me-title"
          title={<TitleReveal>How I <em><ShinyText text="work." speed={2.5} delay={1} color="var(--accent)" shineColor="var(--accent-shine)" className="heading-shine" /></em></TitleReveal>}
          note={<>Design mindset. Developer&rsquo;s precision.<br />For the product, and the people using it.</>}
        />
      </div>
      <ul ref={list} className={styles.rows}>
        {principles.map((item, index) => (
          <li
            key={item.id}
            data-row
            tabIndex={0}
            aria-labelledby={`why-${item.id}`}
            className={styles.row}
            data-outline={index % 2 === 1 || undefined}
            onMouseEnter={(event) => setHover(event.currentTarget, true)}
            onMouseLeave={(event) => setHover(event.currentTarget, false)}
            onFocus={(event) => setHover(event.currentTarget, true)}
            onBlur={(event) => setHover(event.currentTarget, false)}
          >
            <h3 id={`why-${item.id}`} className="sr-only">{item.title}</h3>
            <div className={styles.marquee} aria-hidden="true">
              <div data-track className={styles.track}>
                {Array.from({ length: REPEAT * 2 }, (_, copy) => (
                  <span key={copy} className={styles.phrase}>{item.title}<span className={styles.sep} /></span>
                ))}
              </div>
            </div>
            <div className={styles.reveal}>
              <div className={styles.revealInner}>
                <div className={styles.detail}>
                  <p className={styles.tag}><span className={styles.tagDot} aria-hidden="true" />{item.tag}</p>
                  <p className={styles.description}>{item.description}</p>
                  <ul className={styles.notes}>{item.note.map((note) => <li key={note}>{note}</li>)}</ul>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.inner}>
        <a href="#about" className={styles.experienceLink}>The experience behind the approach <ArrowUpRight size={18} aria-hidden="true" /></a>
      </div>
    </section>
  );
}
