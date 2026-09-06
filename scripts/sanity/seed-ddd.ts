/**
 * Bulk-seeds Daily Design Dose entries from a local folder of images —
 * no more one-at-a-time uploads through Studio.
 *
 * Each filename must encode a date (see parseDateFromFilename() for the
 * exact patterns understood). Images are grouped into dddWeek ("upload
 * batch") documents of --batch-size images each, chunked in chronological
 * order, with `week` continuing from whatever batch number already exists
 * live so repeated runs don't collide.
 *
 * Dry-run by default — parses and prints the plan, uploads and writes
 * nothing. Pass --write to actually upload images and create documents.
 * Files already seeded (by filename, not date — some days from ~Jan 2025
 * have two images) are skipped automatically; pass --force to re-seed
 * them anyway.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=xxxx npx tsx scripts/sanity/seed-ddd.ts ./my-folder
 *   SANITY_WRITE_TOKEN=xxxx npx tsx scripts/sanity/seed-ddd.ts ./my-folder --write
 *   npm run sanity:seed-ddd -- ./my-folder --write
 *
 * NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET default to this
 * portfolio's own live project (rycezmf9 / production) — override via env
 * var or .env.local only if that ever changes. SANITY_WRITE_TOKEN has no
 * default — create one at sanity.io/manage -> your project -> API ->
 * Tokens -> Add API token ("Editor" permission is enough) and pass it
 * inline as shown above. See scripts/sanity/README.md for the full
 * walkthrough.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { extname, join } from "node:path";
import { createClient } from "@sanity/client";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);
const MONTH_NAMES = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

function loadDotEnvLocal() {
  const path = join(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(line);
    if (!match) continue;
    const [, key, rawValue] = match;
    const value = rawValue.replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadDotEnvLocal();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}. See scripts/sanity/README.md.`);
    process.exit(1);
  }
  return value;
}

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const write = process.argv.includes("--write");
const force = process.argv.includes("--force");
const batchSizeArg = process.argv.find((a) => a.startsWith("--batch-size="));
const BATCH_SIZE = batchSizeArg ? Number(batchSizeArg.split("=")[1]) : 50;
const folder = args[0];

if (!folder) {
  console.error("Usage: npm run sanity:seed-ddd -- <folder> [--write] [--force] [--batch-size=50]");
  process.exit(1);
}
if (!existsSync(folder)) {
  console.error(`Folder not found: ${folder}`);
  process.exit(1);
}

/**
 * Tries a fixed set of unambiguous patterns, in order. Two-digit-year and
 * MM/DD-vs-DD/MM formats are deliberately NOT guessed — the date range
 * (May 2024 to May 2025) crosses the same month name twice a year apart,
 * so a wrong guess would silently misfile a real post. Returns null (not
 * a throw) so the caller can collect every failure before exiting.
 */
function parseDateFromFilename(filename: string): string | null {
  const base = filename.replace(extname(filename), "");

  let m = /(\d{4})[-_](\d{1,2})[-_](\d{1,2})/.exec(base); // 2024-05-14 / 2024_05_14
  if (m) return toIsoDate(Number(m[1]), Number(m[2]), Number(m[3]));

  m = /(\d{1,2})[-_](\d{1,2})[-_](\d{4})/.exec(base); // 05-14-2024 (MM-DD-YYYY)
  if (m) return toIsoDate(Number(m[3]), Number(m[1]), Number(m[2]));

  m = new RegExp(`(${MONTH_NAMES.join("|")})\\D{0,3}(\\d{1,2})\\D{1,3}(\\d{4})`, "i").exec(base); // May 14 2024 / May14_2024
  if (m) {
    const monthIndex = MONTH_NAMES.indexOf(m[1].toLowerCase());
    return toIsoDate(Number(m[3]), monthIndex + 1, Number(m[2]));
  }

  return null;
}

