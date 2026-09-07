"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LovedFont } from "@/lib/types";

type LoadState = "loading" | "loaded" | "error";

/**
 * Google's css2 endpoint has no key requirement, but it 400s for an unknown
 * family name — that non-2xx response is exactly what fires the <link>
 * element's native `error` event in every modern browser, so it doubles as a
 * free "is this actually a real Google Font" check without a Fonts API key.
 */
function useGoogleFontLoad(familyName: string): LoadState {
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(familyName).replace(/%20/g, "+")}:wght@400;600&display=swap`;

    let cancelled = false;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => {
      if (!cancelled) setState("loaded");
    };
    link.onerror = () => {
      if (!cancelled) setState("error");
    };
    document.head.appendChild(link);

    return () => {
      cancelled = true;
      link.remove();
    };
  }, [familyName]);

  return state;
}

const SPECIMEN_LINES = ["ABCDEFGHIJKLM", "NOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz", "0123456789 !?&@#%"];

function FontSpecimenCard({ font }: { font: LovedFont }) {
  const state = useGoogleFontLoad(font.name);

  return (
    <div className="stat-card">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-ink-em">{font.name}</p>
        <span className="type-meta shrink-0">
          {state === "loading" ? "Loading…" : state === "error" ? "Preview unavailable" : "Google Fonts"}
        </span>
      </div>

      {state === "loading" && (
        <div className="space-y-1.5" aria-hidden="true">
          {SPECIMEN_LINES.map((line, i) => (
            <div
              key={line}
              className="h-[18px] animate-pulse rounded bg-surface-muted"
              style={{ width: `${90 - i * 12}%` }}
            />
          ))}
        </div>
      )}

      {state !== "loading" && (
        <div
          className={cn("space-y-1", state === "error" && "opacity-60")}
          style={state === "loaded" ? { fontFamily: `"${font.name}", sans-serif` } : undefined}
        >
          {SPECIMEN_LINES.map((line) => (
            <p key={line} className="break-words text-[14px] leading-snug text-ink-strong">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function LovedFontsSection({ fonts }: { fonts: LovedFont[] }) {
  if (fonts.length === 0) return null;

  return (
    <section className="card mt-6 p-6 sm:p-8">
      <div className="mb-5 flex items-center gap-2">
        <Sparkles size={16} className="text-primary-500" />
        <div>
          <h2 className="text-[15px] font-semibold text-ink-em">Fonts I&rsquo;m currently in love with</h2>
          <p className="type-meta">Live previews, fetched straight from Google Fonts.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {fonts.map((font) => (
          <FontSpecimenCard key={font._id} font={font} />
        ))}
      </div>
    </section>
  );
}
