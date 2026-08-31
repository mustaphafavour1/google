import { cn } from "@/lib/utils";
import type { ImageGridBlock as ImageGridBlockT, Project } from "@/lib/types";

export function ImageGridBlock({ block, project }: { block: ImageGridBlockT; project: Project }) {
  return (
    <div>
      {block.heading && <h3 className="type-subheading mb-3">{block.heading}</h3>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {block.items.map((item, i) => (
          <figure
            key={i}
            className={cn(
              "overflow-hidden rounded-lg border border-hairline",
              item.span === 2 && "col-span-2",
            )}
          >
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
              <img src={item.image} alt={item.caption ?? ""} className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div
                className="flex aspect-[4/3] items-end p-3"
                style={{
                  background: `linear-gradient(${140 + i * 20}deg, ${project.accent.primary}26, ${project.accent.secondary}40)`,
                }}
              >
                <span className="rounded-full bg-surface/90 px-2 py-1 text-[10px] font-medium text-ink-soft">
                  Screen preview
                </span>
              </div>
            )}
            {item.caption && (
              <figcaption className="type-meta border-t border-hairline p-2.5">{item.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
