"use client";

import { motion } from "framer-motion";
import { DoodleStar } from "@/components/doodles/doodle-star";

export function PhilosophySection({ paragraph }: { paragraph: string }) {
  const sentences = paragraph.split(/(?<=\.)\s+/);
  const lead = sentences[0] ?? paragraph;
  const rest = sentences.slice(1).join(" ");
  const words = lead.split(" ");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center gap-2 text-ink-soft">
        <DoodleStar className="h-3.5 w-3.5 text-primary-400" />
        <p className="type-eyebrow">What I believe</p>
      </div>

      <p className="text-[clamp(1.5rem,3.2vw,2.25rem)] font-medium leading-[1.3] tracking-tight text-ink-em">
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0.15, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: i * 0.035, duration: 0.4 }}
            className="mr-[0.3em] inline-block"
          >
            {word}
          </motion.span>
        ))}
      </p>

      {rest && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: words.length * 0.035 + 0.15, duration: 0.5 }}
          className="type-body mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-muted"
        >
          {rest}
        </motion.p>
      )}
    </div>
  );
}
