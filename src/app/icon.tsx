import { readFile } from "node:fs/promises";
import path from "node:path";

export const size = { width: 64, height: 64 };

const FALLBACK_SVG = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="14" fill="#A55C4E"/>
  <text x="32" y="41" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#ffffff">FM</text>
</svg>`;

/** Prefers a user-uploaded public/logo.png; the bundled monogram is only the fallback when it's absent. */
export default async function Icon() {
  try {
    const bytes = await readFile(path.join(process.cwd(), "public", "logo.png"));
    return new Response(new Uint8Array(bytes), { headers: { "Content-Type": "image/png" } });
  } catch {
    return new Response(FALLBACK_SVG, { headers: { "Content-Type": "image/svg+xml" } });
  }
}
