"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./contact.module.css";

// The finale: the email address in large type that opens the mail app, with a copy button beside it.
// Hovering the address sends a ripple through its letters.
export function BigEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className={styles.bigEmailWrap}>
      <a href={`mailto:${email}`} className={styles.bigEmail} aria-label={`Email ${email}`}>
        <span className={styles.bigEmailText} aria-hidden="true">
          {email.split("").map((char, index) => (
            <span key={index} style={{ "--i": index } as CSSProperties}>{char}</span>
          ))}
        </span>
      </a>
      <button type="button" className={styles.copyButton} onClick={copy} data-copied={copied || undefined} aria-label={copied ? "Email copied" : "Copy email address"}>
        <span className={styles.copyWindow} aria-hidden="true">
          <span className={styles.copyFlip}>
            <span><Copy size={15} /> Copy email</span>
            <span><Check size={15} /> Copied</span>
          </span>
        </span>
      </button>
      <span className="sr-only" aria-live="polite">{copied ? "Email address copied to the clipboard" : ""}</span>
    </div>
  );
}
