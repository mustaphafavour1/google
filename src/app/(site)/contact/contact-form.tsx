"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { FileText, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoodleArrow } from "@/components/doodles/doodle-arrow";
import { Handwritten } from "@/components/doodles/handwritten";
import { ResumeGateButton } from "@/components/resume/resume-gate-button";
import type { SiteSettings } from "@/lib/types";

export function ContactForm({ contact }: { contact: SiteSettings["contact"] }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject = encodeURIComponent(
      form.name ? `Portfolio inquiry from ${form.name}` : "Portfolio inquiry",
    );
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name || "—"} (${form.email || "no email given"})`,
    );
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-11 left-2 hidden items-center gap-1.5 text-highlight-purple sm:flex">
          <Handwritten className="text-xl">say hello!</Handwritten>
          <DoodleArrow className="mt-3 h-8 w-10 rotate-[135deg] scale-x-[-1]" />
        </div>

        <div className="card w-full p-6 sm:p-8">
          <h2 className="type-subheading">Send a message</h2>
          <p className="type-body mb-5 mt-1 text-ink-muted">
            This opens your email client with the message pre-filled — no backend, no spam
            filters to fight.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Name">
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-ink-strong placeholder:text-ink-faint outline-none focus:ring-2 focus:ring-primary-500/15"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-ink-strong placeholder:text-ink-faint outline-none focus:ring-2 focus:ring-primary-500/15"
              />
            </Field>
            <Field label="Message">
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Tell me a bit about the project…"
                className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-[13px] text-ink-strong placeholder:text-ink-faint outline-none focus:ring-2 focus:ring-primary-500/15"
              />
            </Field>
            <Button type="submit" className="mt-1 w-full">
              Send message
              <Send size={14} />
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-5">
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-1.5 text-[12.5px] font-medium text-ink-strong hover:text-primary-500"
            >
              <Mail size={13} />
              {contact.email}
            </a>
            {contact.resumeUrl && (
              <ResumeGateButton className="flex items-center gap-1.5 text-[12.5px] font-medium text-ink-strong hover:text-primary-500">
                <FileText size={13} />
                Resume
              </ResumeGateButton>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={contact.website.href}
              className="rounded-full border border-hairline px-2.5 py-1 text-[11px] font-medium text-ink-soft hover:text-ink-strong"
            >
              {contact.website.label}
            </a>
            {contact.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="rounded-full border border-hairline px-2.5 py-1 text-[11px] font-medium text-ink-soft hover:text-ink-strong"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-ink-strong">{label}</span>
      {children}
    </label>
  );
}
