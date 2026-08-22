import { getSanityClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import {
  allProjectsQuery,
  allProcessTracksQuery,
  allSkillsQuery,
  jobApplicationVariantBySlugQuery,
  projectBySlugQuery,
  siteSettingsQuery,
} from "@/sanity/queries";
import { projects as projectsFallback, getProjectBySlug as getProjectBySlugFallback } from "@/lib/data/projects";
import { processTracks as processTracksFallback } from "@/lib/data/process";
import { skills as skillsFallback } from "@/lib/data/skills";
import { siteSettingsFallback } from "@/lib/data/site";
import type { JobApplicationVariant, Project, ProcessTrack, Skill, SiteSettings } from "@/lib/types";

const REVALIDATE_SECONDS = 60;

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
  return result && result.length > 0 ? result : projectsFallback;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const result = await sanityFetch<Project | null>(projectBySlugQuery, { slug });
  return result ?? getProjectBySlugFallback(slug);
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

export async function getJobApplicationVariant(
  slug: string,
): Promise<JobApplicationVariant | undefined> {
  const result = await sanityFetch<JobApplicationVariant | null>(jobApplicationVariantBySlugQuery, {
    slug,
  });
  return result ?? undefined;
}
