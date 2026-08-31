"use client";

import { Captions, Play } from "lucide-react";
import { captionsPreference } from "@/lib/persistent-toggle";
import type { VideoBlock as VideoBlockT, Project } from "@/lib/types";

export function VideoBlock({ block, project }: { block: VideoBlockT; project: Project }) {
  const captionsOn = captionsPreference.useValue();

  return (
    <div>
      {block.heading && <h3 className="type-subheading mb-3">{block.heading}</h3>}
      {block.embedUrl ? (
        <div className="overflow-hidden rounded-xl border border-hairline">
          <iframe
            src={block.embedUrl}
            title={block.heading ?? "Project video"}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div
          className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-hairline"
          style={{
            background: `linear-gradient(135deg, ${project.accent.primary}, ${project.accent.secondary})`,
          }}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-ink-em shadow-lg">
            <Play size={20} fill="currentColor" />
          </span>
          {captionsOn && (
            <span className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white">
              <Captions size={12} />
              Captions on
            </span>
          )}
          {block.duration && (
            <span className="absolute right-3 top-3 rounded-md bg-black/40 px-2 py-0.5 text-[11px] font-medium text-white">
              {block.duration}
            </span>
          )}
        </div>
      )}
      {block.caption && <p className="type-meta mt-2">{block.caption}</p>}
    </div>
  );
}
