"use client";

import { useLightbox } from "@/components/ui/use-lightbox";
import { Lightbox } from "@/components/ui/lightbox";
import { tiltForKey } from "@/lib/utils";
import type { DddEntry } from "@/lib/types";

export function DddTile({ entry }: { entry: DddEntry }) {
  const lightbox = useLightbox();
  const label = entry.day ? `Day ${entry.day}` : entry.caption;

  return (
    <div className="mb-4 break-inside-avoid" style={{ transform: `rotate(${tiltForKey(entry._id)}deg)` }}>
      <button
        type="button"
        onClick={lightbox.show}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-lg border border-hairline shadow-sm transition-transform hover:z-10 hover:scale-[1.03] hover:rotate-0 hover:shadow-lg"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host */}
        <img src={entry.image} alt={label ?? ""} className="w-full" />
        {label && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1.5 bg-gradient-to-t from-black/75 to-transparent px-2.5 py-2 text-left text-[11px] text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            {label}
          </span>
        )}
      </button>

      {lightbox.open && (
        <Lightbox label={label} onClose={lightbox.hide}>
          {/* eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host */}
          <img src={entry.image} alt={label ?? ""} className="max-h-full max-w-full object-contain" />
        </Lightbox>
      )}
    </div>
  );
}
