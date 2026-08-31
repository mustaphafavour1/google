import { cn } from "@/lib/utils";
import type { ProjectBlock, Project } from "@/lib/types";
import { HeroBlock } from "./hero-block";
import { MetricsRowBlock } from "./metrics-row-block";
import { RichTextBlock } from "./rich-text-block";
import { SideBySideCardsBlock } from "./side-by-side-cards-block";
import { ImageGalleryBlock } from "./image-gallery-block";
import { ChartBlock } from "./chart-block";
import { QuoteBlock } from "./quote-block";
import { ProcessTimelineBlock } from "./process-timeline-block";
import { FullBleedImageBlock } from "./full-bleed-image-block";
import { ImageGridBlock } from "./image-grid-block";
import { VideoBlock } from "./video-block";
import { TextGridBlock } from "./text-grid-block";
import { PipLinkPreviewBlock } from "./pip-link-preview-block";

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
    case "fullBleedImage":
      return <FullBleedImageBlock block={block} project={project} />;
    case "imageGrid":
      return <ImageGridBlock block={block} project={project} />;
    case "video":
      return <VideoBlock block={block} project={project} />;
    case "textGrid":
      return <TextGridBlock block={block} />;
    case "pipLinkPreview":
      return <PipLinkPreviewBlock block={block} />;
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
          id={block._key}
          className={cn("scroll-mt-24", i === 0 ? "" : "border-t border-hairline pt-10")}
        >
          <BlockRenderer block={block} project={project} />
        </section>
      ))}
    </div>
  );
}
