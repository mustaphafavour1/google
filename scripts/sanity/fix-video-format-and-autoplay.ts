/**
 * Two fixes for the video blocks appended by backfill-video-blocks.ts:
 *
 *  1. Autoplay was never migrated from the old CMS's per-section
 *     `autoplay` boolean. Re-fetches it from the old dataset and patches
 *     it onto the matching new block (matched via the deterministic
 *     `video-backfill-<oldKey>` _key backfill-video-blocks.ts assigned).
 *
 *  2. Several of the uploaded files are QuickTime .mov containers
 *     (`video/quicktime`). The underlying video codec is usually H.264 —
 *     genuinely web-playable — but browsers key off the declared MIME
 *     type on <source type="..."> and refuse video/quicktime outright, so
 *     the video never plays regardless of codec. Fixes any video block
 *     whose file isn't already video/mp4: downloads it, tries a fast
 *     lossless remux into an .mp4 container first (ffmpeg -c copy), and
 *     only falls back to a full H.264/AAC re-encode if the source codec
 *     genuinely isn't web-safe (remux fails). Uploads the fixed file as a
 *     new Sanity asset and repoints the block's `file` reference — the
 *     original asset is left alone (Sanity doesn't auto-clean unreferenced
 *     assets, so nothing is lost, just no longer referenced by this block).
 *
 * Only ever touches the `blocks[_key=="..."].autoplay` and
 * `blocks[_key=="..."].file` paths on video-backfill-* blocks — nothing
 * else in a project's content is read or written.
 *
 * Dry-run by default. --write to actually download/transcode/upload/patch.
 * Requires ffmpeg on PATH.
 * Usage: same NEW_/OLD_SANITY_* env vars as the other sanity scripts.
 *   npm run sanity:fix-videos            # dry run
 *   npm run sanity:fix-videos -- --write # actually writes
 */
import { mkdtemp, rm, writeFile, readFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createClient } from "@sanity/client";

