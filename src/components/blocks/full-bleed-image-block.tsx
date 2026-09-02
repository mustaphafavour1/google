import { ProjectImage } from "./project-image";
import type { FullBleedImageBlock as FullBleedImageBlockT } from "@/lib/types";

export function FullBleedImageBlock({ block }: { block: FullBleedImageBlockT }) {
  if (!block.image) return null;
  return <ProjectImage src={block.image} caption={block.caption} />;
}
