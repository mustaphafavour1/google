"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/mustaphafavour1/30min";
const CALENDLY_SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
const LOADER_DURATION_MS = 3000;

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

/**
 * Loads Calendly's own embed script on demand (only once this actually
 * mounts, not on every page load) and lets it render the booking iframe
 * into this div — Calendly owns everything inside `containerRef` from
 * that point on. An opaque loader covers it for a fixed 5s regardless of
 * real load time, masking Calendly's occasionally-slow first paint —
 * loading itself starts immediately underneath, not after the mask.
 */
export function CalendlyInlineWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setShowLoader(false), LOADER_DURATION_MS);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function init() {
      if (!window.Calendly || !container) return;
      container.innerHTML = "";
      window.Calendly.initInlineWidget({ url: CALENDLY_URL, parentElement: container });
    }

    if (window.Calendly) {
      init();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CALENDLY_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", init, { once: true });
      return () => existing.removeEventListener("load", init);
    }

    const script = document.createElement("script");
    script.src = CALENDLY_SCRIPT_SRC;
    script.async = true;
    script.addEventListener("load", init, { once: true });
    document.body.appendChild(script);
  }, []);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {showLoader && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface">
          <Loader2 size={26} className="animate-spin text-primary-500" />
          <p className="type-body text-ink-muted">Loading the calendar…</p>
        </div>
      )}
    </div>
  );
}
