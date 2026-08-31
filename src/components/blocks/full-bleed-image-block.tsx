import { cn } from "@/lib/utils";
import type { FullBleedImageBlock as FullBleedImageBlockT, Project } from "@/lib/types";

const aspectClass: Record<string, string> = {
  wide: "aspect-[16/9]",
  ultrawide: "aspect-[21/9]",
  tall: "aspect-[4/5]",
};

export function FullBleedImageBlock({
  block,
  project,
}: {
  block: FullBleedImageBlockT;
  project: Project;
}) {
  return (
    <figure className="-mx-5 sm:-mx-8 lg:-mx-10">
      {block.image ? (
        // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
        <img
          src={block.image}
          alt={block.caption ?? ""}
          className={cn("w-full object-cover", aspectClass[block.aspect ?? "wide"])}
        />
      ) : (
        <div
          className={cn(
            "relative flex items-end justify-start p-6 sm:p-10",
            aspectClass[block.aspect ?? "wide"],
          )}
          style={{
            background: `linear-gradient(135deg, ${project.accent.primary}, ${project.accent.secondary})`,
          }}
        >
          <span className="rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-medium text-white/90">
            Full-bleed preview
          </span>
        </div>
      )}
      {block.caption && (
        <figcaption className="type-meta mx-5 mt-2 sm:mx-8 lg:mx-10">{block.caption}</figcaption>
      )}
    </figure>
  );
}
