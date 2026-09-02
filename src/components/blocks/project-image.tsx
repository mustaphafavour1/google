"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function ProjectImage({ src, caption }: { src: string; caption?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <figure className="group relative overflow-hidden rounded-xl border border-hairline">
        <button type="button" onClick={() => setOpen(true)} className="block w-full cursor-zoom-in">
          {/* eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host */}
          <img src={src} alt={caption ?? ""} className="w-full" />
        </button>
        {caption && (
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1.5 bg-gradient-to-t from-black/75 to-transparent px-3 py-2.5 text-[12px] text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            {caption}
          </figcaption>
        )}
      </figure>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={caption || "Image"}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-10"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X size={18} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host */}
          <img
            src={src}
            alt={caption ?? ""}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full object-contain"
          />
          {caption && (
            <p className="absolute bottom-6 left-1/2 max-w-lg -translate-x-1/2 text-center text-[13px] text-white/80">
              {caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
