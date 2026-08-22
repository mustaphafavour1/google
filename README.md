# Favour Mustapha — Portfolio

A dashboard-format personal portfolio built with Next.js (App Router) and
Sanity. Content — projects, process, skills, about, contact, and
per-company job-application variants — is CMS-driven with an embedded
Sanity Studio, and falls back to local seed data automatically whenever
Sanity isn't configured or reachable.

## Stack

- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS v4**
- **Sanity** — schema + Studio in `src/sanity/`, embedded at `/studio`
- **Nivo** for charts, **next-themes** for the dark-mode toggle
- Fonts: **Parkinsans** (UI), **JetBrains Mono** (data/tech tags), **Caveat** (handwritten accents)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without any Sanity env
vars set, every page renders from the seed data in `src/lib/data/` — the
site is fully functional out of the box.

## CMS setup

1. **Create a Sanity project** at [sanity.io/manage](https://sanity.io/manage)
   ("Create project" — any name, any org). Note the **Project ID** it gives
   you; default the dataset name to `production`.
2. **Copy `.env.local.example` to `.env.local`** and fill in
   `NEXT_PUBLIC_SANITY_PROJECT_ID` (and `NEXT_PUBLIC_SANITY_DATASET` if you
   didn't use `production`).
3. **Add this app's URL to the project's CORS origins** — sanity.io/manage
   → your project → API → CORS Origins → Add origin (`http://localhost:3000`
   for local dev, plus your deployed URL later). This only matters if you
   later fetch from the browser; the app's own reads are server-side and
   don't need it, but Studio's own asset uploads do.
4. **Run the app** (`npm run dev`) and open `/studio`. Log in with your
   Sanity account — first-time login provisions your access to the project
   automatically since you created it.
5. **Populate content**: start with **Site settings** (profile, home
   metrics, about, contact) since nearly every page reads from it, then add
   your **Projects**, **Process tracks**, and **Skills**.

Once real documents exist, the corresponding pages switch from the seed
data to live Sanity content automatically (revalidates every 60s — no
redeploy needed for content edits).

### Content model

`src/sanity/schemaTypes/` mirrors `src/lib/types.ts` closely:

- **`project`** — case studies, with an ordered `blocks[]` page-builder
  (hero, metricsRow, richText, sideBySideCards, imageGallery, chart, quote,
  processTimeline) so each project's detail page can compose differently.
- **`processTrack`**, **`skill`** — flat content for the Process and Skills pages.
- **`siteSettings`** — a singleton (profile, home metrics, about copy,
  contact info, and the career-wide analytics aggregates).
- **`jobApplicationVariant`** — see below.

### Job-application variants

Add a `jobApplicationVariant` document in Studio — company name, role
title, a custom intro note, and which projects to feature — and it's live
at `/apply/{slug}` immediately (no rebuild). That page swaps in
company-aware copy ("How's Acme today?", "Projects most relevant to
Acme", "Unique contributions I can bring to Acme") and shows only the
projects you selected. These pages are `noindex` and not linked from the
main nav — share the link directly with whoever you're sending it to.

### Migrating from an older Sanity-based portfolio

See [`scripts/sanity/README.md`](scripts/sanity/README.md) — an
introspection script to see what's in the old project, and a migration
script (dry-run by default) to pull `project` documents across. About/
Process content is small enough that moving it by hand in Studio is
genuinely faster and more reliable than writing a transform for a schema
shape this repo has never seen.

## Design tokens

`src/app/globals.css` defines the full token system — a warm rose-gold
primary ramp, a cream page background, a warm-neutral ink ladder for text
hierarchy, and a 5-colour highlight palette (blue/green/orange/purple/teal)
reserved for situational text emphasis rather than the brand primary. All
primary and highlight colours are verified at ≥4.5:1 contrast against both
white and the cream background.

## Deployment

Any Next.js host works. Set the same env vars from `.env.local` in your
host's environment settings — the app degrades gracefully to seed data if
they're missing, so a first deploy before Sanity is fully populated is safe.
