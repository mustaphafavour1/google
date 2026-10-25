/**
 * One-off: creates two sample "jobApplicationVariant" documents (the
 * tailored-portfolio feature at /apply/{slug}) — Vercel and Chowdeck.
 *
 * Project picks and intro-note copy are reasoned guesses at what's
 * relevant to each company (Vercel: AI-infra/dev-tooling dashboards;
 * Chowdeck: logistics/payments/Nigerian-market product work) — edit
 * freely in Studio afterward, that's the whole point of this feature.
 *
 * Safe to run more than once: refuses to touch a variant that already
 * exists unless you also pass --force.
 *
 * Dry-run by default — prints what it would create, writes nothing.
 *
 * Usage:
 *   npm run sanity:seed-job-applications            # dry run
 *   npm run sanity:seed-job-applications -- --write # actually writes
 *
 * Reads NEW_SANITY_TOKEN (and optionally NEW_SANITY_PROJECT_ID /
 * NEW_SANITY_DATASET) from .env.local, same as the other sanity:*
 * scripts — see scripts/sanity/README.md for token setup.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@sanity/client";

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

const write = process.argv.includes("--write");
const force = process.argv.includes("--force");

const projectId = process.env.NEW_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "rycezmf9";
const dataset = process.env.NEW_SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token: requireEnv("NEW_SANITY_TOKEN"),
  useCdn: false,
});

function ref(projectId: string) {
  return { _type: "reference" as const, _ref: projectId };
}

const variants = [
  {
    _id: "jobapp-vercel",
    _type: "jobApplicationVariant" as const,
    companyName: "Vercel",
    slug: { current: "vercel", _type: "slug" as const },
    roleTitle: "Senior Product Designer",
    introNote:
      "I build dense, developer-facing tools the way Vercel ships — fast, opinionated, and grounded in a real design system rather than one-off screens. These case studies show that same discipline across AI infrastructure, internal tooling, and cross-border fintech dashboards.",
    selectedProjects: [
      ref("project-switchboard"),
      ref("project-ensemble"),
      ref("project-corridor"),
    ],
  },
  {
    _id: "jobapp-chowdeck",
    _type: "jobApplicationVariant" as const,
    companyName: "Chowdeck",
    slug: { current: "chowdeck", _type: "slug" as const },
    roleTitle: "Senior Product Designer",
    introNote:
      "I design for real operational complexity — logistics dashboards, payout flows, and consumer apps built for the Nigerian market specifically, not adapted from somewhere else. These case studies show that same ground-level fluency across shipping, payments, and B2C products.",
    selectedProjects: [
      ref("project-shiplat-dashboard"),
      ref("project-corridor"),
      ref("project-probity"),
    ],
  },
];

async function main() {
  for (const doc of variants) {
    const existing = await client.fetch<{ _id: string } | null>(`*[_type == "jobApplicationVariant" && _id == $id][0]{ _id }`, {
      id: doc._id,
    });

    if (existing && !force) {
      console.error(
        `A jobApplicationVariant document with _id "${doc._id}" already exists. Refusing to overwrite it —\n` +
          "any edits made in Studio since it was seeded would be silently wiped. Pass --force to reset it.",
      );
      continue;
    }

    console.log(`${write ? "Will create" : "[dry run] Would create"} "${doc.companyName}" (${doc._id})`);
    console.log(`  slug=/apply/${doc.slug.current}  role=${doc.roleTitle}`);
    console.log(`  projects=${doc.selectedProjects.map((p) => p._ref).join(", ")}`);

    if (!write) continue;

    await client.createOrReplace(doc);
    console.log(`  -> created.`);
  }

  if (!write) {
    console.log("\nDry run only — re-run with --write once this looks right.");
  } else {
    console.log("\nDone. Visit /apply/vercel and /apply/chowdeck (or /?jd=vercel, /?jd=chowdeck for the hero).");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
