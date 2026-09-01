"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { X } from "lucide-react";

export function ResumeGateButton({ className, children }: { className?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("checking");
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const { url } = (await res.json()) as { url: string };
      setOpen(false);
      setPassword("");
      setStatus("idle");
      window.location.href = url;
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xs rounded-xl border border-hairline bg-surface p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[14px] font-semibold text-ink-strong">Résumé is password-protected</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-ink-soft hover:text-ink-strong"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={submit} className="flex flex-col gap-2">
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setStatus("idle");
                }}
                placeholder="Password"
                className="h-10 rounded-md border border-border bg-transparent px-3 text-[13px] text-ink-strong outline-none focus:ring-2 focus:ring-primary-500/15"
              />
              {status === "error" && (
                <p className="text-[12px] text-danger">Incorrect password — try again.</p>
              )}
              <button
                type="submit"
                disabled={status === "checking" || !password}
                className="h-10 rounded-md bg-primary-500 text-[13px] font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "checking" ? "Checking…" : "Unlock download"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
