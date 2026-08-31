"use client";

import { useState, type FormEvent } from "react";
import { Check, Send } from "lucide-react";

const FORM_URL = process.env.NEXT_PUBLIC_COMMENT_FORM_URL;
const FORM_ENTRY_ID = process.env.NEXT_PUBLIC_COMMENT_FORM_ENTRY_ID;
const FORM_PROJECT_ENTRY_ID = process.env.NEXT_PUBLIC_COMMENT_FORM_PROJECT_ENTRY_ID;

const FRAME_NAME = "hidden-comment-frame";

export function CommentBox({ projectName }: { projectName: string }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const configured = Boolean(FORM_URL && FORM_ENTRY_ID);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!configured) {
      event.preventDefault();
      return;
    }
    // Submission proceeds into the hidden iframe below — no redirect, no
    // visible Google Forms response page.
    setSubmitted(true);
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
    <>
      <form
        action={FORM_URL}
        method="POST"
        target={FRAME_NAME}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 sm:flex-row"
      >
        {FORM_PROJECT_ENTRY_ID && (
          <input type="hidden" name={FORM_PROJECT_ENTRY_ID} value={projectName} />
        )}
        <input
          type="text"
          name={FORM_ENTRY_ID}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={configured ? "Leave a thought on this case study…" : "Comments aren't set up yet"}
          disabled={!configured}
          required
          className="h-10 flex-1 rounded-md border border-border bg-transparent px-3 text-[13px] text-ink-strong placeholder:text-ink-muted disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!configured}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary-500 px-4 text-[13px] font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={13} />
          Send
        </button>
      </form>
      <iframe name={FRAME_NAME} title="Comment submission target" aria-hidden="true" tabIndex={-1} className="hidden" />
    </>
  );
}
