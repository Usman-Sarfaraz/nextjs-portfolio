"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import ShinyText from "@/components/react-bits/ShinyText";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion";
import { PocketBook } from "./pocket-book";
import styles from "./journey.module.css";

export type Chapter = {
  id: string;
  year: string;
  label: string;
  kicker: string;
  title: string;
  place: string;
  href?: string;
  points: string[];
  tools?: string[];
  cta?: { label: string; href: string };
};

export const CHAPTERS: Chapter[] = [
  {
    id: "study",
    year: "2019",
    label: "Where it started",
    kicker: "Education · 2019 to 2024",
    title: "BS in Computer Science",
    place: "Virtual University of Pakistan",
    points: [
      "Five years of computer science fundamentals: algorithms, data structures, databases and software engineering.",
      "The base I still build on when a design meets real data.",
    ],
  },
  {
    id: "bitlogicx",
    year: "2024",
    label: "First role",
    kicker: "Experience · Aug 2024 to present",
    title: "Frontend Developer at Bitlogicx",
    place: "Bitlogicx, Lahore",
    href: "https://bitlogicx.com/",
    points: [
      "Lead frontend development for web applications, working closely with designers and backend engineers.",
      "Build reusable Vue and Nuxt components, role-based interfaces and analytics dashboards.",
      "Integrate REST APIs and Socket.io, with bilingual English/Arabic interfaces and full RTL support.",
    ],
    tools: ["Vue", "Nuxt", "Next.js", "TypeScript", "AdonisJS", "Nuxt UI", "shadcn/ui", "Tailwind CSS", "REST APIs", "Socket.io"],
  },
  {
    id: "now",
    year: "Now",
    label: "Next chapter",
    kicker: "Available for projects",
    title: "Building fast, polished interfaces",
    place: "Websites, dashboards and web apps",
    points: [
      "Landing pages, company websites and real-time dashboards, built to load fast and feel effortless.",
      "Open to freelance projects and the right full-time role.",
    ],
    cta: { label: "Start a project", href: "#contact" },
  },
];

// Left page of a spread: the year, large, with its label.
function YearPage({ chapter }: { chapter: Chapter }) {
  return (
    <div className={`${styles.page} ${styles.left}`}>
      <p className={styles.running}>Usman Sarfraz</p>
      <div className={styles.yearBlock}>
        <p className={styles.yearLabel}>{chapter.label}</p>
        <p className={chapter.year === "Now" ? `${styles.year} ${styles.yearWord}` : styles.year}>
          {/* The year carries the site's signature shine. */}
          <ShinyText text={chapter.year} speed={2.5} delay={1} color="var(--accent)" shineColor="var(--accent-shine)" className="heading-shine" />
        </p>
        <p className={styles.yearPlace}>{chapter.place}</p>
      </div>
    </div>
  );
}

