import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * The faint sketchbook-style grid of touching squares used behind the
 * Metrics and closing sections — a plain tiled SVG pattern, no JS. Each
 * instance gets its own pattern id since more than one renders per page.
 */
export function GridSquaresBackground({ className }: { className?: string }) {
  const patternId = `grid-squares-${useId()}`;

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full text-ink-faint/40", className)}
    >
      <defs>
        <pattern id={patternId} width="28" height="28" patternUnits="userSpaceOnUse">
          <rect x="0.5" y="0.5" width="27" height="27" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
