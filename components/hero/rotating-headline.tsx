"use client";

import RotatingText from "@/components/react-bits/RotatingText";
import { useReducedMotion } from "@/lib/motion";

const texts = ["Thinking", "Components", "Coding", "Development"];

export function RotatingHeadline() {
  const reducedMotion = useReducedMotion();
  return (
    <span className="hero-rotating-line my-[0.1em] flex flex-nowrap items-center gap-[0.2em] whitespace-nowrap">
      <span className="shrink-0">Creative</span>
      <span className="sr-only">Thinking</span>
      <span aria-hidden="true" className="inline-flex shrink-0 items-center overflow-hidden rounded-[0.16em] bg-emerald-800 px-[0.22em] py-[0.08em] text-white dark:bg-emerald-300 dark:text-[#162022]">
        {reducedMotion ? (
          <span>Thinking</span>
        ) : (
          <RotatingText
            texts={texts}
            rotationInterval={2800}
            splitBy="characters"
            staggerDuration={0.018}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            mainClassName="hero-rotating-text"
            splitLevelClassName="overflow-hidden"
          />
        )}
      </span>
    </span>
  );
}
