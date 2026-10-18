"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/lib/motion";
import styles from "./contact.module.css";

export function FooterWordmark() {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <a ref={ref} href="#home" aria-label="Usman Sarfraz — back to home" className={styles.footerSignature}>
      {["usman", "sarfraz."].map((word, wordIndex) => (
        <span key={word} className={styles.signatureWord} aria-hidden="true">
          {Array.from(word).map((letter, index) => (
            <motion.span
              key={index}
              className={`${styles.signatureLetter} ${wordIndex === 0 && inView && !reducedMotion ? styles.shinyLetter : ""}`}
              style={wordIndex === 0 ? { animationDelay: `${1.3 + index * 0.12}s` } : {}}
              initial={false}
              animate={inView && !reducedMotion ? { y: ["-115%", "0%"] } : { y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.9, delay: reducedMotion ? 0 : wordIndex * 0.55 + index * 0.045, ease: [0.16, 1, 0.3, 1] }}
            >
              {letter}
            </motion.span>
          ))}
        </span>
      ))}
    </a>
  );
}
