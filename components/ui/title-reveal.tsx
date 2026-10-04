"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion";
import { useSiteRevealed } from "@/components/layout/site-loader";
import { useHeroRevealSequence } from "@/components/hero/hero-reveal-sequence";

export function TitleReveal({ children, completesHeroText = false }: { children: ReactNode; completesHeroText?: boolean }) {
  const reducedMotion = useReducedMotion();
  const revealed = useSiteRevealed();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const { finishText } = useHeroRevealSequence();

  return (
    <motion.span
      ref={ref}
      className="inline-block align-bottom"
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={revealed && inView ? { opacity: 1, y: 0 } : { opacity: 0, y: reducedMotion ? 0 : 20 }}
      onAnimationComplete={() => { if (completesHeroText && revealed && inView) finishText(); }}
      transition={{ duration: reducedMotion ? 0 : 1.05, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  );
}
