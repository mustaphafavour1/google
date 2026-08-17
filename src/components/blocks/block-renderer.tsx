import type { ProjectBlock, Project } from "@/lib/types";
import { HeroBlock } from "./hero-block";
import { MetricsRowBlock } from "./metrics-row-block";
import { RichTextBlock } from "./rich-text-block";
import { SideBySideCardsBlock } from "./side-by-side-cards-block";
import { ImageGalleryBlock } from "./image-gallery-block";
import { ChartBlock } from "./chart-block";
import { QuoteBlock } from "./quote-block";
import { ProcessTimelineBlock } from "./process-timeline-block";

export function BlockRenderer({ block, project }: { block: ProjectBlock; project: Project }) {
  switch (block._type) {
    case "hero":
      return <HeroBlock block={block} project={project} />;
    case "metricsRow":
      return <MetricsRowBlock block={block} />;
    case "richText":
      return <RichTextBlock block={block} />;
    case "sideBySideCards":
      return <SideBySideCardsBlock block={block} />;
    case "imageGallery":
      return <ImageGalleryBlock block={block} project={project} />;
    case "chart":
      return <ChartBlock block={block} project={project} />;
    case "quote":
      return <QuoteBlock block={block} project={project} />;
    case "processTimeline":
      return <ProcessTimelineBlock block={block} />;
    default:
      return null;
  }
}

export function ProjectBlocks({ blocks, project }: { blocks: ProjectBlock[]; project: Project }) {
  return (
    <div className="flex flex-col gap-10">
      {blocks.map((block, i) => (
        <section
          key={block._key}
          className={i === 0 ? "" : "border-t border-hairline pt-10"}
        >
          <BlockRenderer block={block} project={project} />
        </section>
      ))}
    </div>
  );
}
