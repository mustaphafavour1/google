/**
 * One-off: replaces the existing "My Design System" project's content
 * with the refined HeadFavour case study, seeded from
 * uploads/bf6d9240-headfavourcasestudyrefined.md.
 *
 * There's already a project document for this (found by its current
 * slug, "my-design-system" — its _id is a random Studio-assigned UUID,
 * not the deterministic project-<slug> this script can't just guess).
 * It currently holds 8 older, more abstract blocks (What Necessitated
 * It / The Gap / Who It's For / What's Inside / Changes Made / Built
 * With AI / a metrics row) written before the project was renamed
 * HeadFavour. The new source doc is an explicitly "refined" pass at the
 * same project — same subject, same author, more specific and more
 * complete (a real dated build log, a components-by-category chart,
 * image galleries, two quotes) — so this script REPLACES the old blocks
 * outright rather than appending, to avoid two overlapping "why this
 * exists" narratives sitting back to back on one page. Sanity keeps
 * document revision history, so the old content isn't gone-forever even
 * after a --write — it's one Studio "History" panel away if you want it
 * back.
 *
 * Also renames the document to match: name "My Design System" ->
 * "HeadFavour", slug "my-design-system" -> "headfavour" (grepped the
 * whole codebase for "my-design-system" first — zero hardcoded
 * references, and the doc has never been shown live, so renaming the
 * slug now breaks nothing).
 *
 * Every content block maps 1:1 to a "## Block:" section in the source
 * doc, in the same order, using the existing block schema (quote,
 * metricsRow, sideBySideCards, richText, imageGallery, chart,
 * processTimeline, video) — nothing new added to the schema. Two small
 * structural accommodations, same spirit as seed-ensemble.ts:
 *   - the sideBySideCards block's closing sentence ("Both share the
 *     same rules underneath...") applies to both cards, not one, so it
 *     becomes its own richText block right after, instead of being
 *     force-fit into either card's body.
 *   - the second imageGallery section mixes two screenshots around one
 *     screen recording; each keeps its own block type but stays in its
 *     original reading order (gallery, video, gallery) rather than
 *     batching both screenshots together.
 *
 * Preserves the existing `links` (the real designsystem.headfavour.com
 * URL) and `valueImpact` fields untouched — only intentionally replaces
 * name, slug, oneLiner, tags, projectType, techStack, blocks, and adds
 * accent/processDisciplines/aiContext/scale, none of which existed
 * before.
 *
 * Dry-run by default — prints the full plan (old blocks vs. new) and
 * writes nothing. Pass --write to actually replace.
 *
 * Usage:
 *   npm run sanity:seed-headfavour            # dry run
 *   npm run sanity:seed-headfavour -- --write # actually writes
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
const OLD_SLUG = "my-design-system";
const NEW_SLUG = "headfavour";

const client = createClient({
  projectId: process.env.NEW_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "rycezmf9",
  dataset: process.env.NEW_SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: requireEnv("NEW_SANITY_TOKEN"),
  useCdn: false,
});

// ---- portable-text + block helpers (same shapes as the other seed scripts) --

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

function chartBlock(heading: string, chartType: "bar" | "line" | "pie", data: { label: string; value: number }[]) {
  return {
    _type: "chart",
    _key: randomUUID(),
    heading,
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

function sideBySideCardsBlock(heading: string | undefined, cards: { title: string; body: string }[]) {
  return {
    _type: "sideBySideCards",
    _key: randomUUID(),
    heading,
    cards: cards.map((c) => ({
      _key: randomUUID(),
      title: c.title,
      tone: "default" as const,
      body: [paragraph(c.body)],
    })),
  };
}

// ---- content, mapped 1:1 from the source doc's block order ------------

const blocks = [
  quoteBlock("I sat down to document a component and realized who I was actually writing it for: mostly agents, not people."),

  metricsRowBlock([
    { value: "25", label: "components across 6 categories" },
    { value: "8", label: "foundation pages" },
    { value: "5", label: "pattern pages" },
    { value: "4", label: "products documented as full case studies" },
    { value: "9", label: "content types in the CMS" },
    { value: "29", label: "commits from first scaffold to latest polish" },
  ]),

  sideBySideCardsBlock(
    "The Authentication pattern ships two accepted layouts, not one, because the same flow carries different weight depending on where it sits.",
    [
      {
        title: "Format 1: Split screen",
        body: "A contextual image beside the form card. For a page that wants to sell something before it asks for a password.",
      },
      {
        title: "Format 2: Centred modal",
        body: "Just the form, centred on a plain background. Lighter weight, for a flow that shouldn't compete with the product behind it.",
      },
    ],
  ),

  richTextBlock(
    undefined,
    paragraph(
      "Both share the same rules underneath: a submit button that stays visually muted until every field validates, and field labels in small caps, the one deliberate exception to the rest of the system.",
    ),
  ),

  imageGalleryBlock([
    "Authentication pattern page, both formats stacked — Format 1's split screen and Format 2's centred modal need to sit next to each other; the difference is entirely about weight and context, and a description flattens that.",
  ]),

  chartBlock("Components by category", "bar", [
    { label: "Actions", value: 3 },
    { label: "Forms", value: 5 },
    { label: "Navigation", value: 4 },
    { label: "Data Display", value: 4 },
    { label: "Feedback", value: 6 },
    { label: "Layout", value: 3 },
  ]),

  processTimelineBlock([
    {
      label: "Scaffold first, brand later.",
      description:
        "The first commits set up Sanity Studio and a plain Next.js shell, then worked outward: brand and foundation pages, then every component category in turn, then the five pattern pages.",
    },
    {
      label: "Rebrand mid-build.",
      description:
        'Once three products had real content sitting in the system, "Fave Design System" stopped fitting; it wasn\'t documenting an abstract system anymore, it was documenting my own work. I renamed it HeadFavour and restyled the whole site dark, borrowing the palette from two of the products it already described, Stampdx and Idea OS, so the system\'s own skin is proof its rules hold up outside a demo.',
    },
    {
      label: "Products vanished, then explained themselves.",
      description:
        "After seeding real product content into Sanity, pages that should have shown it kept falling back to placeholder copy. It wasn't a bug in the strict sense; it was a question of which source owned the content at any given moment. A page checks Sanity first and only falls back to hardcoded copy when nothing's there, and a stale or partial seed can sit in that gap looking like nothing's wrong. Once traced, the fix was re-seeding with the corrected script; it left me with a rule I kept afterward: change a fallback in code, update the seed script to match, then re-run the seed.",
    },
    {
      label: "The search bar was UI before it was search.",
      description:
        "It rendered a text field and nothing else for a while. Wiring it up meant building a real index across static pages and live products, then debugging why the first click on a result would sometimes do nothing: the dropdown's outside-click handler was closing on mousedown, a beat before the link's own click finished, so the click landed on a dropdown that had already unmounted. Moving that listener from mousedown to click fixed it for good.",
    },
    {
      label: "Logo recolouring took two tries.",
      description:
        "The first approach used CSS mask-image to tint uploaded SVG marks per brand colour; the swatches rendered blank. The computed styles were correct, so the bug wasn't in the CSS itself, and digging further turned up a real cross-browser inconsistency in how mask-image reads an SVG's alpha versus its luminance. I dropped the mask approach and fetched each SVG server-side instead, stripped anything unsafe out of it and swapped its fills for currentColor before inlining it, which recolours cleanly everywhere.",
    },
    {
      label: '"Guardrails" stopped matching how it was used.',
      description:
        "The section was built around git-tracked markdown rules, meant to be reviewed like code. In practice, real spec documents came in entirely through the CMS upload path instead, and the git-tracked folder stayed empty. I renamed the section AI Taste/Guideline Docs to match what it had actually become, and added copy and download controls so a visitor can take the whole thing with them instead of reading it once and losing it.",
    },
  ]),

  imageGalleryBlock([
    "Home page before and after the rebrand — light Fave Design System next to dark HeadFavour. The palette shift alone doesn't explain why it reads as a different product; seeing them side by side does.",
  ]),

  videoBlock(
    "Topbar search, partial product name",
    "Typing a partial product name into the topbar search and clicking the result through. The fix here was about a click landing correctly, which is motion, not a still frame.",
  ),

  imageGalleryBlock([
    "MonieMatch's and Stampdx's marks rendered across their full brand palettes — the point of the feature is that one SVG file looks native in every colour; a single swatch doesn't make that case.",
  ]),

  quoteBlock("I didn't want a style guide that sat still while the products it describes kept moving, so I gave it a CMS and let it stay honest."),

  richTextBlock(
    undefined,
    paragraph(
      "The AI Taste/Guideline Docs section is the one place in the system where two content models sit side by side on purpose. Rule-level guidance I write and revise myself lives as markdown in the repo, reviewed the way I'd review any other change to the codebase. Full spec documents that already exist as finished files go through a straight upload in Sanity Studio instead, no pull request required. Neither path is more correct than the other; they suit different kinds of updates, and the platform pages render both together as one document without a visitor needing to know which path any given section came through. In practice, every real document in the section so far has come through the upload path; the git-tracked folder is still empty, which says less about the idea than about how I actually work.",
    ),
  ),

  richTextBlock(
    undefined,
    paragraph(
      "This is the only project in the portfolio that documents itself while documenting everything else; every rule on these pages had to hold up on a live, dark-themed, CMS-backed site before I'd let myself write it down. That constraint caught more than I expected: spacing that looked fine in isolation and wrong next to a real navy background; a search bar that worked on every manual click and still hid a race condition underneath. It's smaller than any of the four products it documents, and it's the one I'll probably keep changing the longest.",
    ),
  ),
];

// ---- fields the source doc didn't specify — reasoned choices, not TODOs ----
//
//   accent               soft indigo / emerald pair — chart block needs
//                        one and none was set; distinct from Corridor's
//                        green, Ensemble's blue/teal, Switchboard's
//                        indigo/orange.
//   processDisciplines   UI/UX + Web Development — matches the narrative
//                        (component library + CMS-backed site), no basis
//                        for more.
//   scale (sidebar)      headline stats mirrored from the metricsRow block.
//   techStack            merges the source's own tag list with the
//                        existing techStack's still-accurate entries.
//
// role, industry, cardSize, valueImpact, links, year, showOnPortfolio are
// left exactly as they already were — not touched by this script.

const patch = {
  name: "HeadFavour",
  slug: { _type: "slug", current: NEW_SLUG },
  oneLiner:
    "The design system behind four of my own products, and the first one I've ever been able to actually show; built as a living site instead of a static deck.",
  tags: ["Design System", "Next.js", "Sanity CMS", "TypeScript", "Personal Project"],
  projectType: ["Website"],
  techStack: ["Next.js", "TypeScript", "Sanity CMS", "Framer Motion"],
  accent: { primary: "#818CF8", secondary: "#34D399" },
  processDisciplines: ["UI/UX", "Web Development"],
  aiContext:
    "HeadFavour (formerly \"Fave Design System\") is the author's own design system — the first one they've ever been able to publicly show (past design-system work was NDA-protected). Documents 25 components across 6 categories, 8 foundation pages, 5 pattern pages, and 4 of the author's own products as full case studies, built as a living CMS-backed site (Next.js + Sanity) rather than a static deck, 29 commits from first scaffold to latest polish. It was renamed and restyled dark mid-build once it stopped documenting an abstract system and started documenting the author's own real products (Stampdx, Idea OS, MonieMatch among them) — the site's own dark skin borrows its palette from two of those products, as proof the rules hold up outside a demo. Has an \"AI Taste/Guideline Docs\" section combining git-tracked markdown rules with CMS-uploaded finished spec documents side by side. Explicitly built for a world where most of the actual building/QA on the author's products is done by AI agents, not human readers — the documentation is written for that audience first.",
  scale: [
    { value: "25", label: "Components" },
    { value: "4", label: "Products documented" },
    { value: "8", label: "Foundation pages" },
    { value: "29", label: "Commits" },
  ],
  blocks,
};

async function main() {
  const existing = await client.fetch<{
    _id: string;
    name?: string;
    blocks?: { _type: string; heading?: string }[];
  } | null>(`*[_type == "project" && slug.current == $slug][0]{ _id, name, blocks }`, { slug: OLD_SLUG });

  if (!existing) {
    console.error(`No project document found with slug "${OLD_SLUG}". Nothing to patch.`);
    process.exit(1);
  }

  console.log(`Found existing project "${existing.name}" (${existing._id})`);
  console.log(`\nCurrent ${existing.blocks?.length ?? 0} block(s) that would be REPLACED:`);
  for (const b of existing.blocks ?? []) {
    console.log(`    - ${b._type}${b.heading ? `: ${b.heading}` : ""}`);
  }

  console.log(`\n${write ? "Will replace with" : "[dry run] Would replace with"} ${blocks.length} new block(s):`);
  for (const b of blocks) {
    const label = "heading" in b && b.heading ? `: ${b.heading}` : "";
    console.log(`    - ${b._type}${label}`);
  }
  console.log(`\nAlso renaming: "${existing.name}" -> "${patch.name}", slug "${OLD_SLUG}" -> "${NEW_SLUG}".`);
  console.log("Preserved untouched: links, valueImpact, role, industry, cardSize, year, showOnPortfolio.");

  if (!write) {
    console.log("\nDry run only — re-run with --write once this looks right.");
    return;
  }

  await client.patch(existing._id).set(patch).commit();
  console.log(`\nDone — replaced content on ${existing._id}, now "${patch.name}" at /projects/${NEW_SLUG}.`);
  console.log("The old blocks are still recoverable from Studio's document History panel if you want them back.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
