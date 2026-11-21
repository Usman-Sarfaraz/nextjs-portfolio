"use client";

import gsap from "gsap";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { profile } from "@/lib/profile";
import styles from "./site-loader.module.css";

const SiteRevealedContext = createContext(true);
export function useSiteRevealed() { return useContext(SiteRevealedContext); }

// Ends on Urdu "Salaam", a greeting from home.
const GREETINGS = [
  { text: "Hello", lang: "en" },
  { text: "你好", lang: "zh" },
  { text: "Hola", lang: "es" },
  { text: "مرحبا", lang: "ar", dir: "rtl" },
  { text: "Bonjour", lang: "fr" },
  { text: "Olá", lang: "pt" },
  { text: "سلام", lang: "ur", dir: "rtl" },
] as const;

export function SiteLoader({ children }: { children: ReactNode }) {
  const overlay = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const [finished, setFinished] = useState(false);
  // Flips partway through the iris so the hero starts animating while the circle is still opening.
  const [revealed, setRevealed] = useState(false);

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
      new Promise<void>((resolve) => { timeout = setTimeout(resolve, 2000); }),
    ]);

    let frame = 0;

    const context = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>("[data-greeting]");
      const intro = gsap.timeline({ paused: true });
      // Start after the first paint so the site's initial layout, behind the opaque sheet, never stalls the greetings.
      frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => intro.play()); });

      if (reducedMotion) {
        gsap.set(words.slice(0, 1), { autoAlpha: 1 });
      } else {
        intro.fromTo("[data-meta]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0);
        // "Hello" eases in and lingers; the rest snap past like a quick hello around the world.
        intro.fromTo(words.slice(0, 1),
          { autoAlpha: 0, yPercent: 30, filter: "blur(8px)" },
          { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", duration: 0.45, ease: "expo.out" }, 0.05);
        let at = 0.05 + 0.45 + 0.3;
        for (let index = 1; index < words.length; index += 1) {
          intro.set(words.slice(index - 1, index), { autoAlpha: 0 }, at);
          intro.fromTo(words.slice(index, index + 1), { autoAlpha: 0, yPercent: 18 }, { autoAlpha: 1, yPercent: 0, duration: 0.12, ease: "expo.out" }, at);
          at += 0.13;
        }
        intro.to({}, { duration: 0.15 }, at);
      }

      intro.call(() => {
        void assets.then(() => {
          if (cancelled) return;
          context.add(() => {
            const done = () => {
              root.style.overflow = previousOverflow;
              setRevealed(true);
              setFinished(true);
            };
            if (reducedMotion) {
              gsap.to(overlay.current, { autoAlpha: 0, duration: 0.2, onComplete: done });
              return;
            }
            gsap.timeline({ onComplete: done })
              .to("[data-stage]", { scale: 0.9, autoAlpha: 0, filter: "blur(8px)", duration: 0.35, ease: "power2.in" }, 0)
              .to("[data-meta]", { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0)
              // Iris: a hole opens from the centre of the sheet until the site fills the screen.
              .to(sheet.current, { "--iris": "80vmax", duration: 1.35, ease: "power3.inOut" }, 0.1)
              .call(() => setRevealed(true), [], 0.7);
          });
        });
      });
    }, overlay);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
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
          <div ref={sheet} className={styles.sheet} aria-hidden="true">
            <div className={styles.stage} data-stage>
              {GREETINGS.map((greeting) => (
                <span
                  key={greeting.lang}
                  className={styles.greeting}
                  lang={greeting.lang}
                  dir={"dir" in greeting ? greeting.dir : undefined}
                  data-greeting
                >
                  {greeting.text}
                </span>
              ))}
            </div>
            <div className={styles.meta} data-meta>
              <span>{profile.name}</span>
              <span>{profile.location}</span>
            </div>
          </div>
        </div>
      )}
      <SiteRevealedContext.Provider value={revealed}>
        <div data-site-content inert={!finished} className={styles.content}>{children}</div>
      </SiteRevealedContext.Provider>
      <noscript><style>{"[data-site-loader]{display:none!important}[data-site-content]{display:contents!important}"}</style></noscript>
    </>
  );
}
