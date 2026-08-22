"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProcessTimelineBlock } from "@/components/blocks/process-timeline-block";
import type { ProcessTrack } from "@/lib/types";

export function ProcessTabs({ processTracks }: { processTracks: ProcessTrack[] }) {
  return (
    <Tabs defaultValue={processTracks[0]?.discipline}>
      <TabsList>
        {processTracks.map((track) => (
          <TabsTrigger key={track.discipline} value={track.discipline}>
            {track.discipline}
          </TabsTrigger>
        ))}
      </TabsList>

      {processTracks.map((track) => (
        <TabsContent key={track.discipline} value={track.discipline} className="mt-6">
          <p className="type-body mb-6 max-w-2xl text-ink-muted">{track.summary}</p>
          <ProcessTimelineBlock
            block={{ _type: "processTimeline", _key: track._id, phases: track.phases }}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
