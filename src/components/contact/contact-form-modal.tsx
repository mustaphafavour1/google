"use client";

import { useState, type FormEvent } from "react";
import { Check, Send, X } from "lucide-react";
import { useContactForm } from "./contact-form-context";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdpsQgMKSp0daAm_opx1IxNkyXxn9jHVJ96WELPnQD5nRSk9A/formResponse";
const ENTRY = {
  name: "entry.875926583",
  email: "entry.485278952",
  phone: "entry.298588619",
  category: "entry.501439978",
  message: "entry.552349922",
};
const FRAME_NAME = "hidden-contact-frame";

const CATEGORIES = ["Enquiry", "Job hire", "Gig", "Collaboration", "Consultation", "Others"];

const EMPTY_FORM = { name: "", email: "", phone: "", category: CATEGORIES[0], message: "" };

export function ContactFormModal() {
  const { open, closeForm } = useContactForm();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(_event: FormEvent<HTMLFormElement>) {
    // Submission proceeds into the hidden iframe below — no redirect, no
    // visible Google Forms response page. The iframe stays mounted
    // regardless of `submitted` so unmounting it here can't race with
    // (and cancel) the in-flight navigation it's carrying.
    setSubmitted(true);
  }

  function close() {
    closeForm();
    setSubmitted(false);
    setForm(EMPTY_FORM);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Contact form"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={close}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-hairline bg-surface p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[16px] font-semibold text-ink-strong">Get in touch</p>
            <p className="type-body mt-0.5 text-ink-muted">
              Tell me a bit about what you need — I read every message.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="shrink-0 text-ink-soft transition-colors hover:text-ink-strong"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success/15 text-success">
              <Check size={18} />
            </span>
            <p className="text-[14px] font-medium text-ink-strong">Thanks — that&rsquo;s been sent.</p>
            <p className="type-body text-ink-muted">I&rsquo;ll get back to you soon.</p>
          </div>
        ) : (
          <form
            action={FORM_URL}
            method="POST"
            target={FRAME_NAME}
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
          >
            <input
              type="text"
              name={ENTRY.name}
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Your name"
              required
              className="h-10 rounded-md border border-border bg-transparent px-3 text-[13px] text-ink-strong placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-primary-500/15"
            />
            <input
              type="email"
              name={ENTRY.email}
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
              placeholder="Email address"
              required
              className="h-10 rounded-md border border-border bg-transparent px-3 text-[13px] text-ink-strong placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-primary-500/15"
            />
            <input
              type="tel"
              name={ENTRY.phone}
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
              placeholder="Phone number (optional)"
              className="h-10 rounded-md border border-border bg-transparent px-3 text-[13px] text-ink-strong placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-primary-500/15"
            />
            <select
              name={ENTRY.category}
              value={form.category}
              onChange={(event) => update("category", event.target.value)}
              className="h-10 rounded-md border border-border bg-surface px-3 text-[13px] text-ink-strong outline-none focus:ring-2 focus:ring-primary-500/15"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <textarea
              name={ENTRY.message}
              value={form.message}
              onChange={(event) => update("message", event.target.value)}
              placeholder="Your message"
              required
              rows={4}
              className="resize-none rounded-md border border-border bg-transparent px-3 py-2 text-[13px] text-ink-strong placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-primary-500/15"
            />
            <button
              type="submit"
              className="mt-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-primary-500 text-[13px] font-medium text-white transition-colors hover:bg-primary-600"
            >
              <Send size={13} />
              Send message
            </button>
          </form>
        )}
        <iframe
          name={FRAME_NAME}
          title="Contact submission target"
          aria-hidden="true"
          tabIndex={-1}
          className="hidden"
        />
      </div>
    </div>
  );
}
