import { createHash } from "crypto";

/**
 * Salted, one-way hash — the raw IP is never stored anywhere. Set
 * VISITOR_HASH_SALT in production so the hash isn't reproducible from a
 * public default; the app still works without it (see .env.local.example).
 */
const SALT = process.env.VISITOR_HASH_SALT ?? "favour-portfolio-default-salt";

export function hashVisitorIp(ip: string): string {
  return createHash("sha256").update(`${SALT}:${ip}`).digest("hex");
}

export function extractClientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip");
}

export function extractClientCountry(headers: Headers): string | null {
  // Populated automatically on Vercel; absent in local/dev environments.
  return headers.get("x-vercel-ip-country");
}
