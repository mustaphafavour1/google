"use client";

import { useEffect, useRef, useState } from "react";
import { Orbit as OrbitIcon, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { findBestAnswer, type ChatModeConfig } from "@/lib/chatbot-content";

type Message = { role: "bot" | "user"; text: string };

export function FaveAiMini({
  config,
  fallbackEmail,
}: {
  config: ChatModeConfig;
  fallbackEmail: string;
}) {
  const [messages, setMessages] = useState<Message[]>([{ role: "bot", text: config.greeting }]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const answer = findBestAnswer(trimmed, config.quickQuestions);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed },
      {
        role: "bot",
        text: answer ?? `No scripted answer for that yet — email ${fallbackEmail} directly.`,
      },
    ]);
    setInput("");
  }

  return (
    <div className="overflow-hidden rounded-xl border border-hairline bg-surface">
      <div className="flex items-center gap-2 border-b border-hairline px-3 py-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary-tint-text">
          <OrbitIcon size={12} />
        </span>
        <span className="text-[12px] font-semibold text-ink-strong">FaveAI</span>
      </div>

      <div ref={listRef} className="flex max-h-40 flex-col gap-2 overflow-y-auto px-3 py-2.5">
        {messages.map((message, i) => (
          <p
            key={i}
            className={cn(
              "max-w-[90%] rounded-lg px-2.5 py-1.5 text-[11px] leading-relaxed",
              message.role === "bot"
                ? "bg-surface-muted text-ink-strong"
                : "ml-auto bg-primary-500 text-white",
            )}
          >
            {message.text}
          </p>
        ))}
      </div>

      <div className="flex flex-wrap gap-1 border-t border-hairline px-2.5 py-2">
        {config.quickQuestions.slice(0, 2).map((qq) => (
          <button
            key={qq.question}
            type="button"
            onClick={() => send(qq.question)}
            className="rounded-full border border-hairline px-2 py-0.5 text-left text-[10px] text-ink-soft transition-colors hover:border-primary-300 hover:text-primary-500"
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
        className="flex items-center gap-1.5 border-t border-hairline p-2"
      >
        <label htmlFor="faveai-mini-input" className="sr-only">
          Message FaveAI
        </label>
        <input
          id="faveai-mini-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask…"
          className="h-7 flex-1 rounded-md border border-border bg-transparent px-2 text-[11px] text-ink-strong placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-primary-300"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary-500 text-white transition-colors hover:bg-primary-600"
        >
          <Send size={12} />
        </button>
      </form>
    </div>
  );
}
