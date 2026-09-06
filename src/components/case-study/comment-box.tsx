"use client";

import { useState, type FormEvent } from "react";
import { Check, Send, AlertCircle } from "lucide-react";

export function CommentBox({ projectName }: { projectName: string }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text, projectName }),
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

  if (submitted) {
    return (
      <p className="flex items-center gap-2 text-[13px] text-ink-muted">
        <Check size={15} className="text-success" />
        Thanks — that&rsquo;s been sent.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Your name (optional)"
        className="h-10 rounded-md border border-border bg-transparent px-3 text-[13px] text-ink-strong placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-primary-500/15"
      />
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Leave a thought on this case study…"
          required
          className="h-10 flex-1 rounded-md border border-border bg-transparent px-3 text-[13px] text-ink-strong placeholder:text-ink-muted"
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary-500 px-4 text-[13px] font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={13} />
          {submitting ? "Sending…" : "Send"}
        </button>
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-[12px] text-danger">
          <AlertCircle size={13} className="shrink-0" />
          {error}
        </p>
      )}
    </form>
  );
}
