"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Calendar, Check, MessageSquare, Send, X } from "lucide-react";
import { useContactForm } from "./contact-form-context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendlyInlineWidget } from "./calendly-inline-widget";

const CATEGORIES = ["Enquiry", "Job hire", "Gig", "Collaboration", "Consultation", "Others"];

const EMPTY_FORM = { name: "", email: "", phone: "", category: CATEGORIES[0], message: "" };

export function ContactFormModal() {
  const { open, closeForm } = useContactForm();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({ ok: false }));
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Couldn't send that — try again in a moment.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Couldn't send that — check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function close() {
    closeForm();
    setSubmitted(false);
    setError(null);
    setForm(EMPTY_FORM);
  }

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Get in touch"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={close}
    >
      <motion.div
        layout
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-hairline bg-surface shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 p-6 pb-0">
          <div>
            <p className="text-[16px] font-semibold text-ink-strong">Get in touch</p>
            <p className="type-body mt-0.5 text-ink-muted">
              Grab time on the calendar, or drop a message — whichever works best for you.
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

        <Tabs defaultValue="message" className="flex min-h-0 flex-1 flex-col">
          <div className="shrink-0 px-6 pt-4">
            <TabsList>
              <TabsTrigger value="meeting" className="inline-flex items-center gap-1.5">
                <Calendar size={13} />
                Book a meeting
              </TabsTrigger>
              <TabsTrigger value="message" className="inline-flex items-center gap-1.5">
                <MessageSquare size={13} />
                Drop a message
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Calendly gets a fixed height (just enough room for its picker,
              capped for short viewports); the form tab sizes to its own
              content instead of stretching to match. The two panels are
              rarely the same height, so the outer card animates via
              `motion.div layout` above, letting the modal resize smoothly
              on tab switches instead of jumping or forcing a shared height. */}
          <TabsContent value="meeting" className="relative h-[min(560px,65vh)] overflow-y-auto px-2 pb-2 pt-2">
            <CalendlyInlineWidget />
          </TabsContent>

          <TabsContent
            value="message"
            className="flex flex-col items-center overflow-y-auto px-6 pb-6 pt-4"
          >
            {submitted ? (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check size={18} />
                </span>
                <p className="text-[14px] font-medium text-ink-strong">Thank you for reaching out.</p>
                <p className="type-body text-ink-muted">I&rsquo;d check your message and respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3">
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  placeholder="Your name"
                  required
                  className="h-10 rounded-md border border-border bg-transparent px-3 text-[13px] text-ink-strong placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-primary-500/15"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  placeholder="Email address"
                  required
                  className="h-10 rounded-md border border-border bg-transparent px-3 text-[13px] text-ink-strong placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-primary-500/15"
                />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  placeholder="Phone number (optional)"
                  className="h-10 rounded-md border border-border bg-transparent px-3 text-[13px] text-ink-strong placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-primary-500/15"
                />
                <select
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
                  value={form.message}
                  onChange={(event) => update("message", event.target.value)}
                  placeholder="Your message"
                  required
                  rows={4}
                  className="resize-none rounded-md border border-border bg-transparent px-3 py-2 text-[13px] text-ink-strong placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-primary-500/15"
                />
                {error && (
                  <p className="flex items-center gap-1.5 text-[12px] text-danger">
                    <AlertCircle size={13} className="shrink-0" />
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-primary-500 text-[13px] font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={13} />
                  {submitting ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
