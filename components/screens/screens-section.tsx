"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState } from "react";
import ShinyText from "@/components/react-bits/ShinyText";
import { ReflowPage } from "./reflow-page";
import styles from "./screens-section.module.css";

type Layout = "desktop" | "tablet" | "phone";

// The two key words share the emerald shine used on the other section headings.
const Shiny = ({ text }: { text: string }) => (
  <ShinyText text={text} speed={2.5} delay={1} color="var(--accent)" shineColor="var(--accent-shine)" className="heading-shine" />
);

const MAX_W = 1440;
const MIN_W = 390;
const PRESETS: { layout: Layout; label: string; width: number }[] = [
  { layout: "desktop", label: "Desktop", width: MAX_W },
  { layout: "tablet", label: "Tablet", width: 768 },
  { layout: "phone", label: "Phone", width: MIN_W },
];

// The breakpoints the wireframe reflows at, in the virtual px of a 1440-wide page.
const layoutFor = (width: number): Layout => (width >= 1024 ? "desktop" : width >= 640 ? "tablet" : "phone");

// Scroll progress → window width. The first and last stretch hold still, so the page reads before and after.
const HOLD = 0.12;
const widthAt = (progress: number) => MAX_W - (MAX_W - MIN_W) * gsap.utils.clamp(0, 1, (progress - HOLD) / (1 - 2 * HOLD));
const progressFor = (width: number) => HOLD + ((MAX_W - width) / (MAX_W - MIN_W)) * (1 - 2 * HOLD);

// One product, every screen: a window narrows from desktop to phone width between the two halves of the
// headline, and the page inside reflows at each breakpoint. On wide screens scrolling drives it; on phones,
// with reduced motion, or without scripting, the three buttons switch widths instead.
export function ScreensSection() {
  const root = useRef<HTMLElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [layout, setLayout] = useState<Layout>("desktop");

  // Written straight to CSS variables: clip-path and transforms follow without a React render per frame.
  const applyWidth = useCallback((width: number) => {
    const section = root.current;
    if (!section) return;
    section.style.setProperty("--w", width.toFixed(1));
    if (readout.current) readout.current.textContent = `${Math.round(width)}px`;
    setLayout(layoutFor(width));
  }, []);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    // On a phone, start at phone width: the visitor is already looking at one.
    mm.add("(max-width: 767px)", () => applyWidth(MIN_W));
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      section.dataset.mode = "scroll";
      ScrollTrigger.refresh();
      trigger.current = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => applyWidth(widthAt(self.progress)),
        onRefresh: (self) => applyWidth(widthAt(self.progress)),
      });
      return () => {
        trigger.current = null;
        delete section.dataset.mode;
        applyWidth(MAX_W);
      };
    });
    return () => mm.revert();
  }, [applyWidth]);

  const choose = (width: number) => {
    const st = trigger.current;
    // While scrolling drives the window, a button scrolls to the point where it is that wide.
    if (st) window.scrollTo({ top: st.start + (st.end - st.start) * progressFor(width), behavior: "smooth" });
    else applyWidth(width);
  };

  return (
    <section ref={root} className={styles.section} aria-labelledby="screens-title" data-preset={layout}>
      <div className={styles.stage}>
        <h2 id="screens-title" className={styles.title}>
          <span className={`${styles.word} ${styles.wordStart}`}>One <Shiny text="product" /></span>
          <span className={styles.frame} aria-hidden="true">
            <span className={styles.edge} />
            {/* Keyed by layout so phones replay the fade-in on each preset (the animation only exists on phones). */}
            <span key={layout} className={styles.window}><ReflowPage layout={layout} /></span>
            <span ref={readout} className={styles.readout}>{MAX_W}px</span>
          </span>
          <span className={`${styles.word} ${styles.wordEnd}`}>every <span className={styles.nowrap}><Shiny text="screen" /><span className={styles.dot} /></span></span>
        </h2>
        <div className={styles.foot}>
          <p className={styles.note}>The same page at any width: the menu folds, the hero stacks and the projects drop to one column.</p>
          <div className={styles.controls} role="group" aria-label="Preview width">
            {PRESETS.map((preset) => (
              <button key={preset.layout} type="button" className={styles.control} aria-pressed={layout === preset.layout} onClick={() => choose(preset.width)}>
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
