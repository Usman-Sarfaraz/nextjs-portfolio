"use client";

// Adapted from React Bits' Scroll Reveal, with scoped cleanup and reduced motion.
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/motion";
import { useSiteRevealed } from "@/components/layout/site-loader";
import ShinyText from "./ShinyText";

type ScrollRevealProps = {
  children: string;
  className?: string;
  baseOpacity?: number;
  blurStrength?: number;
  highlights?: string[];
  /** When set, only this many words are lit at once: words light up as you scroll, then fade back behind the reader. */
  spotlight?: number;
};

export default function ScrollReveal({ children, className, baseOpacity = 0.2, blurStrength = 2, highlights = [], spotlight }: ScrollRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();
  const revealed = useSiteRevealed();
  const highlightedRanges = highlights.map((phrase) => {
    const start = children.indexOf(phrase);
    return { start, end: start + phrase.length };
  }).filter(({ start }) => start >= 0);

  useEffect(() => {
    if (!revealed || reducedMotion || !ref.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const words = ref.current!.querySelectorAll("[data-reveal-word]");
      gsap.set(words, { opacity: baseOpacity, filter: `blur(${blurStrength}px)` });
      if (spotlight) {
        const timeline = gsap.timeline({
          defaults: { ease: "none", duration: 1 },
          scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 40%", scrub: 0.5, invalidateOnRefresh: true },
        });
        words.forEach((word, index) => {
          timeline.to(word, { opacity: 1, filter: "blur(0px)" }, index);
          // The final phrase stays lit once the reader reaches the end.
          if (index + spotlight < words.length) timeline.to(word, { opacity: baseOpacity }, index + spotlight);
        });
        return;
      }
      gsap.to(words,
        {
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            end: "bottom 65%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
    }, ref);
    ScrollTrigger.refresh();
    return () => context.revert();
  }, [revealed, reducedMotion, baseOpacity, blurStrength, children, spotlight]);

  return (
    <p ref={ref} className={className}>
      {Array.from(children.matchAll(/\S+|\s+/g)).map((match) => {
        const word = match[0];
        if (/^\s+$/.test(word)) return word;
        const highlighted = highlightedRanges.some(({ start, end }) => match.index >= start && match.index < end);
        return <span key={match.index} data-reveal-word style={{ display: "inline-block" }}>
          {highlighted
            ? <ShinyText text={word} speed={2.5} delay={1} color="var(--intro-accent)" shineColor="var(--intro-shine)" />
            : word}
        </span>;
      })}
    </p>
  );
}
