"use client";

import { motion } from "framer-motion";
import { GraduationCap, MapPin, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Handwritten } from "@/components/doodles/handwritten";
import type { Hobby, SiteSettings } from "@/lib/types";

const ROTATIONS = [-4, 3, -6, 2, 5, -3];

export function BioSection({
  profile,
  paragraph,
  hobbies,
}: {
  profile: SiteSettings["profile"];
  paragraph: string;
  hobbies: Hobby[];
}) {
  const milestones: { icon: LucideIcon; text: string }[] = [
    { icon: MapPin, text: `Based in ${profile.location}` },
    { icon: GraduationCap, text: "Started out in Mechatronics Engineering" },
    { icon: Rocket, text: profile.founderNote },
  ];

  return (
    <div className="grid gap-14 lg:grid-cols-[1fr_320px]">
      <div>
        <p className="type-eyebrow mb-4">Beyond the screen</p>
        <p className="type-body max-w-xl text-[16px] leading-relaxed text-ink-muted">
          {paragraph}
        </p>

        <ul className="mt-9 flex flex-col gap-6 border-l border-dashed border-border pl-6">
          {milestones.map((milestone, i) => (
            <motion.li
              key={milestone.text}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
              className="relative flex items-center gap-3"
            >
              <span className="absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full bg-surface ring-2 ring-primary-300">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              </span>
              <milestone.icon size={15} className="shrink-0 text-ink-soft" />
              <span className="text-[13.5px] font-medium text-ink-strong">{milestone.text}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div>
        <Handwritten className="mb-5 inline-block text-[16px] text-primary-500">
          and outside of work
        </Handwritten>
        <div className="flex flex-wrap gap-2.5">
          {hobbies.map((hobby, i) => (
            <motion.span
              key={hobby.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              whileHover={{ rotate: 0, scale: 1.05 }}
              style={{ rotate: ROTATIONS[i % ROTATIONS.length] }}
              title={hobby.note}
              className="cursor-default rounded-lg border border-hairline bg-surface px-3.5 py-2 text-[12.5px] font-medium text-ink-strong shadow-sm"
            >
              {hobby.label}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
