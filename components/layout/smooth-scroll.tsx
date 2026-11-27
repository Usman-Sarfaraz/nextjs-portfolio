"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  const pathname = usePathname();

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
      scrollToSection(element as HTMLElement, href);
    }

    function scrollToSection(section: HTMLElement, href: string, immediate = false): void {
      // Land the section's content just below the floating navbar.
      const padding = Math.max(
        parseFloat(getComputedStyle(section).paddingTop) || 0,
        section.firstElementChild ? parseFloat(getComputedStyle(section.firstElementChild).paddingTop) || 0 : 0,
      );
      const clearance = window.innerWidth < 768 ? 88 : 112;
      const scrollMargin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
      if (href === "#home") lenis.scrollTo(0, { immediate });
      else if (section.querySelector("[data-pin-stage]")) lenis.scrollTo(section, { immediate, offset: scrollMargin });
      else lenis.scrollTo(section, { immediate, offset: Math.min(0, padding - clearance) + scrollMargin });
    }

    // Route links land after the new page's fonts and pinned sections have established their layout.
    let cancelled = false;
    let routeFrame = 0;
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      routeFrame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        lenis.resize();
        const href = window.location.hash;
        const section = href ? document.getElementById(decodeURIComponent(href.slice(1))) : null;
        if (section) scrollToSection(section, href, true);
      });
    });

    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(routeFrame);
      document.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}
