import { ArrowUpRight, MapPin, Mail, Phone, ArrowUp, Linkedin, FileDown } from "lucide-react";
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
                <SocialLinks />
                <span>Find me elsewhere</span>
              </div>
              <span className={styles.watermark} aria-hidden="true">us.</span>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
      <footer className={styles.footer}>
        <div className={styles.footerTop}><a href="#home" className={styles.brand}>Usman Sarfraz<span>.</span></a><nav aria-label="Footer navigation"><a href="#intro">About</a><a href="#projects">Work</a><a href="#services">Services</a></nav><div className={styles.socials}><SocialLinks /><a href="/resume/Usman%20Sarfraz%20Resume.pdf" download aria-label="Download resume" title="Download resume"><FileDown size={18} aria-hidden="true" /></a></div></div>
        <div className={styles.footerBottom}><span>© {new Date().getFullYear()} Usman Sarfraz</span><span>Built with Next.js & care.</span><a href="#home">Back to top <ArrowUp size={14} aria-hidden="true" /></a></div>
      </footer>
    </div>
  );
}

function SocialLinks() {
  return <>
    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" title="LinkedIn"><Linkedin size={18} strokeWidth={1.6} aria-hidden="true" /></a>
    <a href={`mailto:${profile.email}`} aria-label="Email Usman" title="Email"><Mail size={18} strokeWidth={1.6} aria-hidden="true" /></a>
    <a href={profile.phoneHref} aria-label="Call Usman" title="Phone"><Phone size={18} strokeWidth={1.6} aria-hidden="true" /></a>
  </>;
}
