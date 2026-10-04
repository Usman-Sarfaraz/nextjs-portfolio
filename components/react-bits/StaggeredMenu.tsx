"use client";

// Adapted for the portfolio from https://reactbits.dev/components/staggered-menu.
import { gsap } from "gsap";
import { createPortal } from "react-dom";
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { useReducedMotion } from "@/lib/motion";
import styles from "./StaggeredMenu.module.css";

export interface StaggeredMenuItem {
  label: string;
  link: string;
  ariaLabel: string;
}

export default function StaggeredMenu({ items, logo, children }: {
  items: StaggeredMenuItem[];
  logo: ReactNode;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const menuIcon = useRef<HTMLSpanElement>(null);
  const menuText = useRef<HTMLSpanElement>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const closing = useRef(false);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    animation.current?.kill();
    const finish = () => {
      closing.current = false;
      setOpen(false);
      trigger.current?.focus();
    };
    if (reducedMotion || !overlay.current) finish();
    else {
      animation.current = gsap.timeline({ onComplete: finish }).to(
        overlay.current.querySelectorAll('[data-menu-layer], [data-menu-panel]'),
        { xPercent: 100, duration: 0.32, ease: "power3.in", overwrite: "auto" },
      );
      animation.current.to(menuIcon.current, { rotate: 0, duration: 0.35, ease: "power3.inOut" }, 0);
      animation.current.to(menuText.current, { yPercent: 0, duration: 0.35, ease: "power4.out" }, 0);
    }
  };
  const closeRef = useRef(close);
  useLayoutEffect(() => { closeRef.current = close; });

  useLayoutEffect(() => {
    if (!open || !overlay.current) return;
    const context = gsap.context(() => {
      const layers = overlay.current!.querySelectorAll('[data-menu-layer]');
      const labels = overlay.current!.querySelectorAll('[data-menu-label]');
      const numbers = overlay.current!.querySelectorAll('[data-menu-number]');
      const footer = overlay.current!.querySelectorAll('[data-menu-footer] > *');
      // Clear the CSS translate before GSAP applies its percentage translation.
      gsap.set([...layers, panel.current], { x: 0, xPercent: 100 });
      const timing = (seconds: number) => reducedMotion ? 0 : seconds;
      const panelStart = timing((layers.length - 1) * 0.07 + 0.08);
      const itemsStart = panelStart + timing(0.65 * 0.15);
      const footerStart = panelStart + timing(0.65 * 0.4 + 0.04);
      gsap.set(labels, { yPercent: 140, rotate: 10 });
      gsap.set(numbers, { opacity: 0 });
      gsap.set(footer, { y: 25, opacity: 0 });
      const timeline = gsap.timeline();
      layers.forEach((layer, index) => {
        timeline.fromTo(layer, { xPercent: 100 }, { xPercent: 0, duration: timing(0.5), ease: "power4.out" }, timing(index * 0.07));
      });
      timeline
        .fromTo(panel.current, { xPercent: 100 }, { xPercent: 0, duration: timing(0.65), ease: "power4.out" }, panelStart)
        .to(labels, { yPercent: 0, rotate: 0, duration: timing(1), stagger: timing(0.1), ease: "power4.out" }, itemsStart)
        .to(numbers, { opacity: 1, duration: timing(0.6), stagger: timing(0.08), ease: "power2.out" }, itemsStart + timing(0.1))
        .to(footer, { y: 0, opacity: 1, duration: timing(0.55), stagger: timing(0.08), ease: "power3.out" }, footerStart)
        .fromTo(menuIcon.current, { rotate: 0 }, { rotate: 225, duration: timing(0.8), ease: "power4.out" }, 0)
        .fromTo(menuText.current, { yPercent: 0 }, { yPercent: -80, duration: timing(0.85), ease: "power4.out" }, 0);
      animation.current = timeline;
    }, overlay);
    return () => { animation.current?.kill(); context.revert(); };
  }, [open, reducedMotion]);

  useEffect(() => {
    if (!open) return;
    const triggerElement = trigger.current;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const background = document.querySelector('#main-content')?.parentElement;
    const navigation = background?.querySelector<HTMLElement>('.hero-navigation-anchor');
    const previousVisibility = navigation?.style.visibility ?? "";
    if (navigation) navigation.style.visibility = "hidden";
    const wasInert = background?.inert ?? false;
    if (background) background.inert = true;
    overlay.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key !== "Tab" || !overlay.current) return;
      const elements = Array.from(overlay.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      const first = elements[0];
      const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const handleResize = () => { if (window.innerWidth >= 1024) closeRef.current(); };
    document.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleResize);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      if (background) background.inert = wasInert;
      if (navigation) navigation.style.visibility = previousVisibility;
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleResize);
      triggerElement?.focus();
    };
  }, [open]);

  return (
    <>
      <button ref={trigger} className={`${styles.toggle} focus-ring`} type="button" aria-expanded={open} aria-controls={id} aria-haspopup="dialog" onClick={() => setOpen(true)}>
        Menu <Plus aria-hidden="true" size={20} />
      </button>
      {open && createPortal(
        <div ref={overlay} className={styles.overlay} data-lenis-prevent="true" role="dialog" aria-modal="true" aria-label="Navigation menu" onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
          <div data-menu-layer className={`${styles.layer} ${styles.layerFirst}`} aria-hidden="true" />
          <div data-menu-layer className={`${styles.layer} ${styles.layerSecond}`} aria-hidden="true" />
            <div className={styles.header}>
              <a href="#home" className="focus-ring rounded-md font-semibold tracking-tight" onClick={close}>{logo}</a>
              <button className={`${styles.toggle} focus-ring`} type="button" aria-label="Close menu" onClick={close}>
                <span className={styles.textWrap} aria-hidden="true"><span ref={menuText} className={styles.textInner}>{["Menu", "Close", "Menu", "Close", "Close"].map((text, index) => <span key={index}>{text}</span>)}</span></span>
                <span ref={menuIcon} aria-hidden="true"><Plus size={20} /></span>
              </button>
            </div>
          <div ref={panel} id={id} data-menu-panel className={styles.panel}>
            <nav aria-label="Mobile navigation" className={styles.links}>
              {items.map((item, index) => (
                <a key={item.link} href={item.link} aria-label={item.ariaLabel} className={`${styles.item} focus-ring`} onClick={close}>
                  <span data-menu-label>{item.label}</span><sup data-menu-number>{String(index + 1).padStart(2, "0")}</sup>
                </a>
              ))}
            </nav>
            <div data-menu-footer className={styles.footer}>{children}</div>
          </div>
        </div>, document.body,
      )}
    </>
  );
}
