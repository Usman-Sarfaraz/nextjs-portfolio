"use client";

import { motion } from "motion/react";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion";

export function PortraitReveal({ children, className }: { children: ReactNode; className: string }) {
  const reducedMotion = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);

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
      initial={reducedMotion ? false : { opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reducedMotion ? 0 : 1.2, delay: reducedMotion ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
