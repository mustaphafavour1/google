"use client";

import { useState } from "react";
import { Images, ListOrdered, Play, Shuffle } from "lucide-react";
import { AutoScrollControl } from "@/components/ui/auto-scroll-control";
import { Lightbox } from "@/components/ui/lightbox";
import { useLightbox } from "@/components/ui/use-lightbox";
import { EmptyState } from "@/components/ui/empty-state";
import { shuffle, type GalleryItem } from "@/lib/gallery";
import { cn, tiltForKey } from "@/lib/utils";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [order, setOrder] = useState<"ordered" | "random">("ordered");
  const [displayItems, setDisplayItems] = useState(items);

  function setOrderMode(mode: "ordered" | "random") {
    setOrder(mode);
    setDisplayItems(mode === "random" ? shuffle(items) : items);
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Images}
        title="Nothing here yet"
        description="Images and videos added to project pages or the Profile media carousel will show up here automatically."
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-hairline bg-surface p-3">
        <AutoScrollControl />
        <div className="flex items-center gap-1 rounded-md border border-hairline p-1">
          <button
            type="button"
            onClick={() => setOrderMode("ordered")}
            aria-pressed={order === "ordered"}
            className={cn(
              "flex items-center gap-1.5 rounded px-2.5 py-1.5 text-[12px] font-medium transition-colors",
              order === "ordered" ? "bg-primary-tint text-primary-tint-text" : "text-ink-soft hover:text-ink-strong",
            )}
          >
            <ListOrdered size={13} />
            Ordered
          </button>
          <button
            type="button"
            onClick={() => setOrderMode("random")}
            aria-pressed={order === "random"}
            className={cn(
              "flex items-center gap-1.5 rounded px-2.5 py-1.5 text-[12px] font-medium transition-colors",
              order === "random" ? "bg-primary-tint text-primary-tint-text" : "text-ink-soft hover:text-ink-strong",
            )}
          >
            <Shuffle size={13} />
            Random
          </button>
        </div>
      </div>

      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
        {displayItems.map((item) => (
          <div
            key={item.key}
            className="mb-4 break-inside-avoid"
            style={{ transform: `rotate(${tiltForKey(item.key)}deg)` }}
          >
            <GalleryTile item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryTile({ item }: { item: GalleryItem }) {
  const lightbox = useLightbox();

  return (
    <>
      <button
        type="button"
        onClick={lightbox.show}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-lg border border-hairline shadow-sm transition-transform hover:z-10 hover:scale-[1.03] hover:rotate-0 hover:shadow-lg"
      >
        {item.kind === "image" && (
          // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
          <img src={item.src} alt={item.caption ?? ""} className="w-full" />
        )}
        {item.kind === "video-file" && (
          <video src={item.src} muted loop autoPlay playsInline className="w-full" />
        )}
        {item.kind === "video-embed" && (
          <div className="flex aspect-video items-center justify-center bg-surface-muted">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-em shadow">
              <Play size={16} fill="currentColor" />
            </span>
          </div>
        )}
        {item.caption && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1.5 bg-gradient-to-t from-black/75 to-transparent px-2.5 py-2 text-left text-[11px] text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            {item.caption}
          </span>
        )}
      </button>

      {lightbox.open && (
        <Lightbox label={item.caption} onClose={lightbox.hide}>
          {item.kind === "image" && (
            // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
            <img src={item.src} alt={item.caption ?? ""} className="max-h-full max-w-full object-contain" />
          )}
          {item.kind === "video-file" && (
            <video src={item.src} controls autoPlay className="max-h-[80vh] max-w-full" />
          )}
          {item.kind === "video-embed" && (
            <iframe
              src={item.embedUrl}
              title={item.caption || "Video"}
              className="aspect-video w-[min(90vw,900px)]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </Lightbox>
      )}
    </>
  );
}
