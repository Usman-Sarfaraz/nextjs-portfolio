import ShinyText from "@/components/react-bits/ShinyText";
import Image from "next/image";
import { MapPin, Mail, Phone, ArrowUp, Instagram } from "lucide-react";
import { TitleReveal } from "@/components/ui/title-reveal";
import { profile } from "@/lib/profile";
import { SectionHeader } from "@/components/ui/section-header";
import { BigEmail } from "./big-email";
import { ContactForm } from "./contact-form";
import { MagneticGroup } from "./magnetic-group";
import { FooterWordmark } from "./footer-wordmark";
import styles from "./contact.module.css";

export function ContactCard() {
  return (
    <>
    <div className={styles.section}>
      <section className={styles.frame} aria-labelledby="contact-heading">
        <div className={styles.card}>
          <SectionHeader
            id="contact-heading"
            title={<TitleReveal>Let&rsquo;s <em><ShinyText text="talk." speed={2.5} delay={1} color="var(--accent)" shineColor="var(--accent-shine)" className="heading-shine" /></em></TitleReveal>}
            note={<>A new website, a better interface,<br />or a place on your team.</>}
          />
          <BigEmail email={profile.email} />
          {/* The form as one sentence, then the quieter details in a single row underneath. */}
          <div className={styles.layout}>
            <ContactForm />
            <div className={styles.detailsRow}>
              <div className={styles.details}><span><MapPin size={14} aria-hidden="true" />{profile.location}</span><a href={profile.phoneHref}><Phone size={14} aria-hidden="true" />{profile.phone}</a></div>
              <MagneticGroup className={styles.contactSocials}>
                <span>Find me elsewhere</span>
                <SocialLinks whatsapp />
              </MagneticGroup>
            </div>
          </div>
        </div>
      </section>
    </div>
      <footer className={styles.footer}>
        <div className={styles.footerBottom}><span>© {new Date().getFullYear()} Usman Sarfraz</span><span>Built with Next.js & care.</span><a href="#home">Back to top <ArrowUp size={14} aria-hidden="true" /></a></div>
        <FooterWordmark />
      </footer>
    </>
  );
}

function SocialLinks({ whatsapp = false }: { whatsapp?: boolean }) {
  return <>
    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" title="LinkedIn"><Image src="/linkedin.svg" alt="" width={18} height={18} className={styles.linkedinLogo} aria-hidden="true" /></a>
    <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)" title="GitHub"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297C5.37.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.087-.744.083-.729.083-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.119 3.176.769.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.628-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg></a>
    <a href={profile.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram (opens in a new tab)" title="Instagram"><Instagram size={18} strokeWidth={1.8} aria-hidden="true" /></a>
    {whatsapp ? <a href={`https://wa.me/${profile.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Usman (opens in a new tab)" title="WhatsApp"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a9 9 0 0 1-13.4 7.9L3 21l1.6-4.6A9 9 0 1 1 21 11.5Z" /><path d="M8.2 7.2c.3-.3.7-.2.9.2l.9 1.8c.2.3.1.6-.1.8l-.7.7c.8 1.7 1.9 2.8 3.6 3.6l.7-.7c.2-.2.5-.3.8-.1l1.8.9c.4.2.5.6.2.9-.7 1-1.5 1.5-2.7 1.1-3.7-1.2-6.5-4-7.5-7.3-.3-.8.4-1.5 1.1-1.9Z" /></svg></a> : <a href={profile.phoneHref} aria-label="Call Usman" title="Phone"><Phone size={18} strokeWidth={1.6} aria-hidden="true" /></a>}
    <a href={`mailto:${profile.email}`} aria-label="Email Usman" title="Email"><Mail size={18} strokeWidth={1.6} aria-hidden="true" /></a>
  </>;
}
