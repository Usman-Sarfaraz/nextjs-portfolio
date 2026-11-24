"use client";

import gsap from "gsap";
import { useEffect, useRef, type CSSProperties } from "react";
import { TitleReveal } from "@/components/ui/title-reveal";
import { useReducedMotion } from "@/lib/motion";
import styles from "./about-section.module.css";

// Same solid colours as the pills in the Stack box next to it.
const TOOL_GROUPS = [
  { name: "Interface", tools: [["React", "#1FB6CB"], ["Next.js", "#1f1f1f"], ["Vue", "#23875d"], ["Nuxt", "#008b65"], ["TypeScript", "#2F74C0"]] },
  { name: "Styling & UI", tools: [["Tailwind CSS", "#087da3"], ["shadcn/ui", "#27272a"], ["Nuxt UI", "#007f5f"]] },
  { name: "Motion", tools: [["GSAP", "#366800"], ["Framer Motion", "#673ac2"], ["Lenis", "#b4234f"]] },
  { name: "Backend", tools: [["AdonisJS", "#5a42cc"], ["Supabase", "#1f7a52"], ["MySQL", "#296782"], ["PostgreSQL", "#336791"]] },
] as const;

// Mirrors the Stack card: same heading style, same height, mirrored corners.
// When it scrolls in, each row's rule draws across and its badges drop in and settle, one after another,
// as if the tools were being laid out on the table next to the Stack box.
export function Toolkit() {
  const card = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = card.current;
    if (!element) return;
    let doneTimer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      element.dataset.in = "";
      // After the entrance cascade, hand the badges' transforms over to GSAP.
      doneTimer = window.setTimeout(() => { element.dataset.done = ""; }, 2200);
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => { observer.disconnect(); window.clearTimeout(doneTimer); };
  }, []);

  // Pull a badge and it stretches towards your pointer like elastic; let go and it springs back into place.
  // A light hover gives it a little squash-and-stretch wobble.
  useEffect(() => {
    const element = card.current;
    if (!element || reducedMotion) return;
    const badgeOf = (target: EventTarget | null) => (target instanceof Element ? target.closest<HTMLElement>("li[data-badge]") : null);
    let active: { el: HTMLElement; x: number; y: number; id: number } | null = null;

    const wobble = (event: PointerEvent) => {
      const el = badgeOf(event.target);
      if (!el || active || element.dataset.done === undefined || event.pointerType !== "mouse") return;
      if (!(event.relatedTarget instanceof Node) || !el.contains(event.relatedTarget)) {
        gsap.fromTo(el, { scaleX: 1.12, scaleY: .88 }, { scaleX: 1, scaleY: 1, duration: .8, ease: "elastic.out(1.1, .35)", overwrite: "auto" });
      }
    };
    const down = (event: PointerEvent) => {
      const el = badgeOf(event.target);
      if (!el || element.dataset.done === undefined) return;
      event.preventDefault();
      try { el.setPointerCapture(event.pointerId); } catch { /* capture is a bonus; window listeners cover release */ }
      active = { el, x: event.clientX, y: event.clientY, id: event.pointerId };
      gsap.killTweensOf(el);
      el.style.zIndex = "2";
    };
    const move = (event: PointerEvent) => {
      if (!active || event.pointerId !== active.id) return;
      const dx = event.clientX - active.x;
      const dy = event.clientY - active.y;
      const distance = Math.hypot(dx, dy);
      // Pulled too far, the band snaps: the badge lets go on its own and springs home.
      if (distance > 240) { release(); return; }
      // The further you pull, the more it resists, and it stretches along the pull while thinning across it.
      const pull = 1 - Math.exp(-distance / 140);
      const stretch = 1 + pull * .55;
      gsap.set(active.el, {
        x: dx * (.45 - pull * .2),
        y: dy * (.45 - pull * .2),
        rotation: dx * .04,
        scaleX: 1 + (Math.abs(dx) / (distance || 1)) * (stretch - 1),
        scaleY: 1 + (Math.abs(dy) / (distance || 1)) * (stretch - 1) - pull * .12,
      });
    };
    const release = () => {
      if (!active) return;
      const el = active.el;
      if (el.hasPointerCapture(active.id)) el.releasePointerCapture(active.id);
      active = null;
      gsap.to(el, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, duration: 1.2, ease: "elastic.out(1.2, .3)", onComplete: () => { el.style.zIndex = ""; } });
    };
    const up = (event: PointerEvent) => { if (active && event.pointerId === active.id) release(); };

    // Move and release are watched on the window, so dragging outside the card (or the browser) never strands a badge.
    element.addEventListener("pointerover", wobble);
    element.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    element.addEventListener("lostpointercapture", up);
    window.addEventListener("blur", release);
    return () => {
      element.removeEventListener("pointerover", wobble);
      element.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      element.removeEventListener("lostpointercapture", up);
      window.removeEventListener("blur", release);
    };
  }, [reducedMotion]);

  let order = 0;
  return (
    <div className={styles.toolkit}>
      <h3 className={styles.stackHeading}><TitleReveal>Toolkit</TitleReveal></h3>
      <div ref={card} className={styles.toolkitCard}>
        <p className={styles.toolkitIntro}>What I reach for every day, from the first component to the API behind it. Go on, throw them around.</p>
        <dl className={styles.toolGroups}>
          {TOOL_GROUPS.map((group, row) => (
            <div key={group.name} className={styles.toolGroup} style={{ "--row": row } as CSSProperties}>
              <dt>{group.name}</dt>
              <dd>
                <ul className={styles.toolChips}>
                  {group.tools.map(([tool, color]) => (
                    <li key={tool} data-badge style={{ "--tool": color, "--n": order++ } as CSSProperties}>{tool}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
