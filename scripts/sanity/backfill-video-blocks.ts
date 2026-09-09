/**
 * One-off, additive backfill for a gap found in the original migration:
 * enrich-from-old-cms.ts's videoSection handling only ever read a
 * `videoSection`'s external `url` field, so every old-CMS video that was a
 * native file upload (`sourceType: "upload"`, no `url`) was silently
 * dropped — 10 of the old CMS's 14 video sections, across 7 projects.
 *
 * Re-running enrich-from-old-cms.ts's project step now isn't safe: it does
 * a wholesale `.set({ blocks })` that replaces a project's entire blocks[]
 * array, which would blow away every hand-edit made in Studio since the
 * original migration. This script only APPENDs the missing video blocks
 * (via Sanity's array `append`, which never touches existing items) onto
 * each affected project's current blocks[] — nothing else changes.
 *
 * Idempotent: each appended block gets a deterministic _key derived from
 * the old section's own _key, so re-running this after a first --write
 * skips anything already backfilled instead of duplicating it.
 *
 * Dry-run by default — prints a summary, uploads and writes nothing.
 * --write to actually upload the video files and append the blocks.
 *
 * Usage: same env vars as enrich-from-old-cms.ts (see scripts/sanity/README.md).
 *   npm run sanity:backfill-videos            # dry run
 *   npm run sanity:backfill-videos -- --write # actually writes
 */
import { createClient } from "@sanity/client";

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

type OldVideoSection = {
  _key: string;
  title?: string;
  fileUrl?: string;
  fileExt?: string;
};

type OldProject = {
  title: string;
  slug: string;
  isPassworded?: boolean;
  sections?: OldVideoSection[];
};

async function uploadVideo(url: string, filenameHint: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const asset = await newClient.assets.upload("file", buffer, { filename: filenameHint });
    return asset._id;
  } catch (err) {
    console.error(`  ⚠ video upload failed (${filenameHint}):`, err);
    return null;
  }
}

async function main() {
  const oldProjects = await oldClient.fetch<OldProject[]>(`
    *[_type == "project"]{
      title, "slug": slug.current, isPassworded,
      "sections": sections[_type == "videoSection"]{
        _key, title,
        "fileUrl": file.asset->url,
        "fileExt": file.asset->extension
      }
    }
  `);

  let appended = 0;
  let toAppend = 0;

  for (const old of oldProjects) {
    if (old.isPassworded) continue;
    const videoSections = (old.sections ?? []).filter((s) => s.fileUrl);
    if (videoSections.length === 0) continue;

    const id = `project-${old.slug}`;
    const current = await newClient.fetch<{ blocks?: { _key: string }[] } | null>(
      `*[_id == $id][0]{ blocks[]{ _key } }`,
      { id },
    );
    if (!current) {
      console.log(`⚠ ${old.title} (${id}) not found in the new dataset — skipping`);
      continue;
    }
    const existingKeys = new Set((current.blocks ?? []).map((b) => b._key));

    for (const section of videoSections) {
      const blockKey = `video-backfill-${section._key}`;
      const label = section.title || "(untitled)";
      if (existingKeys.has(blockKey)) {
        console.log(`  already backfilled — ${old.title}: "${label}"`);
        continue;
      }

      toAppend += 1;
      console.log(`${write ? "Appending" : "[dry run] Would append"} video to ${old.title} (${id}): "${label}"`);
      if (!write) continue;

      const assetId = await uploadVideo(section.fileUrl!, `${section._key}.${section.fileExt || "mp4"}`);
      if (!assetId) continue;

      await newClient
        .patch(id)
        .setIfMissing({ blocks: [] })
        .append("blocks", [
          {
            _type: "video",
            _key: blockKey,
            heading: section.title,
            file: { _type: "file", asset: { _type: "reference", _ref: assetId } },
          },
        ])
        .commit();
      appended += 1;
    }
  }

  if (!write) {
    console.log(`\nDry run only — ${toAppend} video block(s) would be appended. Re-run with --write once this looks right.`);
  } else {
    console.log(`\nDone. Appended ${appended} video block(s).`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
