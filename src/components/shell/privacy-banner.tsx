"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import { privacyBannerDismissed } from "@/lib/persistent-toggle";
import { cn } from "@/lib/utils";

export function PrivacyBanner() {
  const dismissed = privacyBannerDismissed.useValue();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (dismissed) return null;

  function dismiss() {
    privacyBannerDismissed.set(true);
  }

  return (
    <div
      role="region"
      aria-label="Privacy notice"
      className={cn(
        "fixed inset-x-4 bottom-24 z-40 mx-auto max-w-sm rounded-2xl border border-hairline bg-surface p-4 shadow-[0_16px_40px_rgb(35_25_15_/_0.18)] transition-all duration-300 ease-out lg:inset-x-auto lg:bottom-4 lg:left-4 lg:right-auto",
        entered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary-tint-text">
          <ShieldCheck size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-ink-strong">A quick privacy note</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">
            This site keeps anonymous, aggregated visit metrics — no cookies, no personal data
            stored — in line with NDPR &amp; GDPR. Just enough to see what resonates.
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="mt-3 inline-flex h-8 items-center rounded-md bg-primary-500 px-3 text-[12.5px] font-medium text-white transition-colors hover:bg-primary-600"
          >
            Got it
          </button>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss privacy notice"
          className="shrink-0 rounded-md p-1 text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink-strong"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
