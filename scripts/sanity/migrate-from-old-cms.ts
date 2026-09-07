/**
 * Migrates `project` documents from the OLD portfolio's Sanity project into
 * this project's restructured schema.
 *
 * The field mapping in mapOldProjectToNew() below is verified against a
 * real introspection of the ewm24ohk dataset, not a guess — if you point
 * this at a different old project, re-run introspect-old-cms.ts first and
 * check the field list still matches. See scripts/sanity/README.md for the
 * full workflow, including why About/Process content is better moved by
 * hand.
 *
 * Dry-run by default — prints what it would write, writes nothing. Pass
 * --write to actually create documents in the new dataset.
 *
 * Usage:
 *   OLD_SANITY_PROJECT_ID=xxxx OLD_SANITY_DATASET=production [OLD_SANITY_TOKEN=xxxx] \
 *   NEW_SANITY_PROJECT_ID=yyyy NEW_SANITY_DATASET=production NEW_SANITY_TOKEN=yyyy \
 *     npm run sanity:migrate            # dry run
 *     npm run sanity:migrate -- --write # actually writes
 */
import { randomUUID } from "node:crypto";
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

/**
 * Field mapping verified against a real introspection of the old dataset
 * (ewm24ohk) — not a guess. Shape:
 *   title, slug, description, tags[]->{label,slug}, coverImage (asset ref),
 *   logo (asset ref), completedAt ("Month Year" string), links[]{label,url},
 *   isPassworded, sections[] of _type imageSection|textSection|videoSection|embedSection.
 *
 * Old-CMS-only fields with no equivalent here (complexity, recency, logo)
 * are dropped. Fields this schema needs that the old one never had
 * (industry, projectType, role, techStack, scale, accent,
 * processDisciplines) are left as clearly-fake placeholders — grep the
 * new dataset for "TODO" after writing and fix each one in Studio.
 */
type OldPortableTextBlock = {
  _type: string;
  style?: string;
  children?: { text?: string }[];
};

type OldSection = {
  _type: string;
  _key: string;
  caption?: string;
  title?: string;
  body?: OldPortableTextBlock[];
  url?: string;
  embedType?: string;
};

function portableTextToParagraphs(body: OldPortableTextBlock[] | undefined): string[] {
  if (!Array.isArray(body)) return [];
  return body
    .map((block) => (block.children ?? []).map((span) => span.text ?? "").join(""))
    .map((text) => text.trim())
    .filter((text) => text.length > 0);
}

function sectionsToBlocks(sections: OldSection[] | undefined): Record<string, unknown>[] {
  if (!Array.isArray(sections)) return [];

  const paragraphs = sections
    .filter((s) => s._type === "textSection")
    .flatMap((s) => portableTextToParagraphs(s.body));

  const blocks: Record<string, unknown>[] = [];
  if (paragraphs.length > 0) {
    blocks.push({ _type: "richText", _key: randomUUID(), format: "prose", paragraphs });
  }

  for (const s of sections) {
    if (s._type === "embedSection" && s.url) {
      blocks.push({
        _type: "pipLinkPreview",
        _key: randomUUID(),
        title: s.title || "Prototype",
        description: s.embedType ? `${s.embedType} embed from the original case study` : undefined,
        url: s.url,
        linkLabel: "Open",
      });
    }
  }

  return blocks;
}

