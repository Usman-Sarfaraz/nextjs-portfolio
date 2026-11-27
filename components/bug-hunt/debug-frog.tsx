"use client";

import gsap from "gsap";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion";
import { useBugHunt } from "./bug-hunt-context";
import styles from "./bug-hunt.module.css";

const BUBBLE_MS = 3200;

function message(found: number, total: number): string {
  if (found === 0) return `${total} bugs are hiding on this page. Spot one and click it.`;
  if (found === total) return `All ${total} bugs fixed. Clean build.`;
  const left = total - found;
  return `${found} of ${total} fixed. ${left} still hiding.`;
}

export function DebugFrog(): ReactNode {
  const { caught, total, catches, reset, registerSnap } = useBugHunt();
  const reduced = useReducedMotion();
  const frogRef = useRef<HTMLButtonElement>(null);
  const artRef = useRef<SVGSVGElement>(null);
  const tongueRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [closedAt, setClosedAt] = useState(0);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const bubbleId = useId();

  const found = caught.size;
  const done = found === total;
  const text = message(found, total);

  useEffect(() => {
    if (reduced) {
      registerSnap(null);
      return;
    }
    registerSnap((target) => {
      const frog = frogRef.current;
      const tongue = tongueRef.current;
      if (!frog || !tongue) return Promise.resolve();

      const box = frog.getBoundingClientRect();
      const mouthX = box.left + box.width * 0.5;
      const mouthY = box.top + box.height * 0.62;
      const dx = target.left + target.width / 2 - mouthX;
      const dy = target.top + target.height / 2 - mouthY;
      const length = Math.hypot(dx, dy);
      setLook({ x: dx / length, y: dy / length });

      gsap.killTweensOf(tongue);
      gsap.set(tongue, { left: mouthX, top: mouthY, width: length, rotation: (Math.atan2(dy, dx) * 180) / Math.PI, scaleX: 0, autoAlpha: 1 });

      return new Promise<void>((resolve) => {
        gsap.to(tongue, {
          scaleX: 1,
          duration: Math.min(0.3, 0.12 + length / 5000),
          ease: "power3.out",
          onComplete: () => {
            resolve();
            gsap.to(tongue, {
              scaleX: 0,
              duration: 0.22,
              ease: "power2.in",
              onComplete: () => {
                gsap.set(tongue, { autoAlpha: 0 });
                setLook({ x: 0, y: 0 });
                if (artRef.current) {
                  gsap.fromTo(artRef.current, { scaleX: 1.1, scaleY: 0.86 }, { scaleX: 1, scaleY: 1, duration: 0.4, ease: "back.out(3)" });
                }
              },
            });
          },
        });
      });
    });
    return () => registerSnap(null);
  }, [reduced, registerSnap]);

  // Each catch opens the bubble on its own; it closes after a moment, except for the final message.
  const autoOpen = catches > 0 && closedAt !== catches;
  const open = pinned || autoOpen;

  useEffect(() => {
    if (!autoOpen || done) return;
    const timer = window.setTimeout(() => setClosedAt(catches), BUBBLE_MS);
    return () => window.clearTimeout(timer);
  }, [autoOpen, catches, done]);

  const close = useCallback(() => {
    setPinned(false);
    setClosedAt(catches);
  }, [catches]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <div className={styles.root}>
      <div ref={tongueRef} className={styles.tongue} aria-hidden="true" />
      <button
        ref={frogRef}
        type="button"
        className={styles.frog}
        aria-label={`Debug the frog. ${found} of ${total} bugs fixed`}
        aria-expanded={open}
        aria-controls={bubbleId}
        onClick={() => (open ? close() : setPinned(true))}
      >
        <svg ref={artRef} className={styles.frogArt} viewBox="0 0 64 56" aria-hidden="true">
          <ellipse cx="32" cy="38" rx="26" ry="17" fill="var(--frog-body)" />
          <circle cx="18" cy="20" r="10" fill="var(--frog-body)" />
          <circle cx="46" cy="20" r="10" fill="var(--frog-body)" />
          <circle cx="18" cy="19" r="6.5" fill="var(--frog-eye)" />
          <circle cx="46" cy="19" r="6.5" fill="var(--frog-eye)" />
          <g className={styles.pupils} style={{ transform: `translate(${look.x * 2.6}px, ${look.y * 2.6}px)` }}>
            <circle cx="18" cy="19" r="3.2" fill="var(--frog-pupil)" />
            <circle cx="46" cy="19" r="3.2" fill="var(--frog-pupil)" />
          </g>
          <ellipse cx="32" cy="45" rx="15" ry="7.5" fill="var(--frog-belly)" />
          <path d="M22 33q10 6 20 0" stroke="var(--frog-pupil)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </svg>
        {found > 0 && (
          <span className={styles.count} aria-hidden="true">
            {found}/{total}
          </span>
        )}
      </button>
      <div id={bubbleId} className={styles.bubble} hidden={!open}>
        <p>{text}</p>
        {done && (
          <div className={styles.actions}>
            <a className={styles.primary} href="#contact" onClick={close}>
              Let&rsquo;s talk
            </a>
            <button type="button" className={styles.secondary} onClick={reset}>
              Hide them again
            </button>
          </div>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {catches > 0 ? text : ""}
      </p>
    </div>
  );
}