function toIsoDate(year: number, month: number, day: number): string | null {
  if (year < 2000 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

async function main() {
  // Filenames are validated before anything Sanity-related is required, so
  // a naming mistake surfaces immediately — no token needed just to check.
  const files = readdirSync(folder).filter((f) => IMAGE_EXTENSIONS.has(extname(f).toLowerCase()));
  if (files.length === 0) {
    console.error(`No image files (${[...IMAGE_EXTENSIONS].join(", ")}) found in ${folder}`);
    process.exit(1);
  }

  const parsed: { file: string; date: string }[] = [];
  const failed: string[] = [];
  for (const file of files) {
    const date = parseDateFromFilename(file);
    if (date) parsed.push({ file, date });
    else failed.push(file);
  }

  if (failed.length > 0) {
    console.error(`\nCouldn't parse a date from ${failed.length} filename(s) — fix these names and re-run:`);
    for (const f of failed) console.error(`  ${f}`);
    console.error(`\nUnderstood patterns: YYYY-MM-DD, MM-DD-YYYY, "Month DD YYYY" (e.g. May 14 2024).`);
    process.exit(1);
  }

  parsed.sort((a, b) => a.date.localeCompare(b.date));

  console.log(`Parsed ${parsed.length} file(s):`);
  for (const p of parsed) console.log(`  ${p.date}  <-  ${p.file}`);

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "rycezmf9";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = requireEnv("SANITY_WRITE_TOKEN");
  const client = createClient({ projectId, dataset, apiVersion: "2025-01-01", token, useCdn: false });

  // Dedup keys on the source filename, not the date — from ~Jan 2025, some
  // days have two images (a cover + a main image, named with a trailing
  // letter like 2025-01-15b), so two different files can share a date on
  // purpose and both need to seed.
  const existing = await client.fetch<{ week: number; filenames: string[] }[]>(
    `*[_type == "dddWeek"]{ week, "filenames": images[].sourceFilename }`,
  );
  const existingFilenames = new Set(existing.flatMap((w) => w.filenames || []));
  const maxWeek = existing.reduce((max, w) => Math.max(max, w.week ?? 0), 0);

  const toSeed = force ? parsed : parsed.filter((p) => !existingFilenames.has(p.file));
  const skipped = parsed.length - toSeed.length;
  if (skipped > 0) {
    console.log(`\nSkipping ${skipped} file(s) already seeded by name (pass --force to re-seed anyway).`);
  }

  if (toSeed.length === 0) {
    console.log("\nNothing new to seed.");
    return;
  }

  const batches: { file: string; date: string }[][] = [];
  for (let i = 0; i < toSeed.length; i += BATCH_SIZE) batches.push(toSeed.slice(i, i + BATCH_SIZE));

  console.log(
    `\n${write ? "Will create" : "[dry run] Would create"} ${batches.length} batch document(s), ` +
      `batch #${maxWeek + 1}-#${maxWeek + batches.length}, ${toSeed.length} image(s) total.`,
  );

  if (!write) {
    console.log("\nDry run only — re-run with --write to actually upload and create documents.");
    return;
  }

  let uploaded = 0;
  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    const images = [];
    for (const item of batch) {
      uploaded += 1;
      process.stdout.write(`  [${uploaded}/${toSeed.length}] uploading ${item.file}...`);
      const asset = await client.assets.upload("image", readFileSync(join(folder, item.file)), {
        filename: item.file,
      });
      console.log(" done");
      images.push({
        _type: "dddImage",
        _key: asset._id.replace(/[^a-zA-Z0-9]/g, "").slice(-24),
        image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
        date: item.date,
        sourceFilename: item.file,
      });
    }
    const week = maxWeek + 1 + b;
    await client.create({ _type: "dddWeek", week, images });
    console.log(`  Created batch #${week} (${images.length} images).`);
  }

  console.log(`\nDone — seeded ${toSeed.length} image(s) across ${batches.length} batch document(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
