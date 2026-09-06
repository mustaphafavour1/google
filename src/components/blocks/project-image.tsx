"use client";

import { useLightbox } from "@/components/ui/use-lightbox";
import { Lightbox } from "@/components/ui/lightbox";
import { LightboxImage } from "@/components/ui/lightbox-image";

export function ProjectImage({ src, caption }: { src: string; caption?: string }) {
  const lightbox = useLightbox();

  return (
    <>
      <figure className="group relative overflow-hidden rounded-xl border border-hairline">
        <button type="button" onClick={lightbox.show} className="block w-full cursor-zoom-in">
          {/* eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host */}
          <img src={src} alt={caption ?? ""} className="w-full" />
        </button>
        {caption && (
          <figcaption className="pointer-events-none absolute bottom-2.5 left-2.5 max-w-[calc(100%-1.25rem)] truncate rounded-full bg-black/75 px-2.5 py-1 text-[11px] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
            {caption}
          </figcaption>
        )}
      </figure>

      {lightbox.open && (
        <Lightbox label={caption} onClose={lightbox.hide}>
          <LightboxImage src={src} alt={caption ?? ""} />
        </Lightbox>
      )}
    </>
  );
}
