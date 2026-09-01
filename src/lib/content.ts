import { getSanityClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import {
  allProjectsQuery,
  allProjectsAiContextQuery,
  allProcessTracksQuery,
  allSkillsQuery,
  allPortfolioArchiveQuery,
  allBackgroundPatternsQuery,
  jobApplicationVariantBySlugQuery,
  portfolioPasswordQuery,
  projectBySlugQuery,
  siteSettingsQuery,
} from "@/sanity/queries";
import { projects as projectsFallback, getProjectBySlug as getProjectBySlugFallback } from "@/lib/data/projects";
import { processTracks as processTracksFallback } from "@/lib/data/process";
import { skills as skillsFallback } from "@/lib/data/skills";
import { siteSettingsFallback } from "@/lib/data/site";
import { getJobApplicationBySlug as getJobApplicationBySlugFallback } from "@/lib/data/job-applications";
import { portfolioArchiveFallback } from "@/lib/data/portfolio-archive";
import { backgroundPatternsFallback } from "@/lib/data/background-patterns";
import type {
  JobApplicationVariant,
  Project,
  ProcessTrack,
  Skill,
  SiteSettings,
  PortfolioArchiveEntry,
  BackgroundPattern,
} from "@/lib/types";

const REVALIDATE_SECONDS = 60;

/**
 * `accent` has no `.required()` rule in the Sanity schema (see
 * documents/project.ts) — a project authored or migrated without one is
 * valid content, not a bug. Every accent-consuming component assumes it's
 * always there, so fill the gap here, at the one boundary all three
 * project-shaped queries pass through, rather than defensively in every
 * gradient call site.
 */
const DEFAULT_PROJECT_ACCENT = { primary: "#a55c4e", secondary: "#d19686" };

function withAccentFallback(project: Project): Project {
  return project.accent ? project : { ...project, accent: DEFAULT_PROJECT_ACCENT };
}

/**
 * Every fetcher below tries live Sanity first (when configured) and falls
 * back to the local seed data in lib/data/ on missing config, an empty
 * result, or any fetch error — so the site keeps rendering correctly before
 * (and during) the CMS migration.
 */
async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!isSanityConfigured) return null;
  try {
    return await getSanityClient().fetch<T>(query, params, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch (error) {
    console.error("Sanity fetch failed, falling back to local seed data:", error);
    return null;
  }
}

export async function getProjects(): Promise<Project[]> {
  const result = await sanityFetch<Project[]>(allProjectsQuery);
  return result && result.length > 0 ? result.map(withAccentFallback) : projectsFallback;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const result = await sanityFetch<Project | null>(projectBySlugQuery, { slug });
  return result ? withAccentFallback(result) : getProjectBySlugFallback(slug);
}

export type ProjectAiContext = {
  name: string;
  slug: string;
  oneLiner: string;
  industry: string | null;
  year: number;
  tags: string[];
  aiContext?: string;
};

/**
 * FaveAI's knowledge base — server-only (used by the /api/chat route).
 * Deliberately not merged into getProjects(): aiContext is internal
 * reference material, and this is the one place it's fetched at all.
 */
export async function getProjectsAiContext(): Promise<ProjectAiContext[]> {
  const result = await sanityFetch<ProjectAiContext[]>(allProjectsAiContextQuery);
  if (result && result.length > 0) return result;
  return projectsFallback.map((p) => ({
    name: p.name,
    slug: p.slug,
    oneLiner: p.oneLiner,
    industry: p.industry,
    year: p.year,
    tags: p.tags,
  }));
}

export async function getProcessTracks(): Promise<ProcessTrack[]> {
  const result = await sanityFetch<ProcessTrack[]>(allProcessTracksQuery);
  return result && result.length > 0 ? result : processTracksFallback;
}

export async function getSkills(): Promise<Skill[]> {
  const result = await sanityFetch<Skill[]>(allSkillsQuery);
  return result && result.length > 0 ? result : skillsFallback;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const result = await sanityFetch<SiteSettings | null>(siteSettingsQuery);
  return result ?? siteSettingsFallback;
}

/**
 * Server-only — the résumé download gate (used by /api/resume). Kept out of
 * getSiteSettings()/SiteSettings entirely so the password never has a path
 * into a client bundle. Falls back to the seeded default so the gate still
 * works before Sanity is configured.
 */
export async function getPortfolioPassword(): Promise<string> {
  const result = await sanityFetch<{ portfolioPassword: string | null } | null>(portfolioPasswordQuery);
  return result?.portfolioPassword ?? "Tolulope";
}

export async function getJobApplicationVariant(
  slug: string,
): Promise<JobApplicationVariant | undefined> {
  const result = await sanityFetch<JobApplicationVariant | null>(jobApplicationVariantBySlugQuery, {
    slug,
  });
  return result
    ? { ...result, selectedProjects: result.selectedProjects.map(withAccentFallback) }
    : getJobApplicationBySlugFallback(slug);
}

export async function getPortfolioArchive(): Promise<PortfolioArchiveEntry[]> {
  const result = await sanityFetch<PortfolioArchiveEntry[]>(allPortfolioArchiveQuery);
  return result && result.length > 0 ? result : portfolioArchiveFallback;
}

export async function getBackgroundPatterns(): Promise<BackgroundPattern[]> {
  const result = await sanityFetch<BackgroundPattern[]>(allBackgroundPatternsQuery);
  return result ?? backgroundPatternsFallback;
}
