"use client";

import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_CLAPS_PER_VISITOR = 10;

function noopSubscribe() {
  return () => {};
}

export function ClapButton({ slug, initialClaps }: { slug: string; initialClaps: number }) {
  const [claps, setClaps] = useState(initialClaps);
  const storageKey = `clapped-${slug}`;
  const myClaps = useSyncExternalStore(
    noopSubscribe,
    () => Number(localStorage.getItem(storageKey)) || 0,
    () => 0,
  );
  const atLimit = myClaps >= MAX_CLAPS_PER_VISITOR;

  async function handleClap() {
    if (atLimit) return;
    localStorage.setItem(storageKey, String(myClaps + 1));
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
      disabled={atLimit}
      aria-pressed={myClaps > 0}
      aria-label={
        atLimit
          ? "You've used all 10 claps on this case study"
          : `Clap for this case study — ${myClaps} of ${MAX_CLAPS_PER_VISITOR} used`
      }
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors",
        myClaps > 0
          ? "border-primary-200 bg-primary-tint text-primary-tint-text"
          : "border-border text-ink-strong hover:bg-surface-muted",
        atLimit ? "cursor-default opacity-70" : "cursor-pointer",
      )}
    >
      <motion.span
        key={myClaps}
        initial={myClaps > 0 ? { scale: 0.6, rotate: -20 } : false}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 12 }}
        className="flex"
      >
        <PartyPopper size={15} />
      </motion.span>
      {claps} {claps === 1 ? "clap" : "claps"}
      {myClaps > 0 && (
        <span className="data-mono text-[10.5px] text-ink-faint">
          {myClaps}/{MAX_CLAPS_PER_VISITOR}
        </span>
      )}
    </button>
  );
}
