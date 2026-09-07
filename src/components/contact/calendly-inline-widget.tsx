"use client";

import { useEffect, useRef } from "react";

const CALENDLY_URL = "https://calendly.com/mustaphafavour1/30min";
const CALENDLY_SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

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
 * that point on.
 */
export function CalendlyInlineWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

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

  return <div ref={containerRef} className="h-[650px] w-full" />;
}
