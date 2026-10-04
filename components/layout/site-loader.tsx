"use client";

import gsap from "gsap";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./site-loader.module.css";

const SiteRevealedContext = createContext(true);
export function useSiteRevealed() { return useContext(SiteRevealedContext); }

export function SiteLoader({ children }: { children: ReactNode }) {
  const overlay = useRef<HTMLDivElement>(null);
  const number = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;
    let completeLoad: () => void;
    const loaded = new Promise<void>((resolve) => {
      completeLoad = () => resolve();
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", completeLoad, { once: true });
    });
    // Keep the introduction bounded even if a third-party resource never finishes.
    const assets = Promise.race([
      Promise.all([loaded, document.fonts.ready]),
      new Promise<void>((resolve) => { timeout = setTimeout(resolve, 2800); }),
    ]);
    const progress = { value: 0 };
    const update = () => {
      if (number.current) number.current.textContent = String(Math.round(progress.value));
      gsap.set(fill.current, { scaleX: progress.value / 100 });
    };
    const context = gsap.context(() => {
      const intro = gsap.timeline();
      intro.to(progress, {
        value: 90,
        duration: reducedMotion ? 0 : 1.8,
        ease: "power2.out",
        onUpdate: update,
      });
      intro.call(() => {
        void assets.then(() => {
          if (cancelled) return;
          context.add(() => {
            gsap.timeline()
              .to(progress, { value: 100, duration: reducedMotion ? 0 : 0.4, ease: "power1.inOut", onUpdate: update })
              .to({}, { duration: reducedMotion ? 0 : 0.25 })
              .call(() => setReady(true))
              .to(overlay.current, reducedMotion
                ? { opacity: 0, duration: 0.15 }
                : { yPercent: -100, duration: 1.05, ease: "power4.inOut" })
              .call(() => {
                root.style.overflow = previousOverflow;
                setFinished(true);
              });
          });
        });
      });
    }, overlay);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      window.removeEventListener("load", completeLoad!);
      context.revert();
      root.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <>
      {!finished && (
        <div ref={overlay} className={styles.loader} data-site-loader data-lenis-prevent role="status" aria-label="Loading portfolio">
          <div className={styles.header} aria-hidden="true">
            <div ref={fill} className={styles.fill} />
            <span className={styles.name}>Usman Sarfraz.</span>
            <span className={styles.discipline}>Frontend development · UI design</span>
          </div>
          <div className={styles.counter} aria-hidden="true">
            <span ref={number}>0</span><span className={styles.percent}>%</span>
          </div>
        </div>
      )}
      <SiteRevealedContext.Provider value={finished}>
        <div data-site-content hidden={!ready} inert={!finished} className={styles.content}>{children}</div>
      </SiteRevealedContext.Provider>
      <noscript><style>{"[data-site-loader]{display:none!important}[data-site-content]{display:contents!important}"}</style></noscript>
    </>
  );
}
