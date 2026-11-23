"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/motion";
import styles from "./layers-section.module.css";

const LAYERS = [
  { word: "Interface", line: "Responsive, accessible screens in React, Next.js, Vue and Nuxt, right down to the last pixel." },
  { word: "Motion", line: "Animation and interaction that guide the eye and make every state feel alive." },
  { word: "Logic", line: "APIs, integrations and the rules behind the screen, wired up cleanly and easy to change." },
  { word: "Performance", line: "Fast loads and smooth scrolling on every device, measured rather than guessed." },
] as const;

// The intro's emerald full stop grows to fill the screen, becomes this section's background, and the
// section pins while each layer of a build lights up in turn.
export function LayersSection() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = root.current;
    if (!section || reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      // Pinned progress picks the lit layer.
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => setActive(Math.min(LAYERS.length - 1, Math.floor(self.progress * LAYERS.length))),
      });

      // While the intro is still pinned, its closing dot grows until it covers the screen. This section already
      // waits underneath the intro's last screen, so the moment the dot covers it, the intro hides and this shows.
      const dot = document.querySelector<HTMLElement>("[data-grow-dot]");
      const growSpace = document.querySelector<HTMLElement>("[data-grow-space]");
      const introStage = document.querySelector<HTMLElement>("#intro [data-pin-stage]");
      if (!dot || !growSpace) return;
      // The cover lives on <body>, above every section's stacking layer (the intro sits above this section).
      const cover = document.createElement("div");
      cover.className = styles.growDot ?? "";
      cover.setAttribute("aria-hidden", "true");
      document.body.appendChild(cover);
      const toBg = gsap.utils.interpolate(getComputedStyle(dot).backgroundColor, "#071a14");
      const easeIn = gsap.parseEase("power2.in");
      const hide = () => { cover.style.visibility = "hidden"; };
      const setIntroVisible = (visible: boolean) => { if (introStage) introStage.style.visibility = visible ? "" : "hidden"; };
      ScrollTrigger.create({
        trigger: growSpace,
        start: "top bottom",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          setIntroVisible(p < 1);
          // Once the circle covers the screen, the section's content enters piece by piece (and resets on the way back).
          if (p >= 1) section.dataset.entered = "true"; else delete section.dataset.entered;
          if (p <= 0 || p >= 1) { hide(); return; }
          // A full-screen layer clipped to a growing circle: the edge is redrawn at every size, so it stays sharp.
          const box = dot.getBoundingClientRect();
          const cx = box.left + box.width / 2;
          const cy = box.top + box.height / 2;
          const start = box.width / 2;
          const reach = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
          Object.assign(cover.style, {
            visibility: "visible",
            clipPath: `circle(${start + (reach - start) * easeIn(p)}px at ${cx}px ${cy}px)`,
            backgroundColor: toBg(Math.min(1, Math.max(0, (p - 0.3) / 0.6))),
          });
        },
        onLeave: () => { hide(); setIntroVisible(false); section.dataset.entered = "true"; },
        onEnterBack: () => setIntroVisible(true),
        onLeaveBack: () => { hide(); setIntroVisible(true); delete section.dataset.entered; },
      });
      return () => { setIntroVisible(true); cover.remove(); };
    }, section);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section ref={root} className={styles.section} aria-labelledby="layers-heading" data-active={active}>
      <div className={styles.stage}>
        <h2 id="layers-heading" className={styles.label}><span className={styles.labelDot} aria-hidden="true" />Under the surface: what goes into every build</h2>
        <div className={styles.body}>
          <ol className={styles.list}>
            {LAYERS.map((layer, index) => (
              <li key={layer.word} className={styles.item} style={{ "--i": index } as CSSProperties} data-on={index === active || undefined} data-last={index === LAYERS.length - 1 || undefined}>
                <span className={styles.word}>{layer.word}<span className={styles.wordDot} aria-hidden="true" /></span>
              </li>
            ))}
          </ol>
          {/* One column for the descriptions, so a long word can never run into its line. */}
          <div className={styles.lines}>
            {LAYERS.map((layer, index) => (
              <p key={layer.word} className={styles.line} data-on={index === active || undefined}>{layer.line}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
