"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Orbit as OrbitIcon, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { soundPreference } from "@/lib/persistent-toggle";
import { playTone } from "@/lib/ui-sound";
import { buildChatModes, findBestAnswer, type ChatMode } from "@/lib/chatbot-content";
import type { Project, SiteSettings } from "@/lib/types";

type Message = { role: "bot" | "user"; text: string };

const MODES: ChatMode[] = ["general", "recruiter", "designer"];

function playChime() {
  playTone({ frequency: 720, duration: 0.18, gain: 0.05 });
}

export function ChatWidget({
  siteSettings,
  projects,
}: {
  siteSettings: SiteSettings;
  projects: Project[];
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>("general");
  const modesConfig = buildChatModes(siteSettings, projects);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: modesConfig.general.greeting },
  ]);
  const [input, setInput] = useState("");
  const soundEnabled = soundPreference.useValue();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function switchMode(next: ChatMode) {
    setMode(next);
    setMessages([{ role: "bot", text: modesConfig[next].greeting }]);
  }

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const answer = findBestAnswer(trimmed, modesConfig[mode].quickQuestions);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed },
      {
        role: "bot",
        text:
          answer ??
          `I don't have a scripted answer for that yet — try one of the suggestions below, or email ${siteSettings.contact.email} directly.`,
      },
    ]);
    setInput("");
    if (soundEnabled) playChime();
  }

  return (
    <div className="fixed bottom-24 right-4 z-40 lg:bottom-4">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            role="dialog"
            aria-label="Chat with FaveAI"
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
            className="absolute bottom-16 right-0 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-hairline bg-surface shadow-[0_20px_48px_rgb(35_25_15_/_0.22)]"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-hairline px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-tint text-primary-tint-text">
                  <OrbitIcon size={14} />
                </span>
                <span className="text-[13.5px] font-semibold text-ink-strong">FaveAI</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex h-7 w-7 items-center justify-center rounded-md text-ink-soft hover:bg-surface-muted hover:text-ink-strong"
              >
                <X size={15} />
              </button>
            </div>

            <div className="flex shrink-0 gap-1 border-b border-hairline px-3 py-2">
              {MODES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  aria-pressed={mode === m}
                  className={cn(
                    "flex-1 rounded-md px-2 py-1.5 text-[11.5px] font-medium transition-colors",
                    mode === m
                      ? "bg-primary-500 text-white"
                      : "text-ink-soft hover:bg-surface-muted hover:text-ink-strong",
                  )}
                >
                  {modesConfig[m].label}
                </button>
              ))}
            </div>

            <div
              ref={listRef}
              aria-live="polite"
              className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-3 py-3"
            >
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-2",
                    message.role === "user" && "flex-row-reverse",
                  )}
                >
                  {message.role === "bot" && (
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary-tint-text">
                      <Bot size={12} />
                    </span>
                  )}
                  <p
                    className={cn(
                      "max-w-[80%] rounded-xl px-3 py-2 text-[12.5px] leading-relaxed",
                      message.role === "bot"
                        ? "bg-surface-muted text-ink-strong"
                        : "bg-primary-500 text-white",
                    )}
                  >
                    {message.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex shrink-0 flex-wrap gap-1.5 border-t border-hairline px-3 py-2">
              {modesConfig[mode].quickQuestions.map((qq) => (
                <button
                  key={qq.question}
                  type="button"
                  onClick={() => send(qq.question)}
                  className="rounded-full border border-hairline px-2.5 py-1 text-[11px] text-ink-soft transition-colors hover:border-primary-300 hover:text-primary-500"
                >
                  {qq.question}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex shrink-0 items-center gap-2 border-t border-hairline p-2.5"
            >
              <label htmlFor="faveai-chat-input" className="sr-only">
                Message FaveAI
              </label>
              <input
                id="faveai-chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask FaveAI something…"
                className="h-9 flex-1 rounded-md border border-border bg-transparent px-3 text-[12.5px] text-ink-strong placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-primary-300"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-500 text-white transition-colors hover:bg-primary-600"
              >
                <Send size={14} />
              </button>
            </form>
            <p className="shrink-0 px-3 pb-2 text-center text-[10px] text-ink-faint">
              Scripted assistant, not a live AI — for a real conversation, email directly.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close chat with FaveAI" : "Chat with FaveAI"}
        aria-expanded={open}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-white shadow-[0_10px_28px_rgb(165_92_78_/_0.4)] transition-colors hover:bg-primary-600"
      >
        {open ? <X size={18} /> : <OrbitIcon size={20} />}
      </motion.button>
    </div>
  );
}
