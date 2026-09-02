"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

export function Lightbox({
  children,
  label,
  onClose,
}: {
  children: ReactNode;
  label?: string;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label || "Media"}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-10"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X size={18} />
      </button>
      <div onClick={(e) => e.stopPropagation()} className="flex max-h-full max-w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}
