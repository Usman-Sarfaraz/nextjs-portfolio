"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, ChevronDown, Check } from "lucide-react";
import { CONTACT_SERVICES, SELECT_SERVICE_EVENT } from "@/lib/contact";
import styles from "./contact.module.css";

const SERVICES = [...CONTACT_SERVICES];

export function ContactForm() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const requestId = useRef<string | null>(null);
  const inFlight = useRef(false);
  const [service, setService] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [error, setError] = useState(false);
  const picker = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  // A service panel's "Let's build something" link pre-selects that service here.
  useEffect(() => {
    const select = (event: Event) => {
      const value = (event as CustomEvent<string>).detail;
      if (!SERVICES.some((item) => item === value)) return;
      setService(value);
      setError(false);
    };
    window.addEventListener(SELECT_SERVICE_EVENT, select);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, select);
  }, []);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!picker.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);
  function choose(value: string) {
    setService(value);
    setError(false);
    setStatus("");
    setFailed(false);
    requestId.current = null;
    setOpen(false);
    trigger.current?.focus();
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    if (!service) {
      setError(true);
      trigger.current?.focus();
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    requestId.current ??= crypto.randomUUID();
    inFlight.current = true;
    setSending(true);
    setOpen(false);
    setFailed(false);
    setStatus("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? "").trim(),
          email: String(data.get("email") ?? "").trim(),
          service,
          message: String(data.get("message") ?? "").trim(),
          requestId: requestId.current,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(
          result.error || "Unable to send your message. Please try again."
        );
      setStatus(
        result.confirmationSent
          ? "Thanks! Your message has been sent. A confirmation email is on its way to your inbox."
          : "Thanks! Your message has been sent, but the confirmation email could not be sent. I’ll reply to you directly."
      );
      form.reset();
      setService("");
      requestId.current = null;
    } catch (error) {
      setFailed(true);
      setStatus(
        error instanceof Error
          ? error.message
          : "Unable to send your message. Please try again."
      );
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  }
  return (
    <form
      className={styles.form}
      onSubmit={submit}
      onChange={() => {
        setStatus("");
        setFailed(false);
        requestId.current = null;
      }}
      aria-busy={sending}
    >
      <fieldset disabled={sending} className={styles.formFields}>
        <legend className="sr-only">Tell me about your project</legend>
        {/* Clear labels above each field, with the site's underline style: the line draws emerald on focus. */}
        <div className={styles.lineGrid}>
          <div className={styles.lineField}>
            <label htmlFor="contact-name" className={styles.lineLabel}>Your name</label>
            <input id="contact-name" name="name" autoComplete="name" placeholder="How should I call you?" required maxLength={100} className={styles.lineInput} />
          </div>
          <div className={styles.lineField}>
            <label htmlFor="contact-email" className={styles.lineLabel}>Email address</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={254} className={styles.lineInput} />
          </div>
          <div className={`${styles.lineField} ${styles.lineWide}`}>
            <span id="contact-service-label" className={styles.lineLabel}>What can I help with?</span>
            <input type="hidden" name="service" value={service} />
          <div ref={picker} className={`${styles.picker} ${styles.linePicker}`}>
              <button
                ref={trigger}
                id="contact-service"
                type="button"
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls="service-options"
                aria-labelledby="contact-service-label contact-service-value"
                aria-activedescendant={
                  open ? `service-option-${cursor}` : undefined
                }
                aria-invalid={error}
                aria-describedby={error ? "service-error" : undefined}
                className={styles.pickerTrigger}
                onClick={() => {
                  setCursor(
                    Math.max(
                      0,
                      SERVICES.findIndex((item) => item === service)
                    )
                  );
                  setOpen(!open);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    setOpen(true);
                    setCursor((current) =>
                      !open
                        ? Math.max(
                            0,
                            SERVICES.findIndex((item) => item === service)
                          )
                        : (current +
                            (event.key === "ArrowDown" ? 1 : -1) +
                            SERVICES.length) %
                          SERVICES.length
                    );
                  } else if (event.key === "Escape" || event.key === "Tab") {
                    setOpen(false);
                  } else if (
                    open &&
                    (event.key === "Enter" || event.key === " ")
                  ) {
                    event.preventDefault();
                    choose(SERVICES[cursor] ?? "");
                  } else if (
                    open &&
                    (event.key === "Home" || event.key === "End")
                  ) {
                    event.preventDefault();
                    setCursor(event.key === "Home" ? 0 : SERVICES.length - 1);
                  }
                }}
              >
                <span
                  id="contact-service-value"
                  className={service ? undefined : styles.pickerPlaceholder}
                >
                  {service || "Choose a service"}
                </span>
                <ChevronDown
                  size={17}
                  aria-hidden="true"
                  className={open ? styles.chevronOpen : undefined}
                />
              </button>
              {open && (
                <div
                  id="service-options"
                  role="listbox"
                  aria-label="Services"
                  className={styles.pickerMenu}
                >
                  {SERVICES.map((item, index) => (
                    <div
                      id={`service-option-${index}`}
                      key={item}
                      role="option"
                      aria-selected={service === item}
                      data-active={cursor === index}
                      className={styles.pickerOption}
                      onPointerMove={() => setCursor(index)}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => choose(item)}
                    >
                      {item}
                      {service === item && <Check size={16} aria-hidden="true" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {error && (
          <span id="service-error" className={styles.fieldError} role="alert">
            Please choose a service.
          </span>
        )}
        <div className={styles.ideaField}>
          <label htmlFor="contact-message" className={styles.lineLabel}>Tell me about your project</label>
          <textarea
            id="contact-message"
            name="message"
            rows={2}
            placeholder="What are you building, and when do you need it?"
            required
            maxLength={4000}
            className={styles.ideaInput}
          />
        </div>
        <div className={styles.formBottom}>
          <p>I&rsquo;ll reply directly to your email.</p>
          <button type="submit" disabled={sending}>
            {sending ? "Sending…" : "Send message"}{" "}
            <ArrowUpRight size={18} aria-hidden="true" />
          </button>
        </div>
      </fieldset>
      <p
        className={styles.status}
        data-error={failed}
        role="status"
        aria-live="polite"
      >
        {status}
      </p>
    </form>
  );
}
