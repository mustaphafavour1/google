"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Orbit, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

type Message = { role: "bot" | "user"; text: string; hidden?: boolean };

function buildSeedPrompt(project: Project): string {
  const scaleText =
    project.scale.length > 0 ? project.scale.map((s) => `${s.value} ${s.label}`).join(", ") : null;
  return [
    `Give a concise summary of the "${project.name}" project for a visitor about to read its case study.`,
    scaleText ? `Mention these headline numbers early: ${scaleText}.` : null,
    "Then briefly cover the problem, approach, and outcome. 3-5 sentences total.",
  ]
    .filter(Boolean)
    .join(" ");
}

export function ProjectSummaryPanel({ project, contactEmail }: { project: Project; contactEmail: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const seededRef = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(history: Message[]) {
    setMessages([...history, { role: "bot", text: "" }]);
    setIsStreaming(true);

    function setReply(text: string) {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "bot", text };
        return copy;
      });
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "designer", messages: history }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        setReply(data?.error ?? `Something went wrong — email ${contactEmail} directly.`);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setReply(accumulated);
      }
    } catch {
      setReply(`Connection issue — try again, or email ${contactEmail} directly.`);
    } finally {
      setIsStreaming(false);
    }
  }

  function openPanel() {
    setOpen(true);
    if (!seededRef.current) {
      seededRef.current = true;
      const seed: Message = { role: "user", text: buildSeedPrompt(project), hidden: true };
      send([seed]);
    }
  }

  function submitFollowUp() {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    setInput("");
    send([...messages, { role: "user", text: trimmed }]);
  }

  const visibleMessages = messages.filter((m) => !m.hidden);

  return (
    <>
      <button
        type="button"
        onClick={openPanel}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-[12px] font-medium text-ink-soft transition-colors hover:border-primary-300 hover:text-primary-500"
      >
        <Orbit size={13} />
        Summarize this project
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={`AI summary of ${project.name}`}
            className="fixed inset-y-0 right-0 z-40 flex w-full max-w-sm flex-col border-l border-hairline bg-surface shadow-[-16px_0_48px_rgb(35_25_15_/_0.15)]"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-hairline px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-tint text-primary-tint-text">
                  <Orbit size={14} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-ink-strong">FaveAI summary</p>
                  <p className="type-meta mt-0.5 truncate">{project.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close summary"
                className="shrink-0 rounded-md p-1 text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink-strong"
              >
                <X size={16} />
              </button>
            </div>

            <div ref={listRef} aria-live="polite" className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-3.5 py-3.5">
              {visibleMessages.map((message, i) => (
                <div key={i} className={cn("flex items-start gap-2", message.role === "user" && "flex-row-reverse")}>
                  {message.role === "bot" && (
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary-tint-text">
                      <Bot size={12} />
                    </span>
                  )}
                  <p
                    className={cn(
                      "max-w-[85%] rounded-xl px-3 py-2 text-[13px] leading-relaxed",
                      message.role === "bot" ? "bg-surface-muted text-ink-strong" : "bg-primary-500 text-white",
                    )}
                  >
                    {message.text || "…"}
                  </p>
                </div>
              ))}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitFollowUp();
              }}
              className="flex shrink-0 items-center gap-2 border-t border-hairline p-3"
            >
              <label htmlFor="project-summary-input" className="sr-only">
                Ask a follow-up question
              </label>
              <input
                id="project-summary-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a follow-up question…"
                disabled={isStreaming}
                className="h-9 flex-1 rounded-md border border-border bg-transparent px-3 text-[12.5px] text-ink-strong placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-primary-300 disabled:opacity-60"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={isStreaming || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-500 text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
