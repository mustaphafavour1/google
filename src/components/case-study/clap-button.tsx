"use client";

import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

function noopSubscribe() {
  return () => {};
}

export function ClapButton({ slug, initialClaps }: { slug: string; initialClaps: number }) {
  const [claps, setClaps] = useState(initialClaps);
  const storageKey = `clapped-${slug}`;
  const hasClapped = useSyncExternalStore(
    noopSubscribe,
    () => localStorage.getItem(storageKey) === "true",
    () => false,
  );

  async function handleClap() {
    if (hasClapped) return;
    localStorage.setItem(storageKey, "true");
    setClaps((prev) => prev + 1);
    try {
      const res = await fetch(`/api/claps/${slug}`, { method: "POST" });
      if (res.ok) {
        const data: { claps: number } = await res.json();
        setClaps(data.claps);
      }
    } catch {
      // Optimistic count already applied — a failed request just means the
      // shared tally doesn't reflect this clap, which is a fine fallback.
    }
  }

  return (
    <button
      type="button"
      onClick={handleClap}
      disabled={hasClapped}
      aria-pressed={hasClapped}
      aria-label={hasClapped ? "You clapped for this case study" : "Clap for this case study"}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors",
        hasClapped
          ? "border-primary-200 bg-primary-tint text-primary-tint-text"
          : "border-border text-ink-strong hover:bg-surface-muted",
      )}
    >
      <motion.span
        key={hasClapped ? "clapped" : "idle"}
        initial={hasClapped ? { scale: 0.6, rotate: -20 } : false}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 12 }}
        className="flex"
      >
        <PartyPopper size={15} />
      </motion.span>
      {claps} {claps === 1 ? "clap" : "claps"}
    </button>
  );
}
