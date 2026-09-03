import { useId } from "react";
import { cn } from "@/lib/utils";

/** Size of one background square, in px — exported so sibling elements (e.g. metric cards) can size themselves as exact multiples of it and stay grid-aligned. */
export const GRID_SQUARE_SIZE = 28 / 3;

const EDGE_FADE_MASK = [
  "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
  "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
].join(", ");

/**
 * The faint sketchbook-style grid of touching squares used behind the
 * Metrics and closing sections — a plain tiled SVG pattern, no JS. Each
 * instance gets its own pattern id since more than one renders per page.
 * Faded on all 4 sides via a composited mask so it reads as background
 * texture rather than a hard-edged tile.
 */
export function GridSquaresBackground({ className }: { className?: string }) {
  const patternId = `grid-squares-${useId()}`;

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full text-ink-faint/25", className)}
      style={{
        maskImage: EDGE_FADE_MASK,
        WebkitMaskImage: EDGE_FADE_MASK,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      <defs>
        <pattern
          id={patternId}
          width={GRID_SQUARE_SIZE}
          height={GRID_SQUARE_SIZE}
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="0.25"
            y="0.25"
            width={GRID_SQUARE_SIZE - 0.5}
            height={GRID_SQUARE_SIZE - 0.5}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
