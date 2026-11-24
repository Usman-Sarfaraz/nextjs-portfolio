"use client";

import gsap from "gsap";
import ShinyText from "@/components/react-bits/ShinyText";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { CHAPTERS, Cover, type Chapter } from "./journey";
import styles from "./journey.module.css";

// One page per chapter on a phone: year, role and details together.
function PocketPage({ chapter }: { chapter: Chapter }) {
  return (
    <div className={`${styles.page} ${styles.pocketPage}`}>
      <p className={styles.yearLabel}>{chapter.label}</p>
      <p className={chapter.year === "Now" ? `${styles.year} ${styles.yearWord}` : styles.year}>
        <ShinyText text={chapter.year} speed={2.5} delay={1} color="var(--accent)" shineColor="var(--accent-shine)" className="heading-shine" />
      </p>
      <p className={styles.kicker}>{chapter.kicker}</p>
      <h3 className={styles.title}>
        {chapter.href ? (
          <a href={chapter.href} target="_blank" rel="noopener noreferrer" className={styles.titleLink}>
            {chapter.title} <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : chapter.title}
      </h3>
      <p className={styles.yearPlace}>{chapter.place}</p>
      <ul className={styles.points}>{chapter.points.map((point) => <li key={point}>{point}</li>)}</ul>
      {chapter.tools && <ul className={styles.tools}>{chapter.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>}
      {chapter.cta && <a href={chapter.cta.href} className={styles.cta}>{chapter.cta.label} <ArrowUpRight size={16} aria-hidden="true" /></a>}
    </div>
  );
}

// A pocket-sized version of the desktop book: swipe (or tap the arrows) and each page peels away
// around its left edge in 3D, following your finger, then lands or falls back.
export function PocketBook() {
  // Built here rather than at module load: journey.tsx and this file import each other.
  const PAGES = ["cover", ...CHAPTERS.map((chapter) => chapter.id)];
  const book = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const drag = useRef<{ x: number; id: number; leaf: HTMLElement; turning: boolean } | null>(null);
  const last = PAGES.length - 1;

  const leaves = () => Array.from(book.current?.querySelectorAll<HTMLElement>("[data-pocket-leaf]") ?? []);

  // The book is as tall as its tallest page, so turning never makes the layout jump.
  useLayoutEffect(() => {
    const element = book.current;
    if (!element) return;
    const measure = () => {
      const tallest = Math.max(...leaves().map((leaf) => (leaf.firstElementChild as HTMLElement | null)?.scrollHeight ?? 0));
      element.style.height = `${tallest}px`;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Settle every leaf for the current page: earlier pages turned away, the rest stacked in order.
  useEffect(() => {
    leaves().forEach((leaf, index) => {
      const turned = index < page;
      leaf.style.zIndex = String(PAGES.length - index);
      // Pages already turned away stay hidden; only the page that changes animates.
      if (turned && Number(gsap.getProperty(leaf, "rotationY")) <= -179) { gsap.set(leaf, { autoAlpha: 0 }); return; }
      gsap.to(leaf, {
        rotationY: turned ? -180 : 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: "power3.inOut",
        overwrite: "auto",
        onComplete: () => { if (turned) gsap.set(leaf, { autoAlpha: 0 }); },
      });
    });
  }, [page, PAGES.length]);

  const go = (next: number) => setPage(Math.max(0, Math.min(last, next)));

  const down = (event: PointerEvent<HTMLDivElement>) => {
    const all = leaves();
    drag.current = { x: event.clientX, id: event.pointerId, leaf: all[page]!, turning: true };
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const element = book.current;
    if (!state || !element || event.pointerId !== state.id) return;
    const dx = event.clientX - state.x;
    const width = element.offsetWidth;
    const all = leaves();
    if (dx < 0 && page < last) {
      // Swiping left lifts the current page.
      state.leaf = all[page]!;
      state.turning = true;
      gsap.set(state.leaf, { rotationY: Math.max(-180, (dx / width) * 180) });
    } else if (dx > 0 && page > 0) {
      // Swiping right brings the previous page back.
      state.leaf = all[page - 1]!;
      state.turning = false;
      gsap.set(state.leaf, { autoAlpha: 1, rotationY: Math.min(0, -180 + (dx / width) * 180) });
    }
  };
  const up = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const element = book.current;
    drag.current = null;
    if (!state || !element) return;
    const dx = event.clientX - state.x;
    if (Math.abs(dx) < 8) {
      // A tap: right half turns forward, left half turns back.
      const box = element.getBoundingClientRect();
      go(page + (event.clientX > box.left + box.width / 2 ? 1 : -1));
      return;
    }
    const committed = Math.abs(dx) > element.offsetWidth * 0.22;
    if (committed && dx < 0 && page < last) go(page + 1);
    else if (committed && dx > 0 && page > 0) go(page - 1);
    else setPage((current) => { gsap.to(state.leaf, { rotationY: state.turning ? 0 : -180, duration: 0.6, ease: "power3.out" }); return current; });
  };

  return (
    <div className={styles.pocket}>
      <div
        ref={book}
        className={styles.pocketBook}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        aria-roledescription="book"
        aria-label={`Career notes, page ${page + 1} of ${PAGES.length}`}
      >
        {PAGES.map((id, index) => {
          const chapter = CHAPTERS.find((item) => item.id === id);
          return (
            <div key={id} data-pocket-leaf className={styles.pocketLeaf} aria-hidden={index !== page} inert={index !== page}>
              <div className={styles.pocketFront}>{chapter ? <PocketPage chapter={chapter} /> : <Cover />}</div>
              <div className={styles.pocketBack} aria-hidden="true" />
            </div>
          );
        })}
      </div>
      <div className={styles.pocketControls}>
        <button type="button" className={styles.pocketButton} onClick={() => go(page - 1)} disabled={page === 0} aria-label="Previous page"><ArrowLeft size={18} aria-hidden="true" /></button>
        <div className={styles.pocketDots} aria-hidden="true">
          {PAGES.map((id, index) => <span key={id} data-on={index === page || undefined} />)}
        </div>
        <button type="button" className={styles.pocketButton} onClick={() => go(page + 1)} disabled={page === last} aria-label="Next page"><ArrowRight size={18} aria-hidden="true" /></button>
      </div>
      <p className={styles.hint} aria-hidden="true">{page === 0 ? "Swipe to open the book" : "Swipe or tap to turn"}</p>
    </div>
  );
}
