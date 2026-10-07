import Image from "next/image";
import { ArrowUpRight, MapPin, Mail, Phone, ArrowUp, FileDown, Instagram } from "lucide-react";
import { TitleReveal } from "@/components/ui/title-reveal";
import ShinyText from "@/components/react-bits/ShinyText";
import { profile } from "@/lib/profile";
import { ShaderFlow } from "../shaders/shader-flow";
import { ContactForm } from "./contact-form";
import styles from "./contact.module.css";

export function ContactCard() {
  return (
    <div className={styles.section}>
      <section className={styles.frame} aria-labelledby="contact-heading">
        <div className={styles.card}>
          <div className={styles.flow} aria-hidden="true"><ShaderFlow scale={3} brightness={3} /></div>
          <div className={styles.layout}>
            <div className={styles.introduction}>
              <p className={styles.label}><span className={styles.contactDot} /> A conversation starts here</p>
              <h2 id="contact-heading" className={styles.heading}><TitleReveal>Let’s build<br /><ShinyText text="something." speed={2.5} delay={1} color="var(--contact-accent)" shineColor="var(--contact-shine)" /></TitleReveal></h2>
              <p className={styles.description}>A new website, a better interface, or a place on your team. Tell me what you’re working on.</p>
              <a href={`mailto:${profile.email}`} className={styles.email}>{profile.email}<ArrowUpRight size={19} aria-hidden="true" /></a>
              <div className={styles.details}><span><MapPin size={14} aria-hidden="true" />{profile.location}</span><a href={profile.phoneHref}><Phone size={14} aria-hidden="true" />{profile.phone}</a></div>
              <div className={styles.contactSocials}>
                <SocialLinks whatsapp />
                <span>Find me elsewhere</span>
              </div>
              <span className={styles.watermark} aria-hidden="true">us.</span>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
      <footer className={styles.footer}>
        <div className={styles.footerTop}><a href="#home" className={styles.brand}>Usman Sarfraz<span>.</span></a><nav aria-label="Footer navigation"><a href="#intro">About</a><a href="#projects">Work</a><a href="#services">Services</a></nav><div className={styles.socials}><SocialLinks whatsapp /><a href="/resume/Usman%20Sarfraz%20Resume.pdf" download aria-label="Download resume" title="Download resume"><FileDown size={18} aria-hidden="true" /></a></div></div>
        <div className={styles.footerBottom}><span>© {new Date().getFullYear()} Usman Sarfraz</span><span>Built with Next.js & care.</span><a href="#home">Back to top <ArrowUp size={14} aria-hidden="true" /></a></div>
      </footer>
    </div>
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
