/**
 * Second-pass enrichment on top of migrate-from-old-cms.ts. That script
 * got project metadata + one consolidated text block in; this one:
 *
 *  1. Rebuilds each project's blocks[] with the FULL original section
 *     order — every text section as its own block, every image section
 *     re-uploaded as a real image, videos/embeds mapped to the closest
 *     block type. Patches only the `blocks` field, so it won't clobber
 *     industry/role/projectType/scale/accent if you've already started
 *     fixing those by hand in Studio.
 *  2. Creates real processTrack documents from the old process page
 *     (UI/UX and Branding map cleanly to this schema's discipline list;
 *     the old "Overall" tab doesn't fit any of the four disciplines, so
 *     it's created anyway with discipline "Overall" — non-conforming,
 *     flagged in the output, yours to fold in or discard in Studio).
 *  3. Creates the site's first real siteSettings document — old
 *     home/about/contact page content overlaid on the current fallback
 *     (src/lib/data/site.ts) for anything the old CMS never had
 *     (hobbies, analytics aggregate, email, location).
 *
 * Dry-run by default — prints a summary, writes nothing. --write to
 * actually patch/create documents. Image uploads only happen on --write.
 *
 * Usage: same env vars as migrate-from-old-cms.ts.
 *   npm run sanity:enrich            # dry run
 *   npm run sanity:enrich -- --write # actually writes
 */
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";
import { siteSettingsFallback } from "../../src/lib/data/site";

