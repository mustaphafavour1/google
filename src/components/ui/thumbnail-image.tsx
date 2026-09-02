"use client";

import { useLightbox } from "./use-lightbox";
import { Lightbox } from "./lightbox";
import { cn } from "@/lib/utils";

export function ThumbnailImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const lightbox = useLightbox();

  return (
    <>
      <button
        type="button"
        onClick={lightbox.show}
        aria-label={`Open ${alt} image`}
        className={cn(
          "block shrink-0 cursor-zoom-in overflow-hidden rounded-lg border border-hairline",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host */}
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </button>

      {lightbox.open && (
        <Lightbox label={alt} onClose={lightbox.hide}>
          {/* eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host */}
          <img src={src} alt={alt} className="max-h-full max-w-full object-contain" />
        </Lightbox>
      )}
    </>
  );
}
