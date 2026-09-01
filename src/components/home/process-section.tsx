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
      <div className="grid gap-4 sm:grid-cols-2">
        {TRACKS.map((track, i) => (
          <motion.div
            key={track.discipline}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="rounded-xl border border-hairline bg-surface p-5"
          >
            <h3 className="text-[14.5px] font-semibold text-ink-em">{track.discipline}</h3>
            <p className="type-body mt-2 text-ink-muted">{track.teaser}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-6">
        <Button variant="outline" href="/process">
          Walk Through the Process
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
}
