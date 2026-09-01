"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProcessDiscipline } from "@/lib/types";

const TRACKS: { discipline: ProcessDiscipline; teaser: string }[] = [
  {
    discipline: "UI/UX",
    teaser:
      "Need a product designed end to end? Here's how UI/UX work goes — discovery through to a validated, build-ready system.",
  },
  {
    discipline: "Web Development",
    teaser:
      "Need it built, not just designed? Here's how Web Development work goes — one person taking the system from file to production.",
  },
  {
    discipline: "Branding",
    teaser:
      "Need an identity that holds up under real use? Here's how Branding work goes — positioning through to rollout assets.",
  },
  {
    discipline: "Campaigns & Marketing",
    teaser:
      "Need a campaign shipped on a deadline? Here's how Campaigns & Marketing work goes — brief to launch, across every format.",
  },
];

export function ProcessSection() {
  return (
    <div>
      <div className="relative flex flex-col">
        <div className="absolute bottom-4 left-[9px] top-4 w-px bg-hairline" aria-hidden="true" />
        {TRACKS.map((track, i) => (
          <motion.div
            key={track.discipline}
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
              <h3 className="text-[14.5px] font-semibold text-ink-em">{track.discipline}</h3>
              <p className="type-body mt-1.5 max-w-xl text-ink-muted">{track.teaser}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-8">
        <Button variant="outline" href="/process">
          Walk Through the Process
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
}
