import { getSanityClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import {
  allProjectsQuery,
  allProjectsAiContextQuery,
  allProcessTracksQuery,
  allSkillsQuery,
  allSkillGroupsQuery,
  allDesignSuperpowersQuery,
  allProductsQuery,
  allPortfolioArchiveQuery,
  allBackgroundPatternsQuery,
  allBlogPostsQuery,
  blogPostBySlugQuery,
  allDddWeeksQuery,
  allAiContextEntriesQuery,
  aiGuidelinesQuery,
  jobApplicationVariantBySlugQuery,
  portfolioPasswordQuery,
  projectBySlugQuery,
  siteSettingsQuery,
} from "@/sanity/queries";
import { projects as projectsFallback, getProjectBySlug as getProjectBySlugFallback } from "@/lib/data/projects";
import { processTracks as processTracksFallback } from "@/lib/data/process";
import { skills as skillsFallback } from "@/lib/data/skills";
import { skillGroups as skillGroupsFallback } from "@/lib/data/skill-groups";
import { designSuperpowersFallback } from "@/lib/data/design-superpowers";
import { siteSettingsFallback } from "@/lib/data/site";
import { getJobApplicationBySlug as getJobApplicationBySlugFallback } from "@/lib/data/job-applications";
import { portfolioArchiveFallback } from "@/lib/data/portfolio-archive";
import { backgroundPatternsFallback } from "@/lib/data/background-patterns";
import type {
  JobApplicationVariant,
  Project,
  ProcessTrack,
  Skill,
  SkillGroup,
  DesignSuperpower,
  Product,
  SiteSettings,
  PortfolioArchiveEntry,
  BackgroundPattern,
  BlogPost,
  DddEntry,
  AiContextEntry,
} from "@/lib/types";

const REVALIDATE_SECONDS = 60;

/**
 * `accent`, `links`, and `showOnPortfolio` all have no `.required()` rule
 * in the Sanity schema (see documents/project.ts) — a project authored or
 * migrated before one of these fields existed is valid content, not a
 * bug, and comes back from Sanity as `null` rather than the type's
 * declared shape. Every consuming component assumes the real shape is
 * always there, so fill the gaps here, at the one boundary all
 * project-shaped queries pass through, rather than defensively at every
 * call site.
 */
const DEFAULT_PROJECT_ACCENT = { primary: "#a55c4e", secondary: "#d19686" };

/**
 * `projectType` moved from a single string to a multi-select array — any
 * project doc saved before that schema change still has the old scalar
 * string sitting in Sanity until someone re-opens and re-saves it in
 * Studio. Coerce here so the rest of the app can assume an array without
 * every project needing a manual Studio visit first.
 */
function normalizeProjectType(value: unknown): Project["projectType"] {
  if (Array.isArray(value)) return value as Project["projectType"];
  if (typeof value === "string" && value) return [value] as Project["projectType"];
  return [];
}

function withProjectDefaults(project: Project): Project {
  return {
    ...project,
    accent: project.accent ?? DEFAULT_PROJECT_ACCENT,
    links: project.links ?? [],
    scale: project.scale ?? [],
    showOnPortfolio: project.showOnPortfolio ?? true,
    industry: project.industry ?? "General",
    projectType: normalizeProjectType(project.projectType),
  };
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
  return result && result.length > 0 ? result.map(withProjectDefaults) : projectsFallback;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const result = await sanityFetch<Project | null>(projectBySlugQuery, { slug });
  return result ? withProjectDefaults(result) : getProjectBySlugFallback(slug);
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

export async function getSkillGroups(): Promise<SkillGroup[]> {
  const result = await sanityFetch<SkillGroup[]>(allSkillGroupsQuery);
  return result && result.length > 0 ? result : skillGroupsFallback;
}

export async function getDesignSuperpowers(): Promise<DesignSuperpower[]> {
  const result = await sanityFetch<DesignSuperpower[]>(allDesignSuperpowersQuery);
  return result && result.length > 0 ? result : designSuperpowersFallback;
}

/**
 * No fallback seed data on purpose — unlike the other content types, there's
 * no real product list to fall back to yet. An empty result renders an
 * empty state on the Profile page's Products section until real ones are
 * added in Studio, rather than showing invented placeholder products.
 */
export async function getProducts(): Promise<Product[]> {
  const result = await sanityFetch<Product[]>(allProductsQuery);
  return result ?? [];
}

/**
 * No fallback seed data on purpose, same reasoning as getProducts() — this
 * is brand-new content with nothing real to fall back to yet.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const result = await sanityFetch<BlogPost[]>(allBlogPostsQuery);
  return result ?? [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const result = await sanityFetch<BlogPost | null>(blogPostBySlugQuery, { slug });
  return result ?? undefined;
}

type DddWeek = {
  week: number;
  images: { key: string; image: string; caption?: string; date?: string }[];
};

/**
 * DDD is authored in upload batches in Studio (one document per batch,
 * images uploaded together) but consumed as a flat list everywhere on the
 * site — flatten here, once, rather than teaching every caller about
 * batches. `day` stays as a fallback label for any image saved before the
 * per-image `date` field existed.
 */
export async function getDddEntries(): Promise<DddEntry[]> {
  const result = await sanityFetch<DddWeek[]>(allDddWeeksQuery);
  if (!result) return [];
  let day = 0;
  return result.flatMap((week) =>
    week.images.map((img) => {
      day += 1;
      return { _id: `${week.week}-${img.key}`, image: img.image, day, date: img.date, caption: img.caption };
    }),
  );
}

export async function getAiContext(): Promise<{ entries: AiContextEntry[]; guidelines: string | null }> {
  const [entries, guidelinesDoc] = await Promise.all([
    sanityFetch<AiContextEntry[]>(allAiContextEntriesQuery),
    sanityFetch<{ rules: string | null } | null>(aiGuidelinesQuery),
  ]);
  return { entries: entries ?? [], guidelines: guidelinesDoc?.rules ?? null };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const result = await sanityFetch<SiteSettings | null>(siteSettingsQuery);
  if (!result) return siteSettingsFallback;
  return {
    ...result,
    profile: { ...result.profile, brandTextRotation: result.profile.brandTextRotation ?? ["Favour M."] },
    featuredProjects: (result.featuredProjects ?? []).map(withProjectDefaults),
    profileMedia: result.profileMedia ?? [],
    contact: { ...result.contact, resumeVariants: result.contact.resumeVariants ?? [] },
    landing: {
      hero: { ...siteSettingsFallback.landing.hero, ...result.landing?.hero },
      journeyMilestones: result.landing?.journeyMilestones ?? siteSettingsFallback.landing.journeyMilestones,
      workingTogetherItems:
        result.landing?.workingTogetherItems ?? siteSettingsFallback.landing.workingTogetherItems,
    },
    dddSubtitle: result.dddSubtitle ?? siteSettingsFallback.dddSubtitle,
  };
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
    ? { ...result, selectedProjects: result.selectedProjects.map(withProjectDefaults) }
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
