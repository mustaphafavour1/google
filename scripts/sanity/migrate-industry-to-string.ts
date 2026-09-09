/**
 * One-off migration: `project.industry` moved from a reference to a
 * separate `industry` document type into a plain free-text string (so
 * Studio editors can type a new industry directly instead of being
 * limited to picking from an existing list). The app already reads it
 * safely either way (see the `coalesce(industry->name, industry)` in
 * sanity/queries.ts), but Studio's own project-list preview does not
 * tolerate a reference object in that slot and throws "Invalid preview
 * config" until every project is re-saved in the new shape — this script
 * does that re-save without needing to open each one by hand.
 *
 * For each project, dereferences the current `industry` (if it's still a
 * reference) to its name and patches the field to that plain string.
 * Projects already migrated (industry is already a string) are skipped —
 * safe to re-run.
 *
 * Dry-run by default. --write to actually patch.
 * Usage: same NEW_SANITY_* env vars as enrich-from-old-cms.ts.
 *   npm run sanity:migrate-industry            # dry run
 *   npm run sanity:migrate-industry -- --write # actually writes
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

const client = createClient({
  projectId: requireEnv("NEW_SANITY_PROJECT_ID"),
  dataset: process.env.NEW_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: requireEnv("NEW_SANITY_TOKEN"),
  useCdn: false,
});

async function main() {
  const projects = await client.fetch<
    { _id: string; name: string; industryRaw: unknown; industryName: string | null }[]
  >(`*[_type == "project"]{ _id, name, "industryRaw": industry, "industryName": industry->name }`);

  let patched = 0;
  let skipped = 0;
  let unresolved = 0;

  for (const p of projects) {
    if (typeof p.industryRaw === "string") {
      skipped += 1;
      continue;
    }
    if (!p.industryName) {
      console.log(`⚠ ${p.name} (${p._id}): industry reference didn't resolve to a name — skipping, fix by hand`);
      unresolved += 1;
      continue;
    }
    console.log(`${write ? "Patching" : "[dry run] Would patch"} ${p.name} (${p._id}): industry -> "${p.industryName}"`);
    patched += 1;
    if (!write) continue;
    await client.patch(p._id).set({ industry: p.industryName }).commit();
  }

  console.log(
    `\n${write ? "Done." : "Dry run only — nothing written."} ${patched} patched, ${skipped} already strings, ${unresolved} unresolved.`,
  );
  if (!write && patched > 0) console.log("Re-run with --write once this looks right.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
