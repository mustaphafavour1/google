"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { X } from "lucide-react";

type Variant = { label: string; url: string };
type Stage = "closed" | "password" | "picking" | "viewing";

export function ResumeGateButton({ className, children }: { className?: string; children: ReactNode }) {
  const [stage, setStage] = useState<Stage>("closed");
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [activeVariant, setActiveVariant] = useState<Variant | null>(null);

  function close() {
    setStage("closed");
    setPassword("");
    setError(null);
    setVariants([]);
    setActiveVariant(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChecking(true);
    setError(null);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.variants) {
        setError(data?.error ?? "Couldn't unlock the résumé — try again.");
        return;
      }
      const found: Variant[] = data.variants;
      setVariants(found);
      if (found.length === 1) {
        setActiveVariant(found[0]);
        setStage("viewing");
      } else {
        setStage("picking");
      }
    } catch {
      setError("Connection issue — try again.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <>
      <button type="button" onClick={() => setStage("password")} className={className}>
        {children}
      </button>

      {stage === "password" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={close}>
          <div
            className="w-full max-w-xs rounded-xl border border-hairline bg-surface p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[14px] font-semibold text-ink-strong">Résumé is password-protected</p>
              <button
                type="button"
                onClick={close}
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
                  setError(null);
                }}
                placeholder="Password"
                className="h-10 rounded-md border border-border bg-transparent px-3 text-[13px] text-ink-strong outline-none focus:ring-2 focus:ring-primary-500/15"
              />
              {error && <p className="text-[12px] text-danger">{error}</p>}
              <button
                type="submit"
                disabled={checking || !password}
                className="h-10 rounded-md bg-primary-500 text-[13px] font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checking ? "Checking…" : "Unlock résumé"}
              </button>
            </form>
          </div>
        </div>
      )}

      {stage === "picking" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={close}>
          <div
            className="w-full max-w-xs rounded-xl border border-hairline bg-surface p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[14px] font-semibold text-ink-strong">Which version?</p>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="text-ink-soft hover:text-ink-strong"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {variants.map((variant) => (
                <button
                  key={variant.label}
                  type="button"
                  onClick={() => {
                    setActiveVariant(variant);
                    setStage("viewing");
                  }}
                  className="rounded-md border border-border px-3 py-2 text-left text-[13px] font-medium text-ink-strong transition-colors hover:bg-surface-muted"
                >
                  {variant.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {stage === "viewing" && activeVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-8" onClick={close}>
          <div
            className="flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-hairline bg-surface shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-hairline px-4 py-2.5">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-semibold text-ink-strong">Résumé</p>
                {variants.length > 1 && (
                  <span className="rounded-full bg-primary-tint px-2 py-0.5 text-[11px] font-medium text-primary-tint-text">
                    {activeVariant.label}
                  </span>
                )}
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setStage("picking")}
                    className="text-[11.5px] font-medium text-ink-soft underline-offset-2 hover:text-ink-strong hover:underline"
                  >
                    Switch version
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="text-ink-soft hover:text-ink-strong"
              >
                <X size={18} />
              </button>
            </div>
            <iframe src={activeVariant.url} title={`Résumé — ${activeVariant.label}`} className="min-h-0 flex-1" />
          </div>
        </div>
      )}
    </>
  );
}
