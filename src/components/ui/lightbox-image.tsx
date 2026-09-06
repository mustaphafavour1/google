"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOM_STEP = 0.5;

/**
 * The full-view image inside a Lightbox: fills the viewport's height on
 * desktop (most screens are wider than they are tall, so height is the
 * binding constraint) and its width on mobile (the opposite is true there),
 * and supports zoom (wheel, double-click/tap, +/- buttons) with drag-to-pan
 * once zoomed in. Scale resets whenever a new image mounts (key the
 * component by src if the same Lightbox instance can show different images).
 */
export function LightboxImage({ src, alt }: { src: string; alt: string }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragState = useRef<{ startX: number; startY: number; origin: { x: number; y: number } } | null>(null);

  function clampScale(next: number) {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
  }

  function setZoom(next: number) {
    const clamped = clampScale(next);
    setScale(clamped);
    if (clamped === MIN_SCALE) setPosition({ x: 0, y: 0 });
  }

  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    event.preventDefault();
    setZoom(scale - event.deltaY * 0.0025);
  }

  function handleDoubleClick() {
    setZoom(scale > MIN_SCALE ? MIN_SCALE : 2);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLImageElement>) {
    if (scale <= MIN_SCALE) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = { startX: event.clientX, startY: event.clientY, origin: position };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLImageElement>) {
    if (!dragState.current) return;
    const { startX, startY, origin } = dragState.current;
    setPosition({ x: origin.x + (event.clientX - startX), y: origin.y + (event.clientY - startY) });
  }

  function handlePointerUp() {
    dragState.current = null;
  }

  // Matches the Lightbox wrapper's own p-4/sm:p-10 padding — sized against
  // the viewport directly rather than a percentage height, since the
  // Lightbox's centering wrapper has no definite height for h-full/w-full
  // to resolve against.
  return (
    <div
      onWheel={handleWheel}
      className="relative flex max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] items-center justify-center overflow-hidden sm:max-h-[calc(100dvh-5rem)] sm:max-w-[calc(100vw-5rem)]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host */}
      <img
        src={src}
        alt={alt}
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        draggable={false}
        className={cn(
          "h-auto max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100vw-2rem)] object-contain transition-transform duration-100",
          "sm:h-[calc(100dvh-5rem)] sm:w-auto sm:max-w-[calc(100vw-5rem)]",
          scale > MIN_SCALE ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in",
        )}
        style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
      />

      <div
        onClick={(event) => event.stopPropagation()}
        className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/60 p-1 backdrop-blur"
      >
        <button
          type="button"
          onClick={() => setZoom(scale - ZOOM_STEP)}
          disabled={scale <= MIN_SCALE}
          aria-label="Zoom out"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 disabled:opacity-30"
        >
          <Minus size={14} />
        </button>
        <span className="min-w-[3ch] text-center text-[11px] font-medium text-white">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={() => setZoom(scale + ZOOM_STEP)}
          disabled={scale >= MAX_SCALE}
          aria-label="Zoom in"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 disabled:opacity-30"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
