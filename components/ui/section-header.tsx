import type { ReactNode } from "react";
import styles from "./section-header.module.css";

type SectionHeaderProps = {
  id?: string | undefined;
  /** The oversized title; put the emphasised word in <em>. */
  title: ReactNode;
  /** Big accent number beside the title, e.g. 5 projects. */
  count?: number | undefined;
  countLabel?: string | undefined;
  note: ReactNode;
  className?: string | undefined;
};

// One header for every section: an oversized title, a count and a short note to its side, and a fine rule underneath.
export function SectionHeader({ id, title, count, countLabel, note, className }: SectionHeaderProps) {
  return (
    <header className={`${styles.header} ${className ?? ""}`}>
      <div className={styles.row}>
        <h2 id={id} className={styles.heading}>{title}</h2>
        <div className={styles.aside}>
          {count !== undefined && <p className={styles.count}><span>{String(count).padStart(2, "0")}</span> {countLabel}</p>}
          <p className={styles.note}>{note}</p>
        </div>
      </div>
    </header>
  );
}