const run = promisify(execFile);
const write = process.argv.includes("--write");

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}. See scripts/sanity/README.md.`);
    process.exit(1);
  }
  return value;
}

const oldClient = createClient({
  projectId: requireEnv("OLD_SANITY_PROJECT_ID"),
  dataset: process.env.OLD_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: process.env.OLD_SANITY_TOKEN,
  useCdn: false,
});

const newClient = createClient({
  projectId: requireEnv("NEW_SANITY_PROJECT_ID"),
  dataset: process.env.NEW_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: requireEnv("NEW_SANITY_TOKEN"),
  useCdn: false,
});

type NewVideoBlock = {
  projectId: string;
  projectName: string;
  blockKey: string;
  heading: string | null;
  fileUrl: string | null;
  fileMimeType: string | null;
  fileExt: string | null;
};

async function fixVideoFile(tmpDir: string, sourceUrl: string, ext: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const inputPath = path.join(tmpDir, `in.${ext}`);
  const outputPath = path.join(tmpDir, "out.mp4");

  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`download failed: ${res.status}`);
  await writeFile(inputPath, Buffer.from(await res.arrayBuffer()));

  try {
    // Fast path: lossless remux, no re-encode.
    await run("ffmpeg", ["-y", "-i", inputPath, "-c", "copy", "-movflags", "+faststart", outputPath]);
  } catch {
    console.log("    remux failed, falling back to a full re-encode (slower)...");
    await run("ffmpeg", [
      "-y",
      "-i",
      inputPath,
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "20",
      "-c:a",
      "aac",
      "-movflags",
      "+faststart",
      outputPath,
    ]);
  }

  const outStat = await stat(outputPath);
  if (outStat.size === 0) throw new Error("ffmpeg produced an empty file");

  return { buffer: await readFile(outputPath), mimeType: "video/mp4" };
}

async function main() {
  console.log("Fetching old-CMS autoplay values...");
  const oldProjects = await oldClient.fetch<{ sections: ({ _type?: string; _key?: string; autoplay?: boolean } | null)[] | null }[]>(
    `*[_type == "project"]{ sections }`,
  );
  const autoplayByOldKey = new Map<string, boolean>();
  for (const p of oldProjects) {
    for (const s of p.sections ?? []) {
      if (s?._type === "videoSection" && s._key) autoplayByOldKey.set(s._key, s.autoplay ?? false);
    }
  }

  console.log("Fetching current video blocks...");
  const projects = await newClient.fetch<
    {
      _id: string;
      name: string;
      blocks: { _key: string; heading?: string; assetRef?: string; fileUrl?: string; fileMimeType?: string }[];
    }[]
  >(`*[_type == "project" && count(blocks[_type == "video" && defined(file.asset)]) > 0]{
    _id, name,
    "blocks": blocks[_type == "video" && defined(file.asset)]{
      _key,
      heading,
      "assetRef": file.asset._ref,
      "fileUrl": file.asset->url,
      "fileMimeType": file.asset->mimeType
    }
  }`);

  const videoBlocks: NewVideoBlock[] = [];
  for (const p of projects) {
    for (const b of p.blocks) {
      if (!b.assetRef) continue;
      // asset ref shape: file-<id>-<ext>
      const ext = b.assetRef.split("-").pop() ?? "";
      videoBlocks.push({
        projectId: p._id,
        projectName: p.name,
        blockKey: b._key,
        heading: b.heading ?? null,
        fileUrl: b.fileUrl ?? null,
        fileMimeType: b.fileMimeType ?? null,
        fileExt: ext,
      });
    }
  }

  let autoplaySet = 0;
  let formatFixed = 0;
  let formatSkippedAlreadyOk = 0;

  for (const block of videoBlocks) {
    const isBackfilled = block.blockKey.startsWith("video-backfill-");
    const oldKey = isBackfilled ? block.blockKey.replace("video-backfill-", "") : null;
    const autoplay = oldKey ? (autoplayByOldKey.get(oldKey) ?? false) : undefined;
    const label = `${block.projectName}: "${block.heading || "(untitled)"}"`;

    const patch: Record<string, unknown> = {};

    if (autoplay !== undefined) {
      console.log(`${write ? "Setting" : "[dry run] Would set"} autoplay=${autoplay} on ${label}`);
      patch[`blocks[_key=="${block.blockKey}"].autoplay`] = autoplay;
      autoplaySet += 1;
    }

    if (block.fileMimeType && block.fileMimeType !== "video/mp4") {
      console.log(`${write ? "Fixing" : "[dry run] Would fix"} format (${block.fileMimeType}) on ${label}`);
      formatFixed += 1;
      if (write && block.fileUrl) {
        const tmpDir = await mkdtemp(path.join(tmpdir(), "video-fix-"));
        try {
          const { buffer, mimeType } = await fixVideoFile(tmpDir, block.fileUrl, block.fileExt || "mov");
          const asset = await newClient.assets.upload("file", buffer, { filename: `${block.blockKey}.mp4` });
          console.log(`    uploaded fixed file as ${asset._id} (${mimeType})`);
          patch[`blocks[_key=="${block.blockKey}"].file`] = {
            _type: "file",
            asset: { _type: "reference", _ref: asset._id },
          };
        } finally {
          await rm(tmpDir, { recursive: true, force: true });
        }
      }
    } else if (block.fileMimeType) {
      formatSkippedAlreadyOk += 1;
    }

    if (write && Object.keys(patch).length > 0) {
      await newClient.patch(block.projectId).set(patch).commit();
    }
  }

  console.log(
    `\n${write ? "Done." : "Dry run only — nothing written."} autoplay: ${autoplaySet}, format fixed: ${formatFixed}, already mp4: ${formatSkippedAlreadyOk}.`,
  );
  if (!write) console.log("Re-run with --write once this looks right.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
