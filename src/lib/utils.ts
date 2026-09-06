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

/** Sanity's `date` type stores plain "YYYY-MM-DD" — parse as local time (not UTC) so the displayed day never shifts by one. */
export function formatDddDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
