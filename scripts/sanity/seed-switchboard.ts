/**
 * One-off: fills in the Switchboard case-study content, seeded from
 * uploads/0ac662dd-switchboardcasestudyrefined.md — an internal console
 * for managing AI/LLM providers.
 *
 * Unlike seed-ensemble.ts, this project document ALREADY EXISTS in Sanity
 * (project-switchboard) — someone created the shell (name, slug, a rough
 * oneLiner, industry, showOnPortfolio=false) but left `blocks` empty and
 * a couple of fields as placeholders (`role: "TODO — ..."`, `scale: []`,
 * `techStack: []`), and `projectType` was written as a bare string
 * ("Website") instead of the array the current schema expects. This
 * script only PATCHES those specific gaps — it never touches `name`,
 * `slug`, `industry`, `year`, or `showOnPortfolio`, all of which were
 * already set deliberately. `tags` is merged, not replaced: the existing
 * "AI-coding" tag is what makes this project eligible for the home
 * page's DesignSystemSection rotator (src/components/home/
 * design-system-section.tsx filters projects by that exact tag), so
 * dropping it would silently break that.
 *
 * Every content block maps 1:1 to a "## Block:" section in the source
 * doc, in the same order, using the existing block schema (quote,
 * sideBySideCards, metricsRow, imageGallery, processTimeline, video,
 * chart, richText) — nothing new added to the schema. The source's
 * second imageGallery section mixes a screen recording with two
 * screenshots; each keeps its own block type (video vs. imageGallery)
 * but original reading order is preserved by *not* batching all the
 * screenshots into one gallery around the video.
 *
 * There's also a stale Studio draft (drafts.project-switchboard) that
 * currently mirrors the empty published doc exactly. Once the published
 * doc has real content, that draft would silently revert it back to
 * empty if anyone ever published it — so after a successful --write,
 * this script re-checks the draft and deletes it ONLY if it's still an
 * empty-blocks mirror (never deletes it if it holds anything unique).
 *
 * Dry-run by default — prints the full plan, writes nothing. Pass
 * --write to actually patch.
 *
 * Usage:
 *   npm run sanity:seed-switchboard            # dry run
 *   npm run sanity:seed-switchboard -- --write # actually writes
 *
 * Reads NEW_SANITY_TOKEN (and optionally NEW_SANITY_PROJECT_ID /
 * NEW_SANITY_DATASET) from .env.local, same as the other sanity:*
 * scripts. See scripts/sanity/README.md for token setup.
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

const client = createClient({
  projectId: process.env.NEW_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "rycezmf9",
  dataset: process.env.NEW_SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: requireEnv("NEW_SANITY_TOKEN"),
  useCdn: false,
});

const DOC_ID = "project-switchboard";
const DRAFT_ID = "drafts.project-switchboard";

// ---- portable-text + block helpers (same shapes as seed-ensemble.ts) --

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type PortableTextBlock = {
  _type: "block";
  _key: string;
  style: "normal";
  markDefs: [];
  children: Span[];
};

function paragraph(text: string): PortableTextBlock {
  return {
    _type: "block",
    _key: randomUUID(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: randomUUID(), text, marks: [] }],
  };
}

function quoteBlock(quote: string) {
  return { _type: "quote", _key: randomUUID(), quote };
}

function richTextBlock(heading: string | undefined, ...paragraphs: PortableTextBlock[]) {
  return { _type: "richText", _key: randomUUID(), heading, content: paragraphs };
}

function metricsRowBlock(metrics: { value: string; label: string }[]) {
  return {
    _type: "metricsRow",
    _key: randomUUID(),
    metrics: metrics.map((m) => ({ _key: randomUUID(), ...m })),
  };
}

function chartBlock(
  heading: string,
  caption: string,
  chartType: "bar" | "line" | "pie",
  data: { label: string; value: number }[],
) {
  return {
    _type: "chart",
    _key: randomUUID(),
    heading,
    caption,
    chartType,
    data: data.map((d) => ({ _key: randomUUID(), ...d })),
  };
}

function imageGalleryBlock(captions: string[]) {
  return {
    _type: "imageGallery",
    _key: randomUUID(),
    images: captions.map((caption) => ({ _key: randomUUID(), caption, aspect: "wide" as const })),
  };
}

function videoBlock(heading: string, caption: string) {
  return { _type: "video", _key: randomUUID(), heading, caption };
}

function processTimelineBlock(phases: { label: string; description: string }[]) {
  return {
    _type: "processTimeline",
    _key: randomUUID(),
    phases: phases.map((p) => ({ _key: randomUUID(), ...p })),
  };
}

function sideBySideCardsBlock(
  heading: string | undefined,
  cards: { title: string; body: string[]; tone?: "default" | "primary" }[],
) {
  return {
    _type: "sideBySideCards",
    _key: randomUUID(),
    heading,
    cards: cards.map((c) => ({
      _key: randomUUID(),
      title: c.title,
      tone: c.tone ?? "default",
      body: c.body.map(paragraph),
    })),
  };
}

// ---- content, mapped 1:1 from the source doc's block order ------------

const blocks = [
  quoteBlock(
    "The hard part of this build wasn't the seven pages I shipped; it was deciding which five to leave as honest placeholders instead of building all twelve badly.",
  ),

  sideBySideCardsBlock("The Recontextualization", [
    {
      title: "Before",
      body: [
        "A compliance engine for managing the different third-party APIs a company's various products relied on for regulatory compliance. Comparing options, switching providers, catching upstream changes. Real, NDA-protected work I can never show.",
      ],
    },
    {
      title: "After",
      tone: "primary",
      body: [
        "The same operational shape, recontextualized for a different problem every product team now actually has: comparing AI providers, routing and failing over between them, and catching a model deprecation or a price change before it breaks something downstream instead.",
      ],
    },
  ]),

  metricsRowBlock([
    { value: "7", label: "pages built, out of 12 in the full nav" },
    { value: "8", label: "providers, 16 models in the catalog" },
    { value: "4", label: "roles modeled, 2 fully built" },
    { value: "4", label: "AI insights, computed live from seed data, none hardcoded" },
    { value: "41", label: "TypeScript files, ~3,400 lines" },
    { value: "9", label: "commits across 5 days, Aug 14 to Aug 18" },
  ]),

  imageGalleryBlock([
    "Overview dashboard — the KPI row, the two gradient trend charts, and the chained-chip routing snapshot in one frame. Every other decision in this build supports this page, so it earns the first screenshot.",
    "Provider Catalog table — capability tags, right-aligned pricing, status badges. Worth capturing because the name column reads one shade darker and one pixel larger than the rest of the row; that detail doesn't survive being described.",
    "Comparison page — three model cards side by side with the best-in-row checkmarks. This is the page that proves \"no table, no chart\" can still read as data-dense rather than sparse.",
  ]),

  sideBySideCardsBlock(undefined, [
    {
      title: "KPI arrows",
      body: [
        "Before: the up/down arrow on each stat card was wired to whether the change counted as good, not to the number's actual sign. A 10% drop in spend, which is good, rendered with an up arrow.",
        "After: arrow direction now follows the real sign of the delta; color alone carries whether that direction is good or bad.",
      ],
    },
    {
      title: "Spend Sankey",
      body: [
        "Before: provider spend, the spend-by-provider bar chart and the Sankey's flow widths each came from their own independent random number, so they told three different stories about the same eight providers.",
        "After: every product's spend now allocates once across its primary and fallback providers, and the bar chart, the KPI total, and the Sankey all read from that single allocation.",
      ],
    },
  ]),

  processTimelineBlock([
    {
      label: "Aug 14: Foundations, then a working slice.",
      description:
        "Design tokens, layout shell, seed data, and the first three of seven pages (Overview, Provider Catalog, Comparison), committed together before touching anything else.",
    },
    {
      label: "Aug 14: The remaining four pages.",
      description:
        "Found that provider spend, the cost breakdown and the Sankey diagram disagreed with each other because each was random in a different place. Reworked the seed generator so all three read from one allocation instead of three.",
    },
    {
      label: "Aug 14: Settings and the AI layer finished.",
      description: "Caught the KPI-arrow bug (see above) the same day and fixed it before moving on.",
    },
    {
      label: "Aug 14: First round of real feedback.",
      description: "Sidebar contrast, page-title size, the 50px content offset, table name-column weight.",
    },
    {
      label: "Aug 14: Misread my own fix.",
      description:
        '"The dashboard is an exception to the 50px rule" first became "100px instead of 50px." The actual ask was no special rule at all, just the page\'s ordinary ~24px padding. Corrected the same day once that landed.',
    },
    {
      label: "Aug 15: A hand-edit landed outside the session.",
      description:
        "Inactive sidebar text got nudged from gray-300 to gray-400 directly on the branch. Pulled it and rebased the next commit on top of it instead of quietly overwriting it.",
    },
    {
      label: "Aug 16: Production 404 on hard reload.",
      description:
        "Client-side routing meant a direct hit on /providers/catalog had no file to serve. Fixed with a one-file Vercel rewrite.",
    },
    {
      label: "Aug 18: A shared design-system audit flagged two structural bugs.",
      description:
        "The same versioned document governing two other dashboard builds pointed out that table headers and cells could drift apart because their alignment was set in two separate places, and that chart cards could show dead space when CSS grid stretched them to match a taller neighbor. Refactored every table onto one column-config array and stopped the stretch at the grid level.",
    },
  ]),

  videoBlock(
    "Settings, role switch",
    "Watching the sidebar, the top-bar greeting and the gated \"Invite teammate\" button on Access & Audit update together as the role changes is the only way to show the switch is live, not a static mock.",
  ),

  imageGalleryBlock([
    "Products & Routing config panel — chained provider chips next to the routing-rules form, open at the same time.",
    "Cost & Usage's Sankey diagram — spend flowing from total, through providers, to products. The one chart in the build that needed a custom width-measurement fix to render correctly at all.",
  ]),

  chartBlock(
    "Nav depth: built vs. placeholder",
    "Spread across 6 nav groups: Overview, Providers, Products, Insights, Administration, Settings.",
    "bar",
    [
      { label: "Built", value: 7 },
      { label: "Placeholder", value: 5 },
    ],
  ),

  richTextBlock(
    undefined,
    paragraph(
      "None of this talks to a real backend. The providers, models, spend figures and audit log all come from a deterministic generator that a \"reseed\" button in Settings can regenerate on demand, and the four SwitchAI insights are plain functions reading that same seeded data, not calls to any model. I built this alongside two other dashboards, Caretrace and Corridor, under one shared, versioned design-system document; when that document changed, I went back and audited all three for the same two bugs rather than assuming Switchboard alone was fine.",
    ),
  ),
];

// ---- fields the source doc didn't specify — reasoned choices, not TODOs ----
//
//   role                "Product design · frontend build" — replaces the
//                        literal "TODO" placeholder that was there.
//   techStack            ["React", "TypeScript"] — from the hero's own
//                        "React + TypeScript" tag; techStack was empty.
//   accent               indigo/orange pair — chart block needs one and
//                        none was set; distinct from Corridor's green and
//                        Ensemble's blue/teal.
//   processDisciplines   UI/UX + Web Development — no basis for anything
//                        more specific in the source.
//   scale (sidebar)      headline stats mirrored from the metricsRow block.
//   tags                 MERGED with the existing ["AI-coding","Dashboards"]
//                        (kept, "AI-coding" drives DesignSystemSection
//                        eligibility on the home page) plus the new hero's
//                        own tags.
//
// name, slug, industry, year, showOnPortfolio are left exactly as they
// already were — not touched by this script.

const patch = {
  oneLiner:
    "An internal console for managing every AI provider a company runs on: comparing them, routing and failing over between them and catching what changed before it breaks something downstream.",
  tags: ["AI-coding", "Dashboards", "Internal Tools", "Design System", "React + TypeScript", "Data Visualization"],
  projectType: ["Website"],
  role: "Product design · frontend build",
  techStack: ["React", "TypeScript"],
  accent: { primary: "#4F46E5", secondary: "#F97316" },
  processDisciplines: ["UI/UX", "Web Development"],
  aiContext:
    "Switchboard is a portfolio case study: an internal console concept for managing every AI/LLM provider a company runs on — comparing providers, routing and failing over between them, catching a model deprecation or price change before it breaks something downstream. 7 of 12 planned nav pages were actually built (the other 5 are honest placeholders with real names/nav slots, not fake-shallow pages) — 8 providers, 16 models in the catalog, 4 roles modeled (2 fully built), 4 AI insights computed live from seeded data (not real model calls), 41 TypeScript files / ~3,400 lines, 9 commits across 5 days (Aug 14-18, 2026). It's a recontextualization of real NDA-protected compliance-engine work the author designed professionally, rebuilt from scratch as a new, showable product with the same operational shape. Nothing talks to a real backend — a deterministic seed generator (reseedable from Settings) drives everything. Built alongside two other dashboards (Caretrace, Corridor) under one shared versioned design-system document; when that document changed, all three got audited and fixed for the same two structural bugs (table header/cell alignment drift, chart-card dead space under CSS grid stretch) rather than assuming only one needed the fix.",
  scale: [
    { value: "7", label: "Pages built" },
    { value: "8", label: "Providers modeled" },
    { value: "16", label: "Models cataloged" },
    { value: "9", label: "Commits" },
  ],
  blocks,
};

async function main() {
  const existing = await client.fetch<{
    _id: string;
    name?: string;
    blocks?: unknown[];
    projectType?: unknown;
    role?: string;
    tags?: string[];
  } | null>(`*[_type == "project" && _id == $id][0]`, { id: DOC_ID });

  if (!existing) {
    console.error(`No project document found with _id "${DOC_ID}". Nothing to patch.`);
    process.exit(1);
  }

  console.log(`Found existing project "${existing.name}" (${DOC_ID})`);
  console.log(`  current blocks: ${existing.blocks?.length ?? 0}  current projectType: ${JSON.stringify(existing.projectType)}`);
  console.log(`\n${write ? "Will patch" : "[dry run] Would patch"} with ${blocks.length} new block(s):`);
  for (const b of blocks) {
    const label = "heading" in b && b.heading ? `: ${b.heading}` : "";
    console.log(`    - ${b._type}${label}`);
  }
  console.log("\nOther fields being set: oneLiner, tags (merged), projectType (fixed to array), role, techStack,");
  console.log("  accent, processDisciplines, aiContext, scale. NOT touched: name, slug, industry, year, showOnPortfolio.");

  if (!write) {
    console.log("\nDry run only — re-run with --write once this looks right.");
    return;
  }

  await client.patch(DOC_ID).set(patch).commit();
  console.log(`\nDone — patched ${DOC_ID}.`);

  const draft = await client.fetch<{ _id: string; blocks?: unknown[] } | null>(
    `*[_type == "project" && _id == $id][0]{ _id, blocks }`,
    { id: DRAFT_ID },
  );
  if (draft && (draft.blocks?.length ?? 0) === 0) {
    await client.delete(DRAFT_ID);
    console.log(
      `Also deleted the stale empty draft (${DRAFT_ID}) — it mirrored the pre-patch empty doc, so publishing\n` +
        "it later would have silently wiped this content back out.",
    );
  } else if (draft) {
    console.log(
      `\n⚠ ${DRAFT_ID} still exists and is NOT empty — left it alone. Check it in Studio: if you publish it,\n` +
        "it will overwrite what this script just wrote.",
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
