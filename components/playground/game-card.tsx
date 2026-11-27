import type { ReactNode } from "react";
import styles from "./playground.module.css";

type Stat = { label: string; value: ReactNode };

type GameCardProps = {
  id: string;
  index: number;
  title: string;
  /** One line on how to play. */
  howTo: string;
  stats: Stat[];
  /** The game stage; it fills the card's frame. */
  children: ReactNode;
  /** Buttons under the stage. */
  actions?: ReactNode;
};

/** One shell for every game: number and title, a how-to line, live stats, the stage, then its controls. */
export function GameCard({ id, index, title, howTo, stats, children, actions }: GameCardProps): ReactNode {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={styles.game}>
      <div className={styles.gameHead}>
        <div className={styles.gameTitleRow}>
          <span className={styles.gameIndex} aria-hidden="true">{String(index).padStart(2, "0")}</span>
          <h2 id={`${id}-title`} className={styles.gameTitle}>{title}</h2>
        </div>
        <p className={styles.howTo}>{howTo}</p>
        <dl className={styles.stats}>
          {stats.map(({ label, value }) => (
            <div key={label} className={styles.stat}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className={styles.frame}>{children}</div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </section>
  );
}
