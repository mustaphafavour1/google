import type { Project, SiteSettings } from "@/lib/types";

export type GalleryItem =
  | { key: string; kind: "image"; src: string; caption?: string; project?: { name: string; slug: string } }
  | {
      key: string;
      kind: "video-embed";
      embedUrl: string;
      caption?: string;
      project?: { name: string; slug: string };
    }
  | { key: string; kind: "video-file"; src: string; caption?: string; project?: { name: string; slug: string } };

/**
 * Flattens every image/video across all project page-builder blocks, plus
 * the Profile page's photo/video carousel, into one media list for the
 * Gallery. Done here in JS rather than in GROQ — the block union has too
 * many different shapes for a clean single projection, and this reuses the
 * already-fetched, already-defaulted project data instead of a second query.
 */
export function buildGalleryItems(
  projects: Project[],
  profileMedia: SiteSettings["profileMedia"],
): GalleryItem[] {
  const items: GalleryItem[] = [];

  for (const project of projects) {
    const projectRef = { name: project.name, slug: project.slug };
    for (const block of project.blocks) {
      if (block._type === "imageGallery") {
        for (const image of block.images) {
          if (image.src) {
            items.push({
              key: `${block._key}-${image.src}`,
              kind: "image",
              src: image.src,
              caption: image.caption,
              project: projectRef,
            });
          }
        }
      } else if (block._type === "imageGrid") {
        for (const item of block.items) {
          if (item.image) {
            items.push({
              key: `${block._key}-${item.image}`,
              kind: "image",
              src: item.image,
              caption: item.caption,
              project: projectRef,
            });
          }
        }
      } else if (block._type === "fullBleedImage") {
        if (block.image) {
          items.push({ key: block._key, kind: "image", src: block.image, caption: block.caption, project: projectRef });
        }
      } else if (block._type === "video") {
        if (block.embedUrl) {
          items.push({
            key: block._key,
            kind: "video-embed",
            embedUrl: block.embedUrl,
            caption: block.heading,
            project: projectRef,
          });
        }
      }
    }
  }

  profileMedia.forEach((media, i) => {
    if (media.image) {
      items.push({ key: `profile-media-${i}`, kind: "image", src: media.image, caption: media.caption });
    } else if (media.video) {
      items.push({ key: `profile-media-${i}`, kind: "video-file", src: media.video, caption: media.caption });
    }
  });

  return items;
}

/** Deterministic ~-2..2deg tilt per item, derived from its own key so it's stable across server/client renders. */
export function tiltForKey(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return (Math.abs(hash) % 400) / 100 - 2;
}

/** Fisher-Yates shuffle — called from a click handler only, never during render, so it needs no SSR-safe seeding. */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
