"use client";

import { useState, type FormEvent } from "react";
import { Check, Send } from "lucide-react";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdBCtMWjKonKeREfKIN0MDY9SbrSdaTqMwwCAFJNPRVf6l8CQ/formResponse";
const FORM_ENTRY_ID = "entry.1022555387";
const FORM_NAME_ENTRY_ID = "entry.387254039";

const FRAME_NAME = "hidden-comment-frame";

export function CommentBox({ projectName }: { projectName: string }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(_event: FormEvent<HTMLFormElement>) {
    // Submission proceeds into the hidden iframe below — no redirect, no
    // visible Google Forms response page. The iframe stays mounted
    // regardless of `submitted` so unmounting it here can't race with
    // (and cancel) the in-flight navigation it's carrying.
    setSubmitted(true);
  }

  return (
    <>
      {submitted ? (
        <p className="flex items-center gap-2 text-[13px] text-ink-muted">
          <Check size={15} className="text-success" />
          Thanks — that&rsquo;s been sent.
        </p>
      ) : (
        <form action={FORM_URL} method="POST" target={FRAME_NAME} onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            name={FORM_NAME_ENTRY_ID}
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
            {/* Carries the project name alongside the comment — the form itself
                has no separate field for it. */}
            <input type="hidden" name={FORM_ENTRY_ID} value={text ? `[${projectName}] ${text}` : ""} />
            <button
              type="submit"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary-500 px-4 text-[13px] font-medium text-white transition-colors hover:bg-primary-600"
            >
              <Send size={13} />
              Send
            </button>
          </div>
        </form>
      )}
      <iframe name={FRAME_NAME} title="Comment submission target" aria-hidden="true" tabIndex={-1} className="hidden" />
    </>
  );
}
