"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion";
import { useSiteRevealed } from "@/components/layout/site-loader";
import { useHeroRevealSequence } from "./hero-reveal-sequence";

export function PortraitReveal({ children, className }: { children: ReactNode; className: string }) {
  const reducedMotion = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const revealed = useSiteRevealed();
  const { textFinished } = useHeroRevealSequence();
  const inView = useInView(root, { once: true, amount: 0.15 });

  const resetCards = (element: HTMLDivElement | null) => {
    element?.querySelectorAll<HTMLElement>('[data-magnetic-card]').forEach((card) => {
      card.style.setProperty("--magnet-x", "0px");
      card.style.setProperty("--magnet-y", "0px");
    });
  };

  useEffect(() => { if (reducedMotion) resetCards(root.current); }, [reducedMotion]);

  const attractCards = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType !== "mouse") return;
    event.currentTarget.querySelectorAll<HTMLElement>('[data-magnetic-card]').forEach((card) => {
      const rect = card.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(Math.max(0, Math.abs(dx) - rect.width / 2), Math.max(0, Math.abs(dy) - rect.height / 2));
      const strength = Math.max(0, 1 - distance / 120) * 0.1;
      card.style.setProperty("--magnet-x", `${Math.max(-12, Math.min(12, dx * strength))}px`);
      card.style.setProperty("--magnet-y", `${Math.max(-10, Math.min(10, dy * strength))}px`);
    });
  };

  return (
    <motion.div
      ref={root}
      className={className}
      onPointerMove={attractCards}
      onPointerLeave={(event) => resetCards(event.currentTarget)}
      initial={reducedMotion ? false : { opacity: 0, y: 0, scale: 1 }}
      animate={revealed && textFinished && inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 0, scale: 1 }}
      transition={{ delay: reducedMotion ? 0 : 0.1, duration: reducedMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
