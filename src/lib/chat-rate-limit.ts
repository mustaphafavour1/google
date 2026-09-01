/**
 * Lightweight per-visitor cap on FaveAI requests — same globalThis-backed,
 * single-process-only pattern as metrics-store.ts (see that file's comment
 * for why globalThis, not a module-level `let`). Not a airtight limiter
 * across multiple serverless instances, just a real cost guard against
 * blatant abuse of a public, unauthenticated endpoint that calls a paid API.
 */

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 20;

type RateLimitGlobal = typeof globalThis & {
  __portfolioChatRateLimits?: Map<string, { count: number; resetAt: number }>;
};

const g = globalThis as RateLimitGlobal;
const limits: Map<string, { count: number; resetAt: number }> = (g.__portfolioChatRateLimits ??= new Map());

export function checkChatRateLimit(visitorHash: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = limits.get(visitorHash);

  if (!entry || entry.resetAt < now) {
    limits.set(visitorHash, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_PER_WINDOW - 1 };
  }

  if (entry.count >= MAX_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_PER_WINDOW - entry.count };
}
