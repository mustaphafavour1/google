import { ProjectImage } from "./project-image";
import type { ImageGridBlock as ImageGridBlockT } from "@/lib/types";

export function ImageGridBlock({ block }: { block: ImageGridBlockT }) {
  const items = block.items.filter(
    (item): item is typeof item & { image: string } => Boolean(item.image),
  );

  return (
    <div>
      {block.heading && <h3 className="type-subheading mb-3">{block.heading}</h3>}
      <div className="flex flex-col gap-4">
        {items.map((item, i) => (
          <ProjectImage key={i} src={item.image} caption={item.caption} />
        ))}
      </div>
    </div>
  );
}
