# Migrating from the old portfolio's Sanity project

You don't need to hand-copy content — these scripts pull it over
programmatically. Here's the full workflow.

## 1. Get the old project's credentials

From [sanity.io/manage](https://sanity.io/manage) (pick the old portfolio's
project) or that repo's `sanity.config.ts` / `.env`:

- **Project ID** — a short alphanumeric string.
- **Dataset** — usually `production`.
- **API token** (only if reads aren't public) — API tab → Tokens → Add API
  token, "Viewer" permission is enough for this.

## 2. See what's actually there

```bash
OLD_SANITY_PROJECT_ID=xxxx OLD_SANITY_DATASET=production \
  npm run sanity:introspect
```

This connects read-only and prints every document type in the old dataset
along with the field names on a sample document of each type. Every old
Sanity schema names things a little differently — this tells you the real
shape instead of guessing.

## 3. Migrate projects

Open `migrate-from-old-cms.ts` and check the field-name guesses in
`mapOldProjectToNew()` against what step 2 printed. Adjust the `old.xxx ??
old.yyy` chains to match your actual field names.

Then, once you've also [set up the new Sanity project](../../README.md) and
have its credentials:

```bash
OLD_SANITY_PROJECT_ID=xxxx OLD_SANITY_DATASET=production \
NEW_SANITY_PROJECT_ID=yyyy NEW_SANITY_DATASET=production NEW_SANITY_TOKEN=yyyy \
  npm run sanity:migrate
```

This is a **dry run by default** — it prints what it would create without
writing anything. Re-run with `-- --write` once the printed list looks
right:

```bash
npm run sanity:migrate -- --write
```

The script only maps the fields an old portfolio schema is likely to have
(title, slug, excerpt, body, tags, year, role, tech stack). It can't invent
the new schema's `scale`, `accent`, or `projectType` fields, or rebuild the
`blocks[]` page-builder beyond dumping the old body copy into a single
`richText` block — open Studio (`/studio`) after migrating and fill those in
per project.

## 4. Bulk-seed Daily Design Dose from a folder of images

Studio only lets you add images to a DDD batch one at a time, which doesn't
scale to hundreds of files. `seed-ddd.ts` reads a whole folder at once
instead.

**Name your files so the date is unambiguous** — `2024-05-14.png` (or
`2024_05_14.png`) is the safest pattern; `May 14 2024.png` and
`05-14-2024.png` (month-day-year) also work. Don't use a two-digit year or a
bare `day-month` order — the script refuses to guess between them, on
purpose, since this DDD run spans May 2024 *and* May 2025 and a wrong guess
would silently misfile a real post under the wrong year.

Create a write token once: [sanity.io/manage](https://sanity.io/manage) ->
your project -> API -> Tokens -> Add API token -> **Editor** permission is
enough. `NEXT_PUBLIC_SANITY_PROJECT_ID`/`NEXT_PUBLIC_SANITY_DATASET` are
picked up from `.env.local` automatically if it's already set up; the token
isn't (never put a write token in `.env.local` — it's bundled into the
client build).

```bash
# 1. Dry run first — prints every filename's parsed date and the batches
#    it would create. Uploads and writes nothing.
SANITY_WRITE_TOKEN=xxxx npm run sanity:seed-ddd -- ./path/to/folder

# 2. Once the dates look right, actually upload and create the documents.
SANITY_WRITE_TOKEN=xxxx npm run sanity:seed-ddd -- ./path/to/folder --write
```

Images are grouped into batches of 50 by default (`--batch-size=100` to
change it), continuing the batch numbering from whatever's already live so
you can run this again later with a new folder of images without
colliding. Re-running against the *same* folder skips any date that's
already seeded automatically — pass `--force` to re-seed anyway.

## 5. Move "how I work" and "about me" content by hand

There's no script for `processTrack` or `siteSettings.about` — and honestly,
you don't want one. There's likely one about doc and a handful of process
phases; retyping a few paragraphs into the new Studio fields (`/studio` →
Site settings → About, and → Process tracks) takes a few minutes and is more
reliable than writing transform code for a shape we've never seen. Keep the
old site open in one tab and Studio in another, and copy across.
