"use client";

import { useEffect, useState } from "react";
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
    const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(familyName).replace(/%20/g, "+")}:wght@400;700&display=swap`;

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

// Upper/lowercase each split in two so the regular half and the bold half
// sit side by side — a quick, legible taste of the family's weight range
// without needing to render every actual weight it ships.
const UPPER_REGULAR = "ABCDEFGHIJKLM";
const UPPER_BOLD = "NOPQRSTUVWXYZ";
const LOWER_REGULAR = "abcdefghijklmnopqrstuvwxyz";
const LOWER_BOLD = " 0123456789";

function FontSpecimenRow({ font }: { font: LovedFont }) {
  const state = useGoogleFontLoad(font.name);

  return (
    <div className="rounded-md border border-hairline px-3 py-2.5">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-1.5">
          <p className="text-[13px] font-semibold text-ink-em">{font.name}</p>
          <span className="type-meta">
            {font.weightCount} weight{font.weightCount === 1 ? "" : "s"}
          </span>
        </div>
        <span className="type-meta shrink-0">
          {state === "loading" ? "Loading…" : state === "error" ? "Preview unavailable" : "Google Fonts"}
        </span>
      </div>

      {state === "loading" && (
        <div className="space-y-1.5" aria-hidden="true">
          <div className="h-[19px] w-[85%] animate-pulse rounded bg-surface-muted" />
          <div className="h-[19px] w-[70%] animate-pulse rounded bg-surface-muted" />
        </div>
      )}

      {state !== "loading" && (
        <div
          className={cn("space-y-1 overflow-x-auto", state === "error" && "opacity-60")}
          style={state === "loaded" ? { fontFamily: `"${font.name}", sans-serif` } : undefined}
        >
          <p className="whitespace-nowrap text-[15px] leading-snug text-ink-strong">
            <span className="font-normal">{UPPER_REGULAR}</span>
            <span className="font-bold">{UPPER_BOLD}</span>
          </p>
          <p className="whitespace-nowrap text-[15px] leading-snug text-ink-strong">
            <span className="font-normal">{LOWER_REGULAR}</span>
            <span className="font-bold">{LOWER_BOLD}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export function LovedFontsGrid({ fonts }: { fonts: LovedFont[] }) {
  if (fonts.length === 0) return null;

  return (
    <div className="flex flex-1 flex-col justify-center gap-3">
      {fonts.map((font) => (
        <FontSpecimenRow key={font._id} font={font} />
      ))}
    </div>
  );
}
