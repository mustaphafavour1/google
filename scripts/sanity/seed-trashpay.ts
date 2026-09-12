/**
 * One-off: creates the "TrashPay" case-study project document from
 * scratch, seeded from uploads/7b9baae7-thrashpay-case-study.md — a
 * marketing site for a waste-to-value platform, live at
 * https://thrashpay.vercel.app/ (that's the real deployed URL — note it
 * reads "thrashpay", not "trashpay", which is just how the Vercel
 * project itself got named; the case study's own title is "TrashPay").
 *
 * Confirmed no existing "trashpay"-ish project document before writing
 * this (checked both slug and name against every project doc in the
 * dataset).
 *
 * Every content block maps 1:1 to a "##" section in the source doc, in
 * the same order, using the existing block schema (quote, metricsRow,
 * processTimeline, sideBySideCards, imageGallery, video, richText) —
 * nothing new added to the schema. The source's imageGallery section has
 * 4 placeholder items; only the one explicitly labeled "Screen
 * recording of..." became a video block, the other 3 (including one
 * whose own description says a static capture won't fully carry it)
 * stayed as imageGallery entries, split into two gallery blocks around
 * the video to preserve the source's original reading order without
 * fragmenting into more blocks than necessary.
 *
 * No real screenshots or recordings exist for this yet either — the
 * source doc's own items are literally named "placeholder:" — so, same
 * as Ensemble, every imageGallery/video block here is caption-only (no
 * file) and showOnPortfolio is seeded false. Unlike Ensemble though,
 * this one already has a live, working deployed URL, so it may be worth
 * turning showOnPortfolio on sooner — that's your call, not assumed here.
 *
 * Safe to run more than once: if a project document with this _id
 * already exists, the script refuses to touch it unless you also pass
 * --force (createOrReplace would otherwise silently wipe out any edits
 * made in Studio since the last run).
 *
 * Dry-run by default — prints the full document it would create, writes
 * nothing. Pass --write to actually create it.
 *
 * Usage:
 *   npm run sanity:seed-trashpay            # dry run
 *   npm run sanity:seed-trashpay -- --write # actually writes
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
const force = process.argv.includes("--force");

const client = createClient({
  projectId: process.env.NEW_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "rycezmf9",
  dataset: process.env.NEW_SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: requireEnv("NEW_SANITY_TOKEN"),
  useCdn: false,
});

const SLUG = "trashpay";
const DOC_ID = `project-${SLUG}`;

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

function processTimelineBlock(heading: string, phases: { label: string; description: string }[]) {
  return {
    _type: "processTimeline",
    _key: randomUUID(),
    heading,
    phases: phases.map((p) => ({ _key: randomUUID(), ...p })),
  };
}

function sideBySideCardsBlock(heading: string, cards: { title: string; body: string }[]) {
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

// ---- content, mapped 1:1 from the source doc's section order ----------

const blocks = [
  quoteBlock(
    "The first draft looked right and ran badly; the second round was mostly about noticing that and fixing it before shipping it as done.",
  ),

  metricsRowBlock([
    { value: "11", label: "sections, one continuous scroll page" },
    { value: "13", label: "components, 2,141 lines of TSX" },
    { value: "10", label: "commits across 3 rounds of revision" },
    { value: "2", label: "canvas particle systems, both throttled to 30fps" },
    { value: "0", label: "external image requests after the performance pass (down from 12+)" },
    { value: "1", label: "custom two-layer text animation (outline-to-fill sweep)" },
  ]),

  processTimelineBlock("How the build actually moved", [
    {
      label: "Initial build",
      description:
        "All 11 sections scaffolded in one pass — Hero, Problem, How It Works, Features, Impact Numbers, Materials, Pricing, For Companies, Social Proof, CTA Banner, Footer. Color system and type pairing (Syne display, Teachers body) locked in as Tailwind v4 theme tokens.",
    },
    {
      label: "First revision pass",
      description:
        "Nine separate fixes landed in one commit after review — hero type size capped with a clamp(), the Problem section's three cards reworked from a simple fade-in into a stacked-then-separating entrance, and the Impact Numbers section rebuilt from plain count-up text into a two-layer outline-then-fill sweep.",
    },
    {
      label: "Animation timing corrected",
      description:
        "The outline-to-fill sweep shipped too fast to read. Fill duration went from 1s to 3.2s and the stagger between metrics from 0.55s to 1.8s, with the easing curve changed to a custom bezier so the sweep reads as deliberate rather than flickery.",
    },
    {
      label: "Copy and layout condensed",
      description:
        "For Companies went from six benefit rows with emoji icons and two-sentence descriptions to six plain-text pill chips — a naming and information-density call, not just a style pass. Materials grid was pinned to a minimum height so cards expanding on hover no longer reflow the section around them.",
    },
    {
      label: "Performance audit and rewrite",
      description:
        "The hero's particle canvas was drawing emoji glyphs via fillText, which forces a full system font fallback per particle per frame. Rewritten to draw plain rotated rectangles instead, cut the particle count from 40 to 28, capped both canvases at 30fps by timestamp delta, and added an IntersectionObserver so neither one draws while scrolled off-screen. Separately, every testimonial photo and avatar was swapped from live Unsplash URLs to CSS-only placeholders and initials badges, removing all external image requests from the page.",
    },
    {
      label: "Content and asset cleanup",
      description:
        "A duplicate \"For Companies\" button was pulled from the navbar once it was noticed the nav link already went to the same place. The real logo was uploaded partway through and wired into the navbar and footer in place of a text mark, then resized down after it first rendered oversized.",
    },
  ]),

  sideBySideCardsBlock("Two decisions that changed shape mid-build", [
    {
      title: "Impact numbers — from static to two-layer",
      body: "Started as a simple count-up. Became a stroked-outline number that fills with color left to right on scroll, one metric after another, once a plain count felt too static for a page about turning waste into value.",
    },
    {
      title: "For Companies — from icon rows to chips",
      body: "Six benefits started as icon-plus-sentence rows down the page. Compressed to plain-text pill chips once the row format read as padding rather than information; the shorter form forced each benefit down to a phrase that had to earn its place.",
    },
  ]),

  imageGalleryBlock([
    "Hero section, mid-scroll into view — the particle canvas and the outline-to-fill headline only read correctly in motion; a static capture won't show why the rewrite from emoji-based particles to plain shapes mattered.",
  ]),

  videoBlock(
    "Impact Numbers section, scrolling into view",
    "This is the section that went through an explicit timing correction (1s to 3.2s fill, 0.55s to 1.8s stagger). The before/after is a pacing difference that only exists in motion.",
  ),

  imageGalleryBlock([
    "Problem section, before and mid-separation — the three cards start stacked with the center card offset lower, then spring apart on scroll. A single still loses the entrance; two frames a beat apart would carry it.",
    "For Companies section, current chip layout — shows the final six-chip benefit row next to the condensed two-sentence intro, the end state of the copy-and-layout condensing pass.",
  ]),

  richTextBlock(
    undefined,
    paragraph(
      "This was a self-directed build, not a client engagement, so there's no user data or business outcome to report. What's real is the revision record: a first pass that looked complete, a review that caught three separate problems in it (timing, density, and raw runtime cost), and a second pass that fixed all three rather than polishing around them. The performance pass in particular came from profiling the actual page rather than guessing — the emoji-particle rewrite alone was the difference between a hero that stuttered on scroll and one that didn't.",
    ),
  ),
];

// ---- fields the source doc didn't specify — reasoned choices, not TODOs ----
//
//   industry            "Sustainability" — the product's own domain
//                        (waste-to-value platform).
//   year                current year — this is a brand-new project.
//   role                "Product design · frontend build" — same
//                        convention as Ensemble and Switchboard.
//   techStack            the hero's own tags, version numbers stripped
//                        (tags keep "Next.js 16" etc.; techStack doesn't
//                        need the version specificity).
//   accent               green/amber pair — "waste-to-value" fits a
//                        sustainability-green + gold-value pairing;
//                        distinct from every other project's accent.
//   processDisciplines   UI/UX + Web Development — this is a marketing
//                        SITE build (component/animation/performance
//                        engineering), not a campaigns/marketing
//                        engagement in this portfolio's own sense of
//                        that discipline.
//   scale (sidebar)      headline stats mirrored from the metricsRow block.
//   showOnPortfolio      false — the source's own gallery items are
//                        literally named "placeholder:", same signal as
//                        Ensemble (no real media yet). Worth
//                        reconsidering sooner than Ensemble though,
//                        since this one already has a live, working URL.
//
// All of these are one field each in Studio (Info & Meta / Scale &
// Scores tabs) if you want to change any of them.

const doc = {
  _type: "project",
  _id: DOC_ID,
  name: "TrashPay",
  slug: { _type: "slug", current: SLUG },
  oneLiner:
    "A marketing site for a waste-to-value platform, built section by section with Next.js and Framer Motion, then rebuilt where the first pass didn't hold up.",
  showOnPortfolio: false,
  tags: ["Next.js 16", "Framer Motion 12", "Tailwind CSS v4", "TypeScript"],
  industry: "Sustainability",
  projectType: ["Website"],
  year: new Date().getFullYear(),
  role: "Product design · frontend build",
  techStack: ["Next.js", "Framer Motion", "Tailwind CSS", "TypeScript"],
  links: [{ label: "Live site", url: "https://thrashpay.vercel.app/" }],
  accent: { primary: "#22C55E", secondary: "#F59E0B" },
  processDisciplines: ["UI/UX", "Web Development"],
  aiContext:
    "TrashPay is a portfolio case study: a marketing site for a fictional/self-directed waste-to-value platform, built with Next.js 16, Framer Motion 12, Tailwind CSS v4 and TypeScript. 11 sections on one continuous scroll page, 13 components, 2,141 lines of TSX, 10 commits across 3 rounds of revision. Not a client engagement — a self-directed build whose real story is the revision record: an initial pass that scaffolded all 11 sections and looked complete, a review that caught three separate problems (animation timing shipped too fast to read, an icon-heavy section that read as padding rather than information, and a performance issue where the hero's particle canvas drew emoji glyphs via fillText, forcing a full font fallback per particle per frame), and a second pass that fixed all three: retimed the outline-to-fill number sweep (1s to 3.2s fill duration), condensed a six-benefit icon-row section into plain-text pill chips, and rewrote the particle system to draw plain rotated rectangles instead of emoji, cut particle count, capped both canvases at 30fps, added IntersectionObserver gating, and removed every external image request (swapped Unsplash photos for CSS-only placeholders/initials badges) — 0 external image requests after the performance pass, down from 12+. Live at https://thrashpay.vercel.app/.",
  scale: [
    { value: "11", label: "Sections" },
    { value: "13", label: "Components" },
    { value: "2,141", label: "Lines of TSX" },
    { value: "10", label: "Commits" },
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
  console.log(`  live link: ${doc.links[0].url}`);
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
      "in Studio, then flip \"Show on portfolio\" on when it's ready (or sooner, since the live site already exists).",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
