import type { BackgroundPattern } from "@/lib/types";

/**
 * Empty on purpose — background patterns are opt-in. Upload an SVG in
 * Studio (Background patterns), turn it on, and pick which pages or
 * projects should show it.
 */
export const backgroundPatternsFallback: BackgroundPattern[] = [];
