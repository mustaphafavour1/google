import { cn } from "@/lib/utils";
import type { ImageGalleryBlock as ImageGalleryBlockT, Project } from "@/lib/types";

const aspectClass: Record<string, string> = {
  wide: "aspect-[16/10]",
  square: "aspect-square",
  tall: "aspect-[3/4]",
};

export function ImageGalleryBlock({
  block,
  project,
}: {
  block: ImageGalleryBlockT;
  project: Project;
}) {
  return (
    <div>
      {block.heading && <h3 className="type-subheading mb-3">{block.heading}</h3>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {block.images.map((image, i) => (
          <figure key={i} className="overflow-hidden rounded-lg border border-hairline">
            <div
              className={cn("relative flex items-end p-4", aspectClass[image.aspect ?? "wide"])}
              style={{
                background: `linear-gradient(160deg, ${project.accent.primary}26, ${project.accent.secondary}3d)`,
              }}
            >
              <span className="rounded-full bg-surface/90 px-2 py-1 text-[10px] font-medium text-ink-soft">
                Screen preview
              </span>
            </div>
            {image.caption && (
              <figcaption className="type-meta border-t border-hairline p-3">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