const write = process.argv.includes("--write");

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}. See scripts/sanity/README.md.`);
    process.exit(1);
  }
  return value;
}

const oldClient = createClient({
  projectId: requireEnv("OLD_SANITY_PROJECT_ID"),
  dataset: process.env.OLD_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: process.env.OLD_SANITY_TOKEN,
  useCdn: false,
});

const newClient = createClient({
  projectId: requireEnv("NEW_SANITY_PROJECT_ID"),
  dataset: process.env.NEW_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: requireEnv("NEW_SANITY_TOKEN"),
  useCdn: false,
});

// ---- shared helpers ---------------------------------------------------

type OldPortableTextBlock = { _type: string; children?: { text?: string }[] };

function portableTextToParagraphs(body: OldPortableTextBlock[] | undefined): string[] {
  if (!Array.isArray(body)) return [];
  return body
    .map((block) => (block.children ?? []).map((span) => span.text ?? "").join(""))
    .map((text) => text.trim())
    .filter((text) => text.length > 0);
}

const EMBEDDABLE_HOSTS = ["youtube.com", "youtu.be", "vimeo.com", "loom.com", "wistia.com"];
function looksEmbeddable(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return EMBEDDABLE_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

// Cache old asset ref -> new asset id so an image referenced twice in one
// run (e.g. reused across sections) is only uploaded once.
const assetCache = new Map<string, string>();
let uploadCount = 0;

async function uploadImageFromUrl(url: string, filenameHint: string): Promise<string | null> {
  if (assetCache.has(url)) return assetCache.get(url)!;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const asset = await newClient.assets.upload("image", buffer, { filename: filenameHint });
    assetCache.set(url, asset._id);
    uploadCount += 1;
    return asset._id;
  } catch (err) {
    console.error(`  ⚠ image upload failed (${filenameHint}):`, err);
    return null;
  }
}

// Runs async tasks with a concurrency cap so 180-odd image uploads don't
// all fire at once.
async function withConcurrency<T>(items: T[], limit: number, fn: (item: T, i: number) => Promise<void>) {
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const i = cursor++;
      await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
}

// ---- 1. project sections -> full blocks[] ------------------------------

type OldSection = {
  _type: string;
  _key: string;
  caption?: string;
  title?: string;
  body?: OldPortableTextBlock[];
  url?: string;
  embedType?: string;
  desktopImageUrl?: string;
};

type PreparedBlock =
  | { kind: "richText"; heading?: string; paragraphs: string[] }
  | { kind: "fullBleedImage"; caption?: string; sourceUrl: string; assetFilename: string }
  | { kind: "video"; heading?: string; embedUrl: string }
  | { kind: "pipLinkPreview"; title: string; description?: string; url: string; linkLabel: string };

function prepareSectionBlocks(sections: OldSection[] | undefined, links: { label?: string; url?: string }[]): PreparedBlock[] {
  const prepared: PreparedBlock[] = [];
  for (const s of sections ?? []) {
    if (s._type === "textSection") {
      const paragraphs = portableTextToParagraphs(s.body);
      if (paragraphs.length > 0) prepared.push({ kind: "richText", paragraphs });
    } else if (s._type === "imageSection" && s.desktopImageUrl) {
      prepared.push({ kind: "fullBleedImage", caption: s.caption, sourceUrl: s.desktopImageUrl, assetFilename: s._key });
    } else if (s._type === "videoSection" && s.url) {
      if (looksEmbeddable(s.url)) prepared.push({ kind: "video", heading: s.title, embedUrl: s.url });
      else prepared.push({ kind: "pipLinkPreview", title: s.title || "Video", url: s.url, linkLabel: "Watch" });
    } else if (s._type === "embedSection" && s.url) {
      prepared.push({
        kind: "pipLinkPreview",
        title: s.title || "Prototype",
        description: s.embedType ? `${s.embedType} embed from the original case study` : undefined,
        url: s.url,
        linkLabel: "Open",
      });
    }
  }
  for (const link of links) {
    if (link.url) prepared.push({ kind: "pipLinkPreview", title: link.label || "Related link", url: link.url, linkLabel: "Visit" });
  }
  return prepared;
}

async function resolveBlocks(prepared: PreparedBlock[]): Promise<Record<string, unknown>[]> {
  const resolved: Record<string, unknown>[] = new Array(prepared.length);
  await withConcurrency(prepared, 5, async (block, i) => {
    if (block.kind === "richText") {
      resolved[i] = { _type: "richText", _key: randomUUID(), format: "prose", paragraphs: block.paragraphs };
    } else if (block.kind === "video") {
      resolved[i] = { _type: "video", _key: randomUUID(), heading: block.heading, embedUrl: block.embedUrl };
    } else if (block.kind === "pipLinkPreview") {
      resolved[i] = {
        _type: "pipLinkPreview",
        _key: randomUUID(),
        title: block.title,
        description: block.description,
        url: block.url,
        linkLabel: block.linkLabel,
      };
    } else if (block.kind === "fullBleedImage") {
      const assetId = write ? await uploadImageFromUrl(block.sourceUrl, block.assetFilename) : "dry-run";
      resolved[i] = {
        _type: "fullBleedImage",
        _key: randomUUID(),
        caption: block.caption,
        aspect: "wide",
        ...(assetId && assetId !== "dry-run"
          ? { image: { _type: "image", asset: { _type: "reference", _ref: assetId } } }
          : {}),
      };
    }
  });
  return resolved;
}

async function enrichProjects() {
  console.log("\n=== 1. Project blocks[] (full sections + images) ===\n");
  const oldProjects = await oldClient.fetch<Record<string, unknown>[]>(`
    *[_type == "project"]{
      title, "slug": slug.current, isPassworded, links,
      "sections": sections[]{ ..., "desktopImageUrl": desktopImage.asset->url }
    }
  `);

  for (const old of oldProjects as { title: string; slug: string; isPassworded?: boolean; links?: { label?: string; url?: string }[]; sections?: OldSection[] }[]) {
    if (old.isPassworded) {
      console.log(`Skipping ${old.title} (passworded)`);
      continue;
    }
    const id = `project-${old.slug}`;
    const prepared = prepareSectionBlocks(old.sections, old.links ?? []);
    const imageCount = prepared.filter((b) => b.kind === "fullBleedImage").length;
    console.log(
      `${write ? "Patching" : "[dry run] Would patch"} ${old.title} (${id}): ${prepared.length} blocks (${imageCount} images)`,
    );

    if (!write) continue;
    const blocks = await resolveBlocks(prepared);
    await newClient.patch(id).set({ blocks }).commit({ autoGenerateArrayKeys: true });
  }
}

// ---- 2. process tracks --------------------------------------------------

const KNOWN_DISCIPLINES = ["UI/UX", "Web Development", "Branding", "Campaigns & Marketing"];

async function enrichProcessTracks() {
  console.log("\n=== 2. Process tracks ===\n");
  const processPage = await oldClient.fetch<{
    tabs: { label: string; intro: string; steps: { title: string; body: string }[] }[];
  } | null>(`*[_type == "processPage"][0]{tabs}`);

  if (!processPage) {
    console.log("No processPage found in the old dataset — skipping.");
    return;
  }

  for (const tab of processPage.tabs) {
    const conforms = KNOWN_DISCIPLINES.includes(tab.label);
    const id = `process-${tab.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    console.log(
      `${write ? "Writing" : "[dry run] Would write"} processTrack "${tab.label}" (${id}, ${tab.steps.length} phases)` +
        (conforms ? "" : "  ⚠ not one of the four discipline options — will need reassigning in Studio"),
    );
    if (!write) continue;
    await newClient.createOrReplace({
      _type: "processTrack",
      _id: id,
      discipline: tab.label,
      summary: tab.intro,
      phases: tab.steps.map((s) => ({ _type: "phase", _key: randomUUID(), label: s.title, description: s.body })),
    });
  }
}

