import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCompactCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

/** Sanity CDN image URLs encode the asset's original {width}x{height} in the filename — parsing it lets callers reserve layout space before the image loads, instead of the box jumping to size once it decodes. */
export function sanityImageAspectRatio(url: string): number | undefined {
  const match = /-(\d+)x(\d+)\.\w+$/.exec(url);
  if (!match) return undefined;
  return Number(match[1]) / Number(match[2]);
}

/** Deterministic ~-2..2deg tilt per key, so scattered-photo grids are stable across server/client renders. */
export function tiltForKey(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return (Math.abs(hash) % 400) / 100 - 2;
}
