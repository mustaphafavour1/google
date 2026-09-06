/**
 * In-memory demo store — resets on server restart and isn't shared across
 * serverless instances. Good enough for a single-process deploy; swap the
 * body of these functions for a real KV/database (Redis, a Sanity
 * mutation, Postgres) without touching any caller.
 *
 * State lives on `globalThis` rather than a plain module-level variable:
 * Next.js bundles each route (page vs. API route) into its own module
 * graph, so a `let` at module scope ends up duplicated — one copy per
 * bundle — instead of shared. `globalThis` is the one thing that's
 * genuinely singleton across all of them within a process.
 */

type SiteMetrics = {
  uniqueVisitorHashes: Set<string>;
  countryCounts: Map<string, number>;
};

type MetricsGlobal = typeof globalThis & {
  __portfolioSiteMetrics?: SiteMetrics;
  __portfolioClapCounts?: Map<string, number>;
  __portfolioRateLimits?: Map<string, number[]>;
};

const g = globalThis as MetricsGlobal;

const site: SiteMetrics = (g.__portfolioSiteMetrics ??= {
  uniqueVisitorHashes: new Set(),
  countryCounts: new Map(),
});

const clapCounts: Map<string, number> = (g.__portfolioClapCounts ??= new Map());
const rateLimitLog: Map<string, number[]> = (g.__portfolioRateLimits ??= new Map());

export function recordVisit(visitorHash: string, country: string | null): void {
  site.uniqueVisitorHashes.add(visitorHash);
  const key = country ?? "Unknown";
  site.countryCounts.set(key, (site.countryCounts.get(key) ?? 0) + 1);
}

export function getUniqueVisitorCount(): number {
  return site.uniqueVisitorHashes.size;
}

export function getCountryBreakdown(): { country: string; count: number }[] {
  return Array.from(site.countryCounts.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);
}

export function addClap(slug: string): number {
  const next = (clapCounts.get(slug) ?? 0) + 1;
  clapCounts.set(slug, next);
  return next;
}

export function getClaps(slug: string): number {
  return clapCounts.get(slug) ?? 0;
}

/** Sliding-window rate limit — true if `key` is still under `maxRequests` within the last `windowMs`. */
export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (rateLimitLog.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= maxRequests) {
    rateLimitLog.set(key, recent);
    return false;
  }
  recent.push(now);
  rateLimitLog.set(key, recent);
  return true;
}
