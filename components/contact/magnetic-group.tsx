"use client";

import gsap from "gsap";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion";

// Each link inside leans towards the cursor like it's magnetised, with its icon following a little further
// (a touch of parallax), then springs back with an elastic bounce when the cursor leaves.
export function MagneticGroup({ className, children }: { className?: string | undefined; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = root.current;
    if (!element || reducedMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const links = Array.from(element.querySelectorAll<HTMLElement>("a"));
    const cleanups = links.map((link) => {
      const icon = link.querySelector<HTMLElement | SVGElement>("svg, img");
      const move = (event: PointerEvent) => {
        const box = link.getBoundingClientRect();
        const dx = event.clientX - (box.left + box.width / 2);
        const dy = event.clientY - (box.top + box.height / 2);
        gsap.to(link, { x: dx * 0.35, y: dy * 0.35, duration: 0.4, ease: "power3.out", overwrite: "auto" });
        if (icon) gsap.to(icon, { x: dx * 0.18, y: dy * 0.18, duration: 0.4, ease: "power3.out", overwrite: "auto" });
      };
      const leave = () => {
        gsap.to(link, { x: 0, y: 0, duration: 1, ease: "elastic.out(1.1, .35)", overwrite: "auto" });
        if (icon) gsap.to(icon, { x: 0, y: 0, duration: 1, ease: "elastic.out(1.1, .35)", overwrite: "auto" });
      };
      link.addEventListener("pointermove", move);
      link.addEventListener("pointerleave", leave);
      return () => { link.removeEventListener("pointermove", move); link.removeEventListener("pointerleave", leave); gsap.set([link, icon].filter(Boolean), { clearProps: "transform" }); };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [reducedMotion]);

  return <div ref={root} className={className}>{children}</div>;
}
