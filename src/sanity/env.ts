/**
 * No throwing here on purpose: the app needs to keep rendering from the local
 * seed data in `lib/data/` until these are actually set (see lib/sanity/client.ts).
 * Sanity Studio itself (sanity.config.ts) will still fail loudly if you try to
 * run it without a real project ID — that's expected, you can't run a CMS
 * without a target project.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export const isSanityConfigured = Boolean(projectId);
