"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/profile";
import styles from "./contact.module.css";

export function ContactForm() {
  const [prepared, setPrepared] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const service = String(data.get("service") ?? "");
    const message = String(data.get("message") ?? "").trim();
    const subject = `${service}: enquiry from ${name}`;
    const body = `${message}\n\nName: ${name}\nEmail: ${email}\nInterested in: ${service}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setPrepared(true);
  }
  return (
    <form className={styles.form} onSubmit={submit} onChange={() => setPrepared(false)}>
      <div className={styles.formHeading}><span>Tell me what you have in mind</span><span className={styles.formDot} aria-hidden="true" /></div>
      <div className={styles.fields}>
        <div className={styles.field}><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" placeholder="How should I call you?" required maxLength={100} /></div>
        <div className={styles.field}><label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={254} /></div>
      </div>
      <div className={styles.field}><label htmlFor="contact-service">What can I help with?</label><select id="contact-service" name="service" defaultValue="" required><option value="" disabled>Select a service</option><option>Frontend development</option><option>UI design & development</option><option>Backend development</option><option>Something else</option></select></div>
      <div className={styles.field}><label htmlFor="contact-message">Your message</label><textarea id="contact-message" name="message" rows={4} placeholder="A little about your project, goals, or opportunity…" required maxLength={4000} /></div>
      <div className={styles.formBottom}><p>Your message opens in your email app.</p><button type="submit">Let’s connect <ArrowUpRight size={18} aria-hidden="true" /></button></div>
      <p className={styles.status} role="status">{prepared ? "Your email draft is ready to open. Send it from your email app, or email me directly using the link on the left." : ""}</p>
    </form>
  );
}
