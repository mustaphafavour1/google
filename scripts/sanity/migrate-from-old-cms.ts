/**
 * Migrates `project` documents from the OLD portfolio's Sanity project into
 * this project's restructured schema.
 *
 * Run introspect-old-cms.ts FIRST and check its field list against the
 * guesses in mapOldProjectToNew() below — every old-CMS schema is
 * different, so treat this as a starting point to adjust, not a sure
 * thing. See scripts/sanity/README.md for the full workflow, including why
 * About/Process content is better moved by hand.
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
 * TODO — verify every field-name guess here against your actual old schema
 * (run `npm run sanity:introspect` first, read its output, then adjust).
 * Several common alternate names are tried per field as a starting point,
 * but don't trust this blindly.
 *
 * Fields the old schema almost certainly has no equivalent for (scale,
 * accent, projectType, and the blocks[] page builder beyond a single
 * richText dump of the old body copy) are left for you to fill in by hand
 * in Studio after import — that's expected, not a bug in this script.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapOldProjectToNew(old: any) {
  const slug = old.slug?.current ?? old.slug ?? String(old.title ?? old.name ?? old._id).toLowerCase().replace(/\s+/g, "-");
  const oldBody = old.body ?? old.content ?? old.description;

  return {
    _type: "project",
    _id: `project-${slug}`,
    name: old.title ?? old.name ?? "Untitled",
    slug: { _type: "slug", current: slug },
    oneLiner: old.excerpt ?? old.summary ?? old.tagline ?? "",
    industry: old.industry ?? old.category ?? "",
    tags: old.tags ?? old.categories ?? [],
    projectType: "Website",
    year: old.year ?? (old._createdAt ? new Date(old._createdAt).getFullYear() : new Date().getFullYear()),
    role: old.role ?? old.myRole ?? "",
    techStack: old.techStack ?? old.tools ?? old.stack ?? [],
    scale: { _type: "projectScale", pages: 0, entities: 0, roles: 0 },
    blocks: [
      oldBody
        ? {
            _type: "richText",
            _key: randomUUID(),
            format: "prose",
            paragraphs: Array.isArray(oldBody) ? [] : [String(oldBody)],
          }
        : null,
    ].filter(Boolean),
  };
}

async function main() {
  const oldProjects = await oldClient.fetch<Record<string, unknown>[]>(`*[_type == "project"]`);
  console.log(`Found ${oldProjects.length} project document(s) in the old dataset.\n`);

  if (oldProjects.length === 0) {
    console.log('No documents with _type == "project" — check introspect output for the right type name.');
    return;
  }

  const mapped = oldProjects.map(mapOldProjectToNew);

  for (const doc of mapped) {
    console.log(`${write ? "Writing" : "[dry run] Would write"}: ${doc.name}  (${doc._id})`);
    if (doc.blocks.length === 0) {
      console.log("  ⚠ no body/content field found — this project will need its blocks[] built by hand");
    }
  }

  if (!write) {
    console.log("\nDry run only — nothing written. Re-run with --write once the mapping above looks right.");
    return;
  }

  const tx = newClient.transaction();
  for (const doc of mapped) tx.createOrReplace(doc);
  await tx.commit();

  console.log(`\nDone — wrote ${mapped.length} project document(s) to the new dataset.`);
  console.log(
    "Now open Studio (/studio) and, for each project: set projectType, scale, accent,\n" +
      "and rebuild blocks[] beyond the single richText dump this script created.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
