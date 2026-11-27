"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useBugHunt, type BugId } from "./bug-hunt-context";
import styles from "./bug-hunt.module.css";

type HiddenBugProps = {
  id: BugId;
  /** Positioning classes; the parent must be positioned. */
  className?: string;
  rotate?: number;
};

export function HiddenBug({ id, className = "", rotate = 0 }: HiddenBugProps): ReactNode {
  const { caught, catchBug } = useBugHunt();
  const ref = useRef<HTMLButtonElement>(null);

  if (caught.has(id)) return null;

  return (
    <button
      ref={ref}
      type="button"
      className={`${styles.bug} ${className}`}
      style={{ "--bug-rotate": `${rotate}deg` } as CSSProperties}
      aria-label="A bug. Let the frog catch it"
      onClick={() => ref.current && catchBug(id, ref.current)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none">
          <path d="M9 5.5 7 3M15 5.5 17 3" />
          <path d="M6.5 11H3M6.5 15l-3 2M17.5 11H21M17.5 15l3 2" />
        </g>
        <ellipse cx="12" cy="14" rx="5.5" ry="7" fill="currentColor" />
        <circle cx="12" cy="7" r="3" fill="currentColor" />
        <path d="M12 8.5v12" stroke="var(--bug-split)" strokeWidth="1.2" />
      </svg>
    </button>
  );
}
