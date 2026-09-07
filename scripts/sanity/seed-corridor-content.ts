/**
 * One-off: appends the 8 new Corridor case-study content blocks (What
 * Birthed It, The Recontextualization, Target Audience, Use Case, Design
 * Decisions, Changes Made, Built With AI, and a closing metrics row) to the
 * Corridor project's existing `blocks` array. Never replaces or reorders
 * what's already there — new blocks land at the end so they can be
 * rearranged in Studio afterward.
 *
 * Dry-run by default — prints the plan, writes nothing. Pass --write to
 * actually patch the document. Re-running is safe: any of these 8 headings
 * already present among Corridor's existing blocks is skipped (pass
 * --force to append duplicates anyway).
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=xxxx npx tsx scripts/sanity/seed-corridor-content.ts
 *   SANITY_WRITE_TOKEN=xxxx npx tsx scripts/sanity/seed-corridor-content.ts --write
 *   npm run sanity:seed-corridor -- --write
 *
 * NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET default to this
 * portfolio's own live project (rycezmf9 / production) — override via env
 * var or .env.local only if that ever changes. SANITY_WRITE_TOKEN has no
 * default — create one at sanity.io/manage -> your project -> API ->
 * Tokens -> Add API token ("Editor" permission is enough) and pass it
 * inline as shown above. See scripts/sanity/README.md for the full
 * walkthrough.
 */
import { readFileSync, existsSync } from "node:fs";
import { randomUUID } from "node:crypto";
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

type PortableTextBlock = {
  _type: "block";
  _key: string;
  style: "normal";
  markDefs: [];
  children: { _type: "span"; _key: string; text: string; marks: [] }[];
};

type RichTextBlock = {
  _type: "richText";
  _key: string;
  heading: string;
  content: PortableTextBlock[];
};

type SideBySideCardsBlock = {
  _type: "sideBySideCards";
  _key: string;
  heading: string;
  cards: { _key: string; title: string; body: string; tone: "default" | "primary" }[];
};

type MetricsRowBlock = {
  _type: "metricsRow";
  _key: string;
  metrics: { _key: string; label: string; value: string }[];
};

type NewBlock = RichTextBlock | SideBySideCardsBlock | MetricsRowBlock;

function paragraph(text: string): PortableTextBlock {
  return {
    _type: "block",
    _key: randomUUID(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: randomUUID(), text, marks: [] }],
  };
}

function richText(heading: string, ...paragraphs: string[]): RichTextBlock {
  return { _type: "richText", _key: randomUUID(), heading, content: paragraphs.map(paragraph) };
}

