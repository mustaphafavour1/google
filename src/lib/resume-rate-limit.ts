/**
 * Per-visitor cap on résumé password attempts — same globalThis-backed,
 * single-process-only pattern as chat-rate-limit.ts/metrics-store.ts (see
 * either for why globalThis, not a module-level `let`). Just a deterrent
 * against naive brute-forcing of a short password, not airtight across
 * multiple serverless instances.
 */

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 8;

type RateLimitGlobal = typeof globalThis & {
  __portfolioResumeRateLimits?: Map<string, { count: number; resetAt: number }>;
};

const g = globalThis as RateLimitGlobal;
const limits: Map<string, { count: number; resetAt: number }> = (g.__portfolioResumeRateLimits ??= new Map());

export function checkResumeRateLimit(visitorHash: string): { allowed: boolean } {
  const now = Date.now();
  const entry = limits.get(visitorHash);

  if (!entry || entry.resetAt < now) {
    limits.set(visitorHash, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_PER_WINDOW) {
    return { allowed: false };
  }

  entry.count += 1;
  return { allowed: true };
}
