"use client";

import { useLightbox } from "@/components/ui/use-lightbox";
import { Lightbox } from "@/components/ui/lightbox";

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
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1.5 bg-gradient-to-t from-black/75 to-transparent px-3 py-2.5 text-[12px] text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            {caption}
          </figcaption>
        )}
      </figure>

      {lightbox.open && <Lightbox src={src} alt={caption} onClose={lightbox.hide} />}
    </>
  );
}
