"use client";

import { useLightbox } from "@/components/ui/use-lightbox";
import { Lightbox } from "@/components/ui/lightbox";
import { LightboxImage } from "@/components/ui/lightbox-image";

export function ProjectCoverImage({
  src,
  alt,
  accent,
}: {
  src: string;
  alt: string;
  accent: { primary: string; secondary: string };
}) {
  const lightbox = useLightbox();

  return (
    <>
      <button
        type="button"
        onClick={lightbox.show}
        className="relative mt-6 block w-full cursor-zoom-in overflow-hidden rounded-2xl"
        style={{ background: `linear-gradient(135deg, ${accent.primary}, ${accent.secondary})` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host */}
        <img src={src} alt={alt} className="w-full" />
      </button>

      {lightbox.open && (
        <Lightbox label={alt} onClose={lightbox.hide}>
          <LightboxImage src={src} alt={alt} />
        </Lightbox>
      )}
    </>
  );
}
