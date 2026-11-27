import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import ShinyText from "@/components/react-bits/ShinyText";
import { HeroNavigation } from "@/components/hero/hero-navigation";
import { FooterWordmark } from "@/components/contact/footer-wordmark";
import { BugHunt } from "@/components/playground/bug-hunt";
import { SlingshotGame } from "@/components/playground/slingshot-game";
import { StackTower } from "@/components/playground/stack-tower";
import { GamePreviews } from "@/components/playground/game-previews";
import { createMetadata } from "@/lib/metadata";
import styles from "@/components/playground/playground.module.css";

export const metadata: Metadata = createMetadata({
  title: "Playground",
  description: "Small games by Usman Sarfraz, built with physics and motion: feed the frog, fling Shippy at bug forts and stack the tallest tower you can.",
  path: "/playground",
});

export default function PlaygroundPage(): ReactNode {
  return (
    <div>
      <HeroNavigation base="/" solid />
      <main id="main-content" className={styles.page}>
        <header className={styles.hero}>
          <h1 className={styles.heroTitle}>
            The <em><ShinyText text="playground." speed={2.5} delay={1} color="var(--accent)" shineColor="var(--accent-shine)" className="heading-shine" /></em>
          </h1>
          <div className={styles.heroMeta}>
            <p className={styles.heroLead}>
              Small games I built with real physics and motion. Pick one, set a best score, then come back and beat it.
            </p>
          </div>
        </header>

        <GamePreviews />

        <BugHunt />
        <SlingshotGame />
        <StackTower />

        <section className={styles.closing} aria-labelledby="playground-closing">
          <h2 id="playground-closing" className={styles.closingTitle}>
            Enjoyed that? <em>Let&rsquo;s build yours.</em>
          </h2>
          <Link href="/#contact" className={`${styles.button} ${styles.primary}`}>
            Start a conversation <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </section>
      </main>
      <FooterWordmark />
    </div>
  );
}