// ---- 3. siteSettings -----------------------------------------------------

async function enrichSiteSettings() {
  console.log("\n=== 3. Site settings (profile, metrics, about, contact) ===\n");
  const [aboutPage, contactPage, homePage] = await Promise.all([
    oldClient.fetch<{ body: { title: string; content: OldPortableTextBlock[] }[] } | null>(
      `*[_type == "aboutPage"][0]{body}`,
    ),
    oldClient.fetch<{ linkedin?: string; github?: string; behance?: string } | null>(
      `*[_type == "contactPage"][0]{linkedin, github, behance}`,
    ),
    oldClient.fetch<{
      subline?: string;
      metrics?: { label: string; value: number }[];
    } | null>(`*[_type == "homePage"][0]{subline, metrics}`),
  ]);

  const base = siteSettingsFallback;

  // homePage.metrics -> siteMetrics, matched by label rather than assuming order
  const metricByLabel = new Map((homePage?.metrics ?? []).map((m) => [m.label.toLowerCase(), m.value]));
  const siteMetrics = base.siteMetrics.map((m) => {
    const oldValue =
      m.key === "years"
        ? metricByLabel.get("yrs of exp.")
        : m.key === "projects"
          ? metricByLabel.get("projects")
          : m.key === "countries"
            ? metricByLabel.get("countries")
            : m.key === "brands"
              ? metricByLabel.get("clients")
              : undefined;
    return oldValue === undefined ? m : { ...m, value: String(oldValue), isPlaceholder: false };
  });

  // aboutPage chapters: origin-story-ish ones -> general tab, craft/approach
  // ones -> design tab. Judgment call on a 5-chapter page with no
  // structural marker for "which bucket" — matched by title keyword.
  const chapters = aboutPage?.body ?? [];
  const generalTitles = ["the earliest spark", "the calling"];
  const generalParagraphs = chapters
    .filter((c) => generalTitles.includes(c.title.toLowerCase()))
    .flatMap((c) => portableTextToParagraphs(c.content));
  const designParagraphs = chapters
    .filter((c) => !generalTitles.includes(c.title.toLowerCase()))
    .flatMap((c) => portableTextToParagraphs(c.content));

  const socials = [
    contactPage?.linkedin ? { label: "LinkedIn", href: contactPage.linkedin } : null,
    contactPage?.github ? { label: "GitHub", href: contactPage.github } : null,
    contactPage?.behance ? { label: "Behance", href: contactPage.behance } : null,
  ].filter((s): s is { label: string; href: string } => s !== null);

  const doc = {
    _type: "siteSettings",
    _id: "siteSettings",
    profile: { ...base.profile, tagline: homePage?.subline?.replace(/\s+/g, " ").trim() || base.profile.tagline },
    siteMetrics,
    about: {
      design: { heading: base.about.design.heading, paragraphs: designParagraphs.length > 0 ? designParagraphs : base.about.design.paragraphs },
      general: { heading: base.about.general.heading, paragraphs: generalParagraphs.length > 0 ? generalParagraphs : base.about.general.paragraphs },
    },
    contact: {
      email: base.contact.email,
      website: base.contact.website,
      socials: socials.length > 0 ? socials : base.contact.socials,
    },
    hobbies: base.hobbies,
    analyticsAggregate: base.analyticsAggregate,
  };

  console.log(`${write ? "Writing" : "[dry run] Would write"} siteSettings:`);
  console.log(`  tagline: "${doc.profile.tagline}"`);
  console.log(`  siteMetrics: ${doc.siteMetrics.map((m) => `${m.label}=${m.value}`).join(", ")}`);
  console.log(`  about.general paragraphs: ${doc.about.general.paragraphs.length}, about.design paragraphs: ${doc.about.design.paragraphs.length}`);
  console.log(`  socials: ${doc.contact.socials.map((s) => s.label).join(", ")}`);
  console.log(`  (email, resume, hobbies, and analytics aggregate carried over unchanged — no old-CMS equivalent)`);

  if (!write) return;
  await newClient.createOrReplace(doc);
}

