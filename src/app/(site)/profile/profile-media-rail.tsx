"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Images } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { ProfileMediaItem } from "@/lib/types";

const ROTATE_MS = 5000;

export function ProfileMediaRail({ items }: { items: ProfileMediaItem[] }) {
  const [index, setIndex] = useState(0);
  // A monotonically increasing counter, decoupled from `index` (which
  // wraps around) — used as the AnimatePresence key/z-index so a newly
  // slid-in item always stacks above the one it's covering, even across
  // the wrap from the last item back to the first.
  const [tick, setTick] = useState(0);

  function goTo(next: number) {
    setIndex(next);
    setTick((t) => t + 1);
  }

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
      setTick((t) => t + 1);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) {
    return (
      <div className="flex aspect-[3/4] w-full items-center overflow-hidden rounded-2xl border border-hairline">
        <EmptyState
          icon={Images}
          title="No photos yet"
          description="Add photos or short clips in Sanity Studio, under Site settings → Profile media."
        />
      </div>
    );
  }

  const current = items[index];

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-hairline bg-surface-muted">
      <AnimatePresence initial={false}>
        <motion.div
          key={tick}
          initial={{ x: "100%" }}
          animate={{ x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ transition: { duration: 0.5 } }}
          className="absolute inset-0"
          style={{ zIndex: tick }}
        >
          {current.video ? (
            <video
              src={current.video}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : current.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
            <img src={current.image} alt={current.caption ?? ""} className="h-full w-full object-cover" />
          ) : null}
          {current.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-[12.5px] font-medium text-white">{current.caption}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {items.length > 1 && (
        <div className="absolute left-1/2 top-3 flex -translate-x-1/2 gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show media ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "h-1 rounded-full transition-all",
                i === index ? "w-6 bg-white" : "w-3 bg-white/50",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
