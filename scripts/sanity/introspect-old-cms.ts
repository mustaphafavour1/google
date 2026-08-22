/**
 * Connects to the OLD Sanity project (read-only) and reports what's there:
 * every distinct document `_type`, how many of each exist, and the field
 * names on one sample document per type.
 *
 * Run this FIRST, before touching migrate-from-old-cms.ts — the migration
 * script's field mapping should be based on what's actually in the old
 * dataset, not a guess. See scripts/sanity/README.md for the full workflow.
 *
 * Usage:
 *   OLD_SANITY_PROJECT_ID=xxxx OLD_SANITY_DATASET=production \
 *   [OLD_SANITY_TOKEN=xxxx] npm run sanity:introspect
 */
import { createClient } from "@sanity/client";

const projectId = process.env.OLD_SANITY_PROJECT_ID;
const dataset = process.env.OLD_SANITY_DATASET || "production";
const token = process.env.OLD_SANITY_TOKEN;

if (!projectId) {
  console.error(
    "Missing OLD_SANITY_PROJECT_ID.\n\n" +
      "Find it at sanity.io/manage (select the old portfolio's project) or in that\n" +
      "repo's sanity.config.ts / .env file. See scripts/sanity/README.md.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

function summarizeValue(value: unknown): string {
  if (Array.isArray(value)) return `array(${value.length})`;
  if (value && typeof value === "object") {
    if ("_type" in value) return `${(value as { _type: string })._type}`;
    return "object";
  }
  return typeof value;
}

async function main() {
  const types = await client.fetch<string[]>(
    `array::unique(*[!(_id in path("drafts.**"))]._type)`,
  );

  if (types.length === 0) {
    console.log(`No documents found in ${projectId}/${dataset}. Wrong project or dataset name?`);
    return;
  }

  console.log(`\nFound ${types.length} document type(s) in ${projectId}/${dataset}:\n`);

  for (const type of [...types].sort()) {
    const count = await client.fetch<number>(`count(*[_type == $type])`, { type });
    const sample = await client.fetch<Record<string, unknown> | null>(
      `*[_type == $type][0]`,
      { type },
    );

    console.log(`— ${type}  (${count} document${count === 1 ? "" : "s"})`);
    if (sample) {
      for (const [key, value] of Object.entries(sample)) {
        if (key.startsWith("_")) continue;
        console.log(`    ${key}: ${summarizeValue(value)}`);
      }
    }
    console.log("");
  }

  console.log(
    "Next: open migrate-from-old-cms.ts and check the field-name guesses in\n" +
      "mapOldProjectToNew() against the field list above, then run with --write.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
