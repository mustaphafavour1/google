/**
 * One-off: creates the "Ensemble" case-study project document from
 * scratch, seeded from uploads/41a186e3-ensemblecasestudy.md — an
 * operations dashboard concept for a fictional frontier AI lab.
 *
 * Every content block maps 1:1 to a "##" section in that source doc, in
 * the same order, using the existing block schema types (quote, richText,
 * metricsRow, chart, imageGallery, video, processTimeline,
 * sideBySideCards) — nothing new was added to the schema. The chart
 * block can only carry one value per bar, so the source's "built vs
 * total" table is rendered as a bar-per-section (built count) plus an
 * auxiliary richText block right after it that spells out the exact
 * built/total pair per section — no numbers from the source table are
 * dropped.
 *
 * No real screenshots or recordings exist for this yet — every
 * imageGallery/video block is seeded caption-only (no file), which
 * renders as a styled placeholder until real media is uploaded by hand
 * in Studio. showOnPortfolio is seeded false on purpose; flip it on in
 * Studio once the media's in.
 *
 * Fields the source doc didn't specify (industry, year, role, techStack,
 * accent, processDisciplines, scale, cardSize) are filled with reasoned
 * defaults, not "TODO" placeholders — see the printed summary after a
 * --write run for exactly what was chosen, and adjust in Studio if you
 * want something different.
 *
 * Safe to run more than once: if the "ensemble" project document already
 * exists, the script refuses to touch it unless you also pass --force
 * (createOrReplace would otherwise silently wipe out any edits made in
 * Studio since the last run).
 *
 * Dry-run by default — prints the full document it would create, writes
 * nothing. Pass --write to actually create it.
 *
 * Usage:
 *   npm run sanity:seed-ensemble            # dry run
 *   npm run sanity:seed-ensemble -- --write # actually writes
 *
 * Reads NEW_SANITY_TOKEN (and optionally NEW_SANITY_PROJECT_ID /
 * NEW_SANITY_DATASET) from .env.local, same as the other sanity:* scripts
 * — falls back to NEXT_PUBLIC_SANITY_PROJECT_ID/DATASET and this
 * portfolio's own live project (rycezmf9 / production) if unset. See
 * scripts/sanity/README.md for token setup.
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

const projectId = process.env.NEW_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "rycezmf9";
const dataset = process.env.NEW_SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token: requireEnv("NEW_SANITY_TOKEN"),
  useCdn: false,
});

const SLUG = "ensemble";
const DOC_ID = `project-${SLUG}`;

// ---- portable-text helpers -------------------------------------------------

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type PortableTextBlock = {
  _type: "block";
  _key: string;
  style: "normal";
  listItem?: "bullet";
  level?: number;
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

function bullet(text: string): PortableTextBlock {
  return { ...paragraph(text), listItem: "bullet", level: 1 };
}

// ---- block builders ---------------------------------------------------

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

function chartBlock(heading: string, caption: string, data: { label: string; value: number }[]) {
  return {
    _type: "chart",
    _key: randomUUID(),
    heading,
    caption,
    chartType: "bar" as const,
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
  heading: string,
  cards: { title: string; body: string; tone?: "default" | "primary" }[],
) {
  return {
    _type: "sideBySideCards",
    _key: randomUUID(),
    heading,
    cards: cards.map((c) => ({
      _key: randomUUID(),
      title: c.title,
      tone: c.tone ?? "default",
      body: [paragraph(c.body)],
    })),
  };
}

// ---- content, mapped 1:1 from the source doc's section order ----------

const blocks = [
  quoteBlock("I rebuilt the same hexagon map three times before I let myself stop touching it."),

  richTextBlock(
    undefined,
    paragraph(
      "Ensemble imagines a frontier AI lab that runs its own engineering org through a fleet of AI agents rather than bolting one assistant onto existing tools. The dashboard is what a product lead, a reliability engineer or a platform admin would open every morning: which agents are running, which models are healthy, which incidents still need a human and what the fleet did overnight. Every number on it comes from a seeded, deterministic mock data layer built to look like a real system at scale, not a handful of placeholder rows.",
    ),
  ),

  metricsRowBlock([
    { value: "76", label: "routes scaffolded across the app" },
    { value: "33", label: "fully built with real data and interaction" },
    { value: "107", label: "typed data entities across 29 mock data modules" },
    { value: "22", label: "commits over 4 build days" },
    { value: "20", label: "npm dependencies, none unused at final commit" },
  ]),

  chartBlock(
    "Pages Built, by Section",
    "Submenu pages built per functional domain (bar chart: built vs. total items in that section's navigation group). Three additional pages sit outside any section as top-level links (Global Snapshot, Executive Digest, Live Activity Feed); six more were later promoted out of these same sections to stand alone at the top level.",
    [
      { label: "Engineering Agents", value: 4 },
      { label: "Team Management", value: 4 },
      { label: "Reliability & Incidents", value: 3 },
      { label: "Platform Configuration", value: 3 },
      { label: "Evaluation & Self-Assessment", value: 2 },
      { label: "Training & Data", value: 2 },
      { label: "Optimization", value: 2 },
      { label: "Model Fleet", value: 1 },
      { label: "Infrastructure & Hardware", value: 1 },
      { label: "Insights & Recommendations", value: 1 },
    ],
  ),

  richTextBlock(
    "Built vs. total, section by section",
    bullet("Engineering Agents — 4 of 6"),
    bullet("Team Management — 4 of 6"),
    bullet("Reliability & Incidents — 3 of 7"),
    bullet("Platform Configuration — 3 of 7"),
    bullet("Evaluation & Self-Assessment — 2 of 7"),
    bullet("Training & Data — 2 of 7"),
    bullet("Optimization — 2 of 6"),
    bullet("Model Fleet — 1 of 5"),
    bullet("Infrastructure & Hardware — 1 of 6"),
    bullet("Insights & Recommendations — 1 of 6"),
  ),

  imageGalleryBlock([
    "Global Snapshot (Overview) — the landing page every other section had to earn its place next to: model health gauges, critical alerts, live activity and the regional usage map in one view. This is the page that set the visual bar (ink ladder, hairline borders, tabular numbers) for the other 32 built pages.",
  ]),

  videoBlock(
    "All Models, expand interaction",
    "All four family cards sit at an identical collapsed height regardless of how long their description text runs; a still frame can't show that clicking \"View more\" grows only the one card while its three siblings hold their height. The interaction is the proof.",
  ),

  processTimelineBlock([
    {
      label: "Day 1, an operations dashboard, generically.",
      description:
        "Seventeen pages: an agent roster, run history, deployments, environments, admin settings. A believable enough app with no real point of view yet.",
    },
    {
      label: "Day 2, the reorg.",
      description:
        "Rebuilt around a specific premise instead of a generic one: a frontier AI lab running engineering through agents. The technical foundation stayed the same; the information architecture didn't. Ten functional domains and a role-scoped sidebar replaced the original flat structure.",
    },
    {
      label: "Days 2 to 3, the buildout.",
      description:
        "Domain by domain, the real pages went in: Model Fleet, Engineering Agents, Evaluation, Training & Data, Optimization, Infrastructure, Reliability, Insights, Team Management, Platform Configuration. Not every leaf page in every section; the ones that would actually get opened daily.",
    },
    {
      label: "Typography, twice.",
      description:
        "A monospace display font started out marking almost anything with a number or a name. Once real content filled the tables that read as costume rather than character, so it got pulled back to genuine technical tokens only: SHAs, run IDs, file paths, branch names. A few commits later it came out entirely and Inter took over tabular numbers on its own.",
    },
    {
      label: "The sidebar, twice.",
      description:
        "Started as a tree that expanded sections inline. Reworked into a two-panel pattern instead: clicking a section swaps the whole rail into that section's own list with a back chevron. It later learned to collapse to icons, picked up hairline dividers to chunk nineteen top-level entries into groups of two to four and had its six most load-bearing pages promoted out of their submenus to stand alone.",
    },
    {
      label: "The map, three times.",
      description:
        "The brief was a world map made of small touching hexagons colored by activity. First attempt: ECharts with a hand-rolled render function on top of a registered world map; turned down, the wrong look. Second attempt: deck.gl's HexagonLayer, real WebGL aggregation with a synthetic point cloud feeding it; also turned down, this time on the mechanism itself, no WebGL and no tile server. Third attempt: the hex grid computed once against the same coastline data and rendered as plain SVG polygons; ended up smaller than either version before it and dropped five packages doing it.",
    },
    {
      label: "The newest feature got restructured the same day it shipped.",
      description:
        "Added an On-Call Agent page: live investigation threads on incidents, a lessons-learned archive, reusable playbooks, an on-demand CI status report. Shipped as five stacked sections. Within the same session, two of those sections split out into their own tabs, using a Tabs component that had sat unused in the codebase since the first week of the build.",
    },
  ]),

  sideBySideCardsBlock("Three ways to draw a hexagon map", [
    {
      title: "ECharts, custom render function",
      body: "A hand-rolled series drawn on top of a registered world map. It worked, but it read as a soft blur rather than distinct touching cells; not what had actually been asked for.",
    },
    {
      title: "deck.gl, HexagonLayer",
      body: "Real WebGL aggregation, with a seeded point cloud synthesized around each city so the layer had enough density to bin into visible clusters. The look was right; it cost five new packages, an unresolved zoom bug and a dependency scan flagging vulnerabilities pulled in by 3D-mesh features the map never used.",
    },
    {
      title: "Precomputed SVG (shipped)",
      tone: "primary",
      body: "The grid gets built once, offline, by testing candidate hexagon centers against the same GeoJSON coastline data already in the repo, then rendered at runtime as plain SVG polygons. No WebGL, no extra dependencies and less code than either attempt before it.",
    },
  ]),

  videoBlock(
    "Regional Breakdown map, zoom and hover",
    "Wheel-zoom into a hotspot cluster, pan across a continent, hover a single hexagon for its tooltip. This interaction is the entire reason the map got rebuilt a third time; a still frame shows the hexagons but not why they needed to hold up under a cursor.",
  ),

  imageGalleryBlock([
    "On-Call Agent, investigation thread — one incident carries a fully scripted exchange: an agent's evidence-backed hypothesis, a human questioning it, the agent re-checking and holding its position with new evidence, then a follow-up after resolution answered with a real error-rate trend. Worth reading in full rather than summarized.",
  ]),

  richTextBlock(
    undefined,
    paragraph(
      "The detail I'd point to first isn't any single page; it's that 40 of the 76 routes are deliberately unbuilt. Every one has a real name and a real place in the navigation, and none of them pretend to be more than a placeholder. Building three shallow versions of everything would have been the easier path. Deciding, section by section, which dozen or so pages actually needed to be real took longer, and it's the reason the 33 that exist hold up under a second look.",
    ),
  ),
];

// ---- fields the source doc didn't specify — reasoned choices, not TODOs ----
//
//   industry            "AI & Machine Learning" — the fictional lab's own domain.
//   year                current year — this is a brand-new project.
//   role                "Product design · frontend build" — matches Corridor's
//                        "Product design · X" convention; this project is
//                        explicitly both IA/visual design and hands-on build.
//   techStack            the hero's own tag list, minus "Data Visualization"
//                        (a domain, not a dependency).
//   accent               a blue/teal pair distinct from every other project's
//                        accent, fitting an "ops dashboard, dense, technical"
//                        feel — not from the source, purely a visual pick.
//   processDisciplines   UI/UX + Web Development + AI-workflow, since the
//                        build narrative explicitly covers all three.
//   scale (sidebar)      headline stats mirrored from the metricsRow block.
//   cardSize             left at schema default ("small") — no basis to
//                        pick anything else without seeing real screens.
//
// All of these are one field each in Studio (Info & Meta / Scale & Scores
// tabs) if you want to change any of them.

const doc = {
  _type: "project",
  _id: DOC_ID,
  name: "Ensemble",
  slug: { _type: "slug", current: SLUG },
  oneLiner:
    "An operations dashboard for a fictional frontier AI lab, built dense enough to read like a tool an actual engineering org runs on, not a demo with three cards and a chart.",
  showOnPortfolio: false,
  tags: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand", "Data Visualization"],
  industry: "AI & Machine Learning",
  projectType: ["Dashboard"],
  year: new Date().getFullYear(),
  role: "Product design · frontend build",
  techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand"],
  links: [],
  accent: { primary: "#3B6FE0", secondary: "#5FD4C4" },
  processDisciplines: ["UI/UX", "Web Development", "AI-workflow"],
  aiContext:
    "Ensemble is a portfolio case study: a fictional operations dashboard for a frontier AI lab that runs its engineering org through a fleet of AI agents. 76 routes were scaffolded, 33 fully built with real data/interaction (the other 40 are deliberately left as placeholders with real names and nav slots, not fake-shallow pages). Built over 4 days / 22 commits, 107 typed data entities across 29 mock data modules, 20 npm dependencies (none unused). The build started as a generic ops-dashboard shell on day 1, then got reorganized around the frontier-AI-lab premise on day 2 with 10 functional domains and a role-scoped two-panel sidebar. The signature visual — a world map of small touching hexagons colored by activity — was rebuilt 3 times: ECharts custom render (rejected, wrong look), deck.gl HexagonLayer with WebGL (rejected — 5 extra packages, an unresolved zoom bug, vulnerable dependencies), then a precomputed SVG hex grid built once offline against real coastline GeoJSON and rendered as plain polygons at runtime (shipped — smallest, fewest dependencies of the three). Also has an On-Call Agent page with a fully scripted incident investigation thread (agent hypothesis, human pushback, agent re-checking its position with new evidence).",
  scale: [
    { value: "76", label: "Routes scaffolded" },
    { value: "33", label: "Fully built" },
    { value: "22", label: "Commits" },
    { value: "4", label: "Build days" },
  ],
  blocks,
};

async function main() {
  const existing = await client.fetch<{ _id: string } | null>(`*[_type == "project" && _id == $id][0]{ _id }`, {
    id: DOC_ID,
  });

  if (existing && !force) {
    console.error(
      `A project document with _id "${DOC_ID}" already exists. Refusing to overwrite it — any edits made\n` +
        "in Studio since it was seeded would be silently wiped by createOrReplace. Pass --force if you\n" +
        "really want to reset it back to this script's content.",
    );
    process.exit(1);
  }

  console.log(`${write ? "Will create" : "[dry run] Would create"} project "${doc.name}" (${doc._id})`);
  console.log(`  slug=${doc.slug.current}  year=${doc.year}  industry=${doc.industry}`);
  console.log(`  showOnPortfolio=${doc.showOnPortfolio}  blocks=${doc.blocks.length}`);
  for (const b of doc.blocks) {
    const label = "heading" in b && b.heading ? `: ${b.heading}` : "";
    console.log(`    - ${b._type}${label}`);
  }

  if (!write) {
    console.log("\nDry run only — re-run with --write once this looks right.");
    return;
  }

  await client.createOrReplace(doc);
  console.log(`\nDone — created ${doc.name} (${doc._id}).`);
  console.log(
    "showOnPortfolio is false — add the real screenshots/recordings to each imageGallery/video block\n" +
      "in Studio, then flip \"Show on portfolio\" on when it's ready.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
