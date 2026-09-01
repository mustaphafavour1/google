"use client";

import { useEffect, useRef, useState } from "react";
import { Orbit as OrbitIcon, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMode, ChatModeConfig } from "@/lib/chatbot-content";

type Message = { role: "bot" | "user"; text: string };

export function FaveAiMini({
  mode,
  config,
  fallbackEmail,
}: {
  mode: ChatMode;
  config: ChatModeConfig;
  fallbackEmail: string;
}) {
  const [messages, setMessages] = useState<Message[]>([{ role: "bot", text: config.greeting }]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    const history = [...messages, { role: "user" as const, text: trimmed }];
    setMessages([...history, { role: "bot", text: "" }]);
    setInput("");
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
        body: JSON.stringify({ mode, messages: history }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        setReply(data?.error ?? `Something went wrong — email ${fallbackEmail} directly.`);
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
      setReply(`Connection issue — email ${fallbackEmail} directly.`);
    } finally {
      setIsStreaming(false);
    }
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
            disabled={isStreaming}
            className="rounded-full border border-hairline px-2 py-0.5 text-left text-[10px] text-ink-soft transition-colors hover:border-primary-300 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
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
          disabled={isStreaming}
          className="h-7 flex-1 rounded-md border border-border bg-transparent px-2 text-[11px] text-ink-strong placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-primary-300 disabled:opacity-60"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={isStreaming || !input.trim()}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary-500 text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={12} />
        </button>
      </form>
    </div>
  );
}