// Right page of a spread: the details.
function DetailPage({ chapter }: { chapter: Chapter }) {
  return (
    <div className={`${styles.page} ${styles.right}`}>
      <p className={styles.running}>Frontend Developer</p>
      <div className={styles.detail}>
        <p className={styles.kicker}>{chapter.kicker}</p>
        <h3 className={styles.title}>
          {chapter.href ? (
            <a href={chapter.href} target="_blank" rel="noopener noreferrer" className={styles.titleLink}>
              {chapter.title} <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : chapter.title}
        </h3>
        <ul className={styles.points}>{chapter.points.map((point) => <li key={point}>{point}</li>)}</ul>
        {chapter.tools && <ul className={styles.tools}>{chapter.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>}
        {chapter.cta && <a href={chapter.cta.href} className={styles.cta}>{chapter.cta.label} <ArrowUpRight size={16} aria-hidden="true" /></a>}
      </div>
    </div>
  );
}

export function Cover() {
  return (
    <div className={styles.cover}>
      <div className={styles.coverFrame}>
        <p className={styles.coverEyebrow}>Frontend Developer</p>
        <p className={styles.coverTitle}>Usman<span>Sarfraz.</span></p>
        <p className={styles.coverFoot}>Career notes · 2019 to now</p>
      </div>
    </div>
  );
}

// Each leaf is one sheet: its front sits on the right, its back lands on the left once turned.
const LEAVES: { front: ReactNode; back: ReactNode }[] = [
  { front: <Cover />, back: <YearPage chapter={CHAPTERS[0]!} /> },
  { front: <DetailPage chapter={CHAPTERS[0]!} />, back: <YearPage chapter={CHAPTERS[1]!} /> },
  { front: <DetailPage chapter={CHAPTERS[1]!} />, back: <YearPage chapter={CHAPTERS[2]!} /> },
];

const BOOK_QUERY = "(min-width: 900px) and (min-height: 640px)";

export function Journey() {
  const rail = useRef<HTMLDivElement>(null);
  const book = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Scrolling through the rail turns the pages: 0 is the closed cover, 3 is the last spread open.
  useEffect(() => {
    const railEl = rail.current;
    const bookEl = book.current;
    if (!railEl || !bookEl || reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);
    const leaves = Array.from(bookEl.querySelectorAll<HTMLElement>("[data-leaf]"));
    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    const render = (p: number) => {
      // Closed, the cover sits centred; as it opens the book slides so the spine is centred.
      bookEl.style.setProperty("--shift", String(1 - gsap.parseEase("power2.inOut")(clamp((p - 0.15) / 0.7))));
      leaves.forEach((leaf, index) => {
        // Each turn happens in the middle of its scroll segment, so every spread rests open for a moment.
        const t = clamp((p - index - 0.15) / 0.7);
        const eased = gsap.parseEase("power2.inOut")(t);
        leaf.style.transform = `rotateY(${-180 * eased}deg)`;
        // Turned leaves stack on the left in order; unturned ones on the right in reverse.
        leaf.style.zIndex = String(eased > 0.5 ? index + 1 : leaves.length - index + 1);
        // The sheet darkens slightly while it lifts, like real paper catching less light.
        leaf.style.setProperty("--lift", String(Math.sin(eased * Math.PI)));
      });
    };

    const mm = gsap.matchMedia();
    mm.add(BOOK_QUERY, () => {
      const state = { p: 0 };
      render(0);
      gsap.to(state, {
        // Stop just as the last page lands, so there is no extra scrolling after it.
        p: leaves.length - 0.15,
        ease: "none",
        onUpdate: () => render(state.p),
        scrollTrigger: { trigger: railEl, start: "top top", end: "bottom bottom", scrub: 0.8 },
      });
      return () => leaves.forEach((leaf) => { leaf.style.transform = ""; leaf.style.zIndex = ""; });
    });
    return () => mm.revert();
  }, [reducedMotion]);

  return (
    <div className={styles.journey}>
      {/* Desktop: the book. */}
      <div ref={rail} className={styles.rail} data-static={reducedMotion || undefined}>
        <div className={styles.stage}>
          <div ref={book} className={styles.book}>
            <div className={styles.base}><DetailPage chapter={CHAPTERS[2]!} /></div>
            {LEAVES.map((leaf, index) => (
              <div key={index} data-leaf className={styles.leaf}>
                <div className={`${styles.face} ${styles.front}`}>{leaf.front}<span className={styles.shade} aria-hidden="true" /></div>
                <div className={`${styles.face} ${styles.back}`}>{leaf.back}<span className={styles.shade} aria-hidden="true" /></div>
              </div>
            ))}
          </div>
          <p className={styles.hint} aria-hidden="true">Scroll to turn the page</p>
        </div>
      </div>

      {/* Phones and short screens: a one-page pocket book you swipe through. */}
      {!reducedMotion && <PocketBook />}

      {/* Reduced motion: the same spreads, laid flat. */}
      <ol className={styles.flat}>
        {CHAPTERS.map((chapter) => (
          <li key={chapter.id} className={styles.flatSpread}>
            <YearPage chapter={chapter} />
            <DetailPage chapter={chapter} />
          </li>
        ))}
      </ol>
    </div>
  );
}