const NEW_BLOCKS: NewBlock[] = [
  richText(
    "What Birthed It",
    "Corridor started as a recontextualization exercise. Early in my portfolio work I kept running into the same wall: some of the most complex, senior-level systems I've designed professionally are locked behind NDAs I can never show. Corridor is the answer to that; a genuinely new product, built from scratch, that reproduces the same order of operational complexity as a real system I designed for an agent-banking platform, without touching/showing a single line of the original.",
  ),
  {
    _type: "sideBySideCards",
    _key: randomUUID(),
    heading: "The Recontextualization",
    cards: [
      {
        _key: randomUUID(),
        title: "Before",
        tone: "default",
        body: "A core banking dashboard for an agent-banking model: three roles (Super Admin, Admin, Agent), onboarding end-customers and field agents, transaction management, KYC verification, audit and reporting, bulk actions. NDA-protected, Nigeria-specific and something I can never show.",
      },
      {
        _key: randomUUID(),
        title: "After",
        tone: "primary",
        body: "The same operational shape, transposed and globalized: agents become payout partners spread across countries instead of states, transaction management becomes multi-currency corridor routing, and KYC becomes full KYC/KYB plus sanctions screening for a fictional global operator instead of one regional business.",
      },
    ],
  },
  richText(
    "Target Audience",
    "Corridor isn't for the person sending money; it's for the company standing behind that transfer. Think a compliance lead screening a flagged transaction, a regional operations manager watching corridor-level liquidity, or a payout partner in Lagos confirming a disbursement against their float. Three distinct roles, one shared source of truth.",
  ),
  richText(
    "Use Case",
    "Walk one transfer through the system: a sender in the UK initiates a payment to a beneficiary in Nigeria. Sanctions and KYC screening clear automatically. The transfer routes through the GB→NG corridor at a locked FX rate. A payout partner in Lagos receives the instruction and disburses from its pre-funded float. At end of day, the transfer settles, reconciles against the partner's statement, and the entire chain, screening decision included, sits in an audit trail anyone with access can actually read.",
  ),
  richText(
    "Design Decisions",
    "Dark theme by default, built around a dirty, deliberate green inspired less by finance and more by military discipline: reliability, restraint and the sense of scale that comes with real operational responsibility. Rose gold carries the only warmth in the palette, reserved for the handful of moments that need it. Maker-checker approval isn't a backend permission, it's visible in the interface itself; a flagged transaction becomes a case with a real owner and a real status, not a message that disappears into someone's inbox.",
  ),
  richText(
    "Changes Made",
    "The clearest example of revision on this project wasn't visual, it was conceptual. An early pass at describing Corridor implied every transfer needed a human to approve it, which sounds serious but isn't how real payment infrastructure actually works. Reworked it once I looked closer: the overwhelming majority of volume moves on autopilot, and the real design problem is the small, automatically-flagged exception path that most products treat as an afterthought.",
    'A rename to "CorriDoor" also got tested, then reverted. Clever wordplay, but it worked against the project\'s own argument: real payments infrastructure earns trust by being deliberately unremarkable, not by being clever about its own name.',
  ),
  richText(
    "Built With AI",
    "Designed through conversation: the industry recontextualization, the role mapping, and the compliance and treasury modules all worked out collaboratively before a single screen existed. Built end to end with Claude Code from a detailed structured prompt covering roles, the data model, every operational module, an eight-feature AI layer across compliance, treasury and operations, plus the full design system.",
  ),
  {
    _type: "metricsRow",
    _key: randomUUID(),
    metrics: [
      { _key: randomUUID(), label: "Pages", value: "40+" },
      { _key: randomUUID(), label: "Data Entities", value: "20+" },
      { _key: randomUUID(), label: "Core Roles", value: "3" },
      { _key: randomUUID(), label: "AI-Assisted Features", value: "8" },
      { _key: randomUUID(), label: "Days to Build", value: "4" },
    ],
  },
];

function blockLabel(block: { _type: string; heading?: string }): string {
  return block.heading ? `${block._type}: ${block.heading}` : block._type;
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "rycezmf9";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = requireEnv("SANITY_WRITE_TOKEN");
  const client = createClient({ projectId, dataset, apiVersion: "2025-01-01", token, useCdn: false });

  const doc = await client.fetch<{ _id: string; blocks?: { _type: string; heading?: string }[] } | null>(
    `*[_type == "project" && slug.current == "corridor"][0]{ _id, blocks }`,
  );
  if (!doc) {
    console.error('No project found with slug "corridor".');
    process.exit(1);
  }

  const existingBlocks = doc.blocks ?? [];
  const existingHeadings = new Set(existingBlocks.map((b) => b.heading).filter((h): h is string => Boolean(h)));

  const alreadyPresent = NEW_BLOCKS.filter((b) => "heading" in b && existingHeadings.has(b.heading));
  const toAppend = force ? NEW_BLOCKS : NEW_BLOCKS.filter((b) => !("heading" in b) || !existingHeadings.has(b.heading));

  console.log(`Corridor (${doc._id}) currently has ${existingBlocks.length} block(s):`);
  for (const b of existingBlocks) console.log(`  - ${blockLabel(b)}`);

  if (alreadyPresent.length > 0 && !force) {
    console.log(`\nAlready present — skipping (pass --force to append duplicates anyway):`);
    for (const b of alreadyPresent) console.log(`  - ${blockLabel(b)}`);
  }

  console.log(`\n${write ? "Will append" : "[dry run] Would append"} ${toAppend.length} new block(s):`);
  for (const b of toAppend) console.log(`  - ${blockLabel(b)}`);

  if (toAppend.length === 0) {
    console.log("\nNothing new to seed.");
    return;
  }

  if (!write) {
    console.log("\nDry run only — re-run with --write to actually patch the document.");
    return;
  }

  await client
    .patch(doc._id)
    .set({ blocks: [...existingBlocks, ...toAppend] })
    .commit({ autoGenerateArrayKeys: true });

  console.log(`\nDone — appended ${toAppend.length} block(s) to Corridor.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
