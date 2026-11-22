"use client";

// Adapted from React Bits' Scroll Reveal, with scoped cleanup and reduced motion.
import { Fragment, useEffect, useRef, type ReactNode } from "react";
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
  /** Inline media placed right after the first occurrence of each word; it pops in as that word is reached. */
  media?: Record<string, ReactNode>;
  /** For sticky layouts: reveal starts as the text enters view and ends when the sticky stage releases; revealed words stay lit. */
  pinned?: boolean;
};

export default function ScrollReveal({ children, className, baseOpacity = 0.2, blurStrength = 2, highlights = [], spotlight, media = {}, pinned = false }: ScrollRevealProps) {
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
      const chips = ref.current!.querySelectorAll<HTMLElement>("[data-reveal-chip]");
      gsap.set(words, { opacity: baseOpacity, filter: `blur(${blurStrength}px)` });
      gsap.set(chips, { scale: 0 });
      if (spotlight) {
        const timeline = gsap.timeline({
          defaults: { ease: "none", duration: 1 },
          // Pinned: start revealing as the text comes into view, finish when its sticky section releases.
          scrollTrigger: pinned
            ? {
                trigger: ref.current,
                start: "top bottom",
                endTrigger: ref.current!.closest("section") ?? ref.current,
                // Finish exactly when the sticky stage starts moving again: section bottom = stage top + stage height.
                end: () => {
                  const stage = ref.current?.closest<HTMLElement>("[data-pin-stage]");
                  if (!stage) return "bottom bottom";
                  return `bottom ${(parseFloat(getComputedStyle(stage).top) || 0) + stage.offsetHeight}px`;
                },
                scrub: 0.5,
                invalidateOnRefresh: true,
              }
            : { trigger: ref.current, start: "top 75%", end: "bottom 40%", scrub: 0.5, invalidateOnRefresh: true },
        });
        words.forEach((word, index) => {
          timeline.to(word, { opacity: 1, filter: "blur(0px)" }, index);
          // The final phrase stays lit once the reader reaches the end.
          // Pinned reading keeps every revealed word lit; otherwise earlier words fade back behind the reader.
          if (!pinned && index + spotlight < words.length) timeline.to(word, { opacity: baseOpacity }, index + spotlight);
        });
        // Pinned: a short hold with the full paragraph lit before the section releases.
        if (pinned) timeline.to({}, { duration: 3 }, words.length);
        // Chips pop in with their word and stay, so the sentence keeps its pictures.
        chips.forEach((chip) => {
          timeline.to(chip, { scale: 1, ease: "back.out(2.2)", duration: 1.2 }, Number(chip.dataset.revealChip));
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
  }, [revealed, reducedMotion, baseOpacity, blurStrength, children, spotlight, pinned]);

  return (
    <p ref={ref} className={className}>
      {(() => {
        const placed = new Set<string>();
        let wordIndex = -1;
        return Array.from(children.matchAll(/\S+|\s+/g)).map((match) => {
          const word = match[0];
          if (/^\s+$/.test(word)) return word;
          wordIndex += 1;
          const highlighted = highlightedRanges.some(({ start, end }) => match.index >= start && match.index < end);
          const chip = media[word] && !placed.has(word) ? media[word] : null;
          if (chip) placed.add(word);
          return <Fragment key={match.index}>
            <span data-reveal-word style={{ display: "inline-block" }}>
              {highlighted
                ? <ShinyText text={word} speed={2.5} delay={1} color="var(--intro-accent)" shineColor="var(--intro-shine)" />
                : word}
            </span>
            {chip && <> <span data-reveal-chip={wordIndex} aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle" }}>{chip}</span></>}
          </Fragment>;
        });
      })()}
    </p>
  );
}
