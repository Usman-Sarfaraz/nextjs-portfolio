import { ArrowDownRight } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./playground.module.css";

const FrogArt = (
  <svg viewBox="0 0 160 100" aria-hidden="true">
    <g fill="var(--pg-bug)">
      <ellipse cx="140" cy="62" rx="6" ry="8" transform="rotate(70 140 62)" />
      <ellipse cx="34" cy="22" rx="5" ry="7" transform="rotate(-30 34 22)" />
    </g>
    <ellipse cx="112" cy="24" rx="6" ry="8" fill="var(--pg-gold)" transform="rotate(25 112 24)" />
    <path d="M88 84 Q110 80 132 66" stroke="var(--pg-tongue)" strokeWidth="5" strokeLinecap="round" fill="none" />
    <circle cx="134" cy="65" r="6" fill="var(--pg-tongue)" />
    <ellipse cx="80" cy="82" rx="26" ry="17" fill="var(--pg-frog)" />
    <circle cx="67" cy="66" r="9" fill="var(--pg-frog)" />
    <circle cx="93" cy="66" r="9" fill="var(--pg-frog)" />
    <circle cx="67" cy="65" r="5.5" fill="#fff" />
    <circle cx="93" cy="65" r="5.5" fill="#fff" />
    <circle cx="69" cy="64" r="2.6" fill="#062e24" />
    <circle cx="95" cy="64" r="2.6" fill="#062e24" />
    <ellipse cx="80" cy="88" rx="14" ry="7" fill="var(--pg-frog-belly)" />
  </svg>
);

const SlingshotArt = (
  <svg viewBox="0 0 160 100" aria-hidden="true">
    <path d="M30 96V62M30 62l-8-14M30 62l8-14" stroke="var(--pg-ink)" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M44 40 Q80 2 112 40" stroke="var(--accent)" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" fill="none" />
    <rect x="21" y="34" width="20" height="20" rx="5" fill="var(--pg-frog)" />
    <rect x="100" y="80" width="52" height="16" rx="3" fill="var(--pg-table)" />
    <g stroke="var(--accent)" strokeWidth="2" fill="var(--pg-block)">
      <rect x="106" y="64" width="40" height="16" rx="3" />
      <rect x="110" y="48" width="32" height="16" rx="3" />
      <rect x="114" y="32" width="24" height="16" rx="3" />
    </g>
  </svg>
);

const TowerArt = (
  <svg viewBox="0 0 160 100" aria-hidden="true">
    <rect x="52" y="84" width="56" height="16" rx="3" fill="var(--pg-table)" />
    <g stroke="var(--accent)" strokeWidth="2" fill="var(--pg-block)">
      <rect x="56" y="70" width="48" height="14" rx="3" />
      <rect x="60" y="56" width="42" height="14" rx="3" />
      <rect x="54" y="42" width="50" height="14" rx="3" transform="rotate(-3 79 49)" />
    </g>
    <rect x="96" y="10" width="44" height="14" rx="3" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 3" />
    <path d="M118 28v8" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 4" />
  </svg>
);

const PREVIEWS = [
  { id: "bug-hunt", title: "Bug hunt", text: "Feed the frog. Combos, gold bugs and wasps to dodge.", art: FrogArt },
  { id: "slingshot", title: "Slingshot", text: "Fling Shippy at bug forts. Earn three stars on each.", art: SlingshotArt },
  { id: "stack-tower", title: "Stack tower", text: "Drop my stack, block by block. Perfect drops snap true.", art: TowerArt },
];

/** Three cards under the header: a small picture of each game and a jump link to it. */
export function GamePreviews(): ReactNode {
  return (
    <nav aria-label="Games" className={styles.previews}>
      {PREVIEWS.map((preview, index) => (
        <a key={preview.id} href={`#${preview.id}`} className={styles.preview}>
          <span className={styles.previewArt}>{preview.art}</span>
          <span className={styles.previewBody}>
            <span className={styles.previewIndex}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.previewTitle}>{preview.title}</span>
            <span className={styles.previewText}>{preview.text}</span>
          </span>
          <ArrowDownRight className={styles.previewArrow} size={20} aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}