function yearFromCompletedAt(completedAt: unknown, createdAt: string): number {
  const match = typeof completedAt === "string" ? completedAt.match(/\d{4}/) : null;
  return match ? Number(match[0]) : new Date(createdAt).getFullYear();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapOldProjectToNew(old: any) {
  const slug = old.slug?.current ?? String(old.title ?? old._id).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const links: { label?: string; url?: string }[] = Array.isArray(old.links) ? old.links : [];

  const blocks = sectionsToBlocks(old.sections);
  for (const link of links) {
    if (!link.url) continue;
    blocks.push({
      _type: "pipLinkPreview",
      _key: randomUUID(),
      title: link.label || "Related link",
      url: link.url,
      linkLabel: "Visit",
    });
  }

  return {
    _type: "project",
    _id: `project-${slug}`,
    name: old.title ?? "Untitled",
    slug: { _type: "slug", current: slug },
    oneLiner: old.description ?? "",
    coverImageUrl: old.coverImageUrl as string | undefined,
    industry: "TODO — set the real industry in Studio",
    tags: Array.isArray(old.tags) ? old.tags.map((t: { label?: string }) => t.label).filter(Boolean) : [],
    projectType: ["Website"],
    year: yearFromCompletedAt(old.completedAt, old._createdAt),
    role: "TODO — set the real role in Studio",
    techStack: [],
    scale: { _type: "projectScale", pages: 0, entities: 0, roles: 0 },
    blocks,
    _isPassworded: Boolean(old.isPassworded),
  };
}

async function main() {
  const oldProjects = await oldClient.fetch<Record<string, unknown>[]>(
    `*[_type == "project"]{..., tags[]->{label}, "coverImageUrl": coverImage.asset->url}`,
  );
  console.log(`Found ${oldProjects.length} project document(s) in the old dataset.\n`);

  if (oldProjects.length === 0) {
    console.log('No documents with _type == "project" — check introspect output for the right type name.');
    return;
  }

  const mapped = oldProjects.map(mapOldProjectToNew);
  const passworded = mapped.filter((d) => d._isPassworded);
  const toMigrate = mapped.filter((d) => !d._isPassworded);

  if (passworded.length > 0) {
    console.log(
      `⚠ Skipping ${passworded.length} passworded project(s) — this new site has no password-gate\n` +
        "  feature, so these are left out by default (client confidentiality). Add them by hand\n" +
        "  in Studio if you want them public:",
    );
    for (const doc of passworded) console.log(`    - ${doc.name}`);
    console.log("");
  }

  for (const doc of toMigrate) {
    console.log(`${write ? "Writing" : "[dry run] Would write"}: ${doc.name}  (${doc._id})`);
    console.log(`  year=${doc.year}  tags=[${doc.tags.join(", ")}]  blocks=${doc.blocks.length}`);
    if (doc.coverImageUrl) console.log(`  cover image will be re-uploaded from ${doc.coverImageUrl}`);
    else console.log("  ⚠ no cover image on the old document");
  }

  console.log(
    `\nNote: this migrates project metadata, one consolidated text block, and any links/embeds\n` +
      "as pipLinkPreview blocks. It does NOT migrate the old site's in-body images or videos\n" +
      `(168 image sections total across these projects) — that's a separate, larger follow-up.\n` +
      "Every migrated project needs industry/role/projectType/scale/accent set by hand in Studio.",
  );

  if (!write) {
    console.log("\nDry run only — nothing written. Re-run with --write once the mapping above looks right.");
    return;
  }

  for (const doc of toMigrate) {
    const { _isPassworded, coverImageUrl, ...rest } = doc;
    void _isPassworded;
    let coverImage: Record<string, unknown> | undefined;
    if (coverImageUrl) {
      try {
        const res = await fetch(coverImageUrl);
        const buffer = Buffer.from(await res.arrayBuffer());
        const asset = await newClient.assets.upload("image", buffer, { filename: `${doc._id}-cover` });
        coverImage = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
      } catch (err) {
        console.error(`  ⚠ cover image upload failed for ${doc.name}:`, err);
      }
    }
    await newClient.createOrReplace({ ...rest, ...(coverImage ? { coverImage } : {}) });
    console.log(`Wrote ${doc.name}`);
  }

  console.log(`\nDone — wrote ${toMigrate.length} project document(s) to the new dataset.`);
  console.log(
    "Now open Studio (/studio) and, for each project: set industry, role, projectType, scale,\n" +
      "accent, and expand blocks[] beyond the single richText dump this script created.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