// ---- 4. industries, complexity/recency, cover GIFs -----------------------

const INDUSTRIES = ["Fintech", "HealthTech", "Entertainment", "Engineering", "AI", "Events"];

// Judgment calls made from each project's real title/description/tags — see
// the six seeded industries above. A project not listed here doesn't fit
// any of them well (a craft brand, a spa, a personal identity project) and
// is left with no industry reference rather than forced into a wrong one;
// assign it by hand in Studio, adding a new industry document if needed.
const INDUSTRY_BY_SLUG: Record<string, string> = {
  "flutterbytes-conference-2025": "Events",
  "revolut-founder-mode": "Fintech",
  corridor: "Fintech",
  "favbots-website": "Engineering",
  "shiplat-dashboard": "Engineering",
  "didii-ai": "AI",
  probity: "Engineering",
  "primeridge-website": "Engineering",
  "allowance-ai": "AI",
  "raptures-and-rapkids": "Entertainment",
  switchboard: "AI",
  "ample-market": "AI",
  moniematch: "Fintech",
};

function industryId(name: string): string {
  return `industry-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

async function enrichIndustriesAndScores() {
  console.log("\n=== 4. Industries, complexity/recency, cover GIFs ===\n");

  for (const name of INDUSTRIES) {
    console.log(`${write ? "Writing" : "[dry run] Would write"} industry "${name}" (${industryId(name)})`);
    if (write) {
      await newClient.createOrReplace({ _type: "industry", _id: industryId(name), name, slug: { _type: "slug", current: name.toLowerCase() } });
    }
  }

  const oldProjects = await oldClient.fetch<
    { title: string; slug: string; complexity: number | null; recency: number | null; coverGifUrl: string | null }[]
  >(`*[_type == "project" && isPassworded != true]{
    title, "slug": slug.current, complexity, recency, "coverGifUrl": coverGif.asset->url
  }`);

  for (const old of oldProjects) {
    const id = `project-${old.slug}`;
    const industryName = INDUSTRY_BY_SLUG[old.slug];
    const patch: Record<string, unknown> = {};
    if (old.complexity !== null) patch.complexity = old.complexity;
    if (old.recency !== null) patch.recency = old.recency;
    if (industryName) patch.industry = { _type: "reference", _ref: industryId(industryName) };

    console.log(
      `${write ? "Patching" : "[dry run] Would patch"} ${old.title} (${id}): ` +
        `industry=${industryName ?? "(none — no good fit)"}  complexity=${old.complexity}  recency=${old.recency}` +
        (old.coverGifUrl ? "  +coverGif" : ""),
    );

    if (!write) continue;

    if (old.coverGifUrl) {
      try {
        const res = await fetch(old.coverGifUrl);
        const buffer = Buffer.from(await res.arrayBuffer());
        const asset = await newClient.assets.upload("image", buffer, { filename: `${id}-cover.gif` });
        patch.coverGif = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
      } catch (err) {
        console.error(`  ⚠ cover GIF upload failed for ${old.title}:`, err);
      }
    }

    if (Object.keys(patch).length > 0) {
      await newClient.patch(id).set(patch).commit();
    }
  }
}

const SECTIONS: Record<string, () => Promise<void>> = {
  projects: enrichProjects,
  process: enrichProcessTracks,
  settings: enrichSiteSettings,
  industries: enrichIndustriesAndScores,
};

async function main() {
  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const only = onlyArg ? onlyArg.replace("--only=", "").split(",") : Object.keys(SECTIONS);

  for (const key of only) {
    const fn = SECTIONS[key];
    if (!fn) {
      console.error(`Unknown section "${key}". Valid: ${Object.keys(SECTIONS).join(", ")}`);
      process.exit(1);
    }
    await fn();
  }

  if (!write) {
    console.log("\nDry run only — nothing written. Re-run with --write once this looks right.");
  } else {
    console.log(`\nDone. Uploaded ${uploadCount} new image asset(s).`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
