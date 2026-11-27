import Image from "next/image";
import styles from "./screens-section.module.css";

// A wireframe of this site's own homepage, drawn in CSS. The page is always laid out 1440 "virtual px"
// wide (1em = 16 of them); full-bleed bands fill the window while each band's content keeps to the
// current breakpoint's width, the way a real capped container behaves. `data-layout` picks the breakpoint.
export function ReflowPage({ layout }: { layout: "desktop" | "tablet" | "phone" }) {
  return (
    <div className={styles.page} data-layout={layout} data-page>
      <div className={styles.nav}>
        <div className={styles.wrap}>
          <i className={styles.brand} />
          <span className={styles.links}><i /><i /><i /><i /></span>
          <i className={styles.cta} />
          <span className={styles.burger}><i /><i /></span>
        </div>
      </div>

      <div className={styles.heroCard}>
        <div className={`${styles.wrap} ${styles.hero}`}>
          <div className={styles.copy}>
            <i className={styles.h} style={{ width: "88%" }} />
            <i className={`${styles.h} ${styles.hAccent}`} style={{ width: "56%" }} />
            <i className={styles.h} style={{ width: "74%" }} />
            <span className={styles.lede}><i style={{ width: "92%" }} /><i style={{ width: "64%" }} /></span>
            <span className={styles.actions}><i /><i /></span>
          </div>
          <div className={styles.portrait}>
            <Image src="/images/portfolio_portrait.png" alt="" fill sizes="(min-width: 768px) 280px, 160px" className={styles.portraitImg} />
          </div>
        </div>
      </div>

      <div className={styles.wrap}>
        <div className={styles.cards}>
          {[0, 1, 2].map((index) => (
            <span key={index} className={styles.card}><b /><i style={{ width: "70%" }} /><i style={{ width: "45%" }} /></span>
          ))}
        </div>
      </div>
    </div>
  );
}
