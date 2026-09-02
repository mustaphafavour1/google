import { ProjectImage } from "./project-image";
import type { ImageGalleryBlock as ImageGalleryBlockT } from "@/lib/types";

export function ImageGalleryBlock({ block }: { block: ImageGalleryBlockT }) {
  const images = block.images.filter(
    (image): image is typeof image & { src: string } => Boolean(image.src),
  );

  return (
    <div>
      {block.heading && <h3 className="type-subheading mb-3">{block.heading}</h3>}
      <div className="flex flex-col gap-4">
        {images.map((image, i) => (
          <ProjectImage key={i} src={image.src} caption={image.caption} />
        ))}
      </div>
    </div>
  );
}
