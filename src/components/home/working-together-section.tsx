"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WorkingTogetherItem } from "@/lib/types";

export function WorkingTogetherSection({ items }: { items: WorkingTogetherItem[] }) {
  return (
    <div>
      <div className="relative flex flex-col">
        <div className="absolute bottom-4 left-[9px] top-4 w-px bg-hairline" aria-hidden="true" />
        {items.map((item, i) => (
          <motion.div
            key={item.discipline}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="relative flex gap-5 py-4 first:pt-0 last:pb-0"
          >
            <span className="relative z-10 mt-1 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-primary-500 bg-surface">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
            </span>
            <div>
              <h3 className="text-[14.5px] font-semibold text-ink-em">{item.discipline}</h3>
              <p className="type-body mt-1.5 max-w-xl text-ink-muted">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-8">
        <Button variant="outline" href="/process">
          See The Process in Full
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
}
