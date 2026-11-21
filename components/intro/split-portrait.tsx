"use client";

import gsap from "gsap";
import { ChevronsLeftRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useInView } from "motion/react";
import ShinyText from "@/components/react-bits/ShinyText";
import { useReducedMotion } from "@/lib/motion";
import portrait from "@/public/images/portfolio_portraitt.png";
import styles from "./intro-section.module.css";

type Token = [kind: "k" | "v" | "p" | "s" | "x", text: string];

// A short, syntax-coloured snippet laid out like an editor, one array of tokens per line.
const CODE_LINES: Token[][] = [
  [["k", "const "], ["v", "usman"], ["x", " = {"]],
  [["p", "  role"], ["x", ": "], ["s", "\"frontend dev\""], ["x", ","]],
  [["p", "  mode"], ["x", ": "], ["s", "\"independent\""], ["x", ","]],
  [["p", "  city"], ["x", ": "], ["s", "\"Lahore\""], ["x", ","]],
  [["p", "  ships"], ["x", ": "], ["s", "\"pixel-perfect\""], ["x", ","]],
  [["x", "};"]],
];
// One portrait, two ways of seeing it: drag the divider between the designer's blueprint and the
// developer's build. A native range input drives it, so it works with mouse, touch and keyboard.
export function SplitPortrait() {
  const card = useRef<HTMLDivElement>(null);
  const range = useRef<HTMLInputElement>(null);
  const touched = useRef(false);
  const inView = useInView(card, { once: true, amount: 0.6 });
  const reducedMotion = useReducedMotion();

  const setSplit = (value: number) => {
    card.current?.style.setProperty("--split", `${value}%`);
    if (range.current) range.current.value = String(value);
  };

  // A single sweep on first sight invites people to try the divider; any touch cancels it.
  useEffect(() => {
    if (!inView || reducedMotion) return;
    const proxy = { value: 50 };
    const sweep = gsap.timeline({ delay: 0.4, onUpdate: () => { if (!touched.current) setSplit(proxy.value); } })
      .to(proxy, { value: 26, duration: 0.9, ease: "power2.inOut" })
      .to(proxy, { value: 74, duration: 1.1, ease: "power2.inOut" })
      .to(proxy, { value: 50, duration: 0.8, ease: "power2.inOut" });
    return () => { sweep.kill(); };
  }, [inView, reducedMotion]);

  return (
    <div ref={card} className={styles.split}>
      {/* Developer's view: the finished build. */}
      <div className={styles.buildView}>
        <Image src={portrait} alt="" fill loading="eager" sizes="(min-width: 1024px) 40vw, calc(100vw - 48px)" className={styles.buildPhoto} />
        <p className={styles.stickerDev}>
          <span aria-hidden="true">{"</>"}</span> <ShinyText text="dev mode" speed={2.5} delay={1} color="#a7f3d0" shineColor="#ffffff" />
        </p>
        <pre className={styles.code}><code>
          {CODE_LINES.map((line, index) => (
            <span key={index} className={styles.codeLine}>
              <span className={styles.lineNo} aria-hidden="true">{index + 1}</span>
              {line.map(([kind, text], tokenIndex) => <span key={tokenIndex} className={styles[`tok_${kind}`]}>{text}</span>)}
            </span>
          ))}
        </code></pre>
      </div>

      {/* Designer's view: the blueprint, clipped to the left of the divider. */}
      <div className={styles.blueprintView} aria-hidden="true">
        <Image src={portrait} alt="" fill loading="eager" sizes="(min-width: 1024px) 40vw, calc(100vw - 48px)" className={styles.blueprintPhoto} />
        <div className={styles.blueprintTint} />
        <svg className={styles.guides} viewBox="0 0 1254 1254" preserveAspectRatio="xMidYMin slice">
          <line x1="0" y1="160" x2="1254" y2="160" />
          <line x1="0" y1="560" x2="1254" y2="560" />
          <line x1="450" y1="0" x2="450" y2="1254" />
          <line x1="735" y1="0" x2="735" y2="1254" />
          <rect x="450" y="160" width="285" height="400" />
          <circle cx="592" cy="360" r="6" />
        </svg>
        <span className={styles.measureX}>285</span>
        <span className={styles.measureY}>400</span>
        <p className={styles.stickerDesign}>design mode</p>
      </div>

      <div className={styles.handle} aria-hidden="true"><span className={styles.knob}><ChevronsLeftRight size={18} /></span></div>
      <input
        ref={range}
        type="range"
        min={0}
        max={100}
        defaultValue={50}
        className={styles.range}
        aria-label="Compare the design view and the development view of the portrait"
        onPointerDown={() => { touched.current = true; }}
        onKeyDown={() => { touched.current = true; }}
        onInput={(event) => setSplit(Number(event.currentTarget.value))}
      />
    </div>
  );
}
