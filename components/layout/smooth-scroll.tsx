"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { features } from "@/lib/config";

const LENIS_OPTIONS = {
  duration: 1.6,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
};

export function SmoothScroll({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  useEffect(() => {
    if (!features.smoothScroll) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis(LENIS_OPTIONS);

    let rafId: number;
    function raf(time: number): void {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    function handleAnchorClick(e: MouseEvent): void {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const element = document.querySelector(href);
      if (!element) return;

      e.preventDefault();
      window.history.pushState(null, "", href);
      // Land the section's content (not its padding) just under the floating navbar.
      // Sections carry their own top padding, so subtract it from the navbar clearance.
      const section = element as HTMLElement;
      const padding = Math.max(
        parseFloat(getComputedStyle(section).paddingTop) || 0,
        section.firstElementChild ? parseFloat(getComputedStyle(section.firstElementChild).paddingTop) || 0 : 0,
      );
      const clearance = window.innerWidth < 768 ? 88 : 112;
      // Lenis also honours the section's scroll-margin-top (kept for no-JS anchor jumps), so cancel it out here.
      const scrollMargin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
      if (href === "#home") lenis.scrollTo(0);
      // A pinned full-screen stage centres its own content, so it should simply fill the screen.
      else if (section.querySelector("[data-pin-stage]")) lenis.scrollTo(section, { offset: scrollMargin });
      else lenis.scrollTo(section, { offset: Math.min(0, padding - clearance) + scrollMargin });
    }

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
