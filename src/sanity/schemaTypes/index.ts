import type { SchemaTypeDefinition } from "sanity";

import { project } from "./documents/project";
import { product } from "./documents/product";
import { industry } from "./documents/industry";
import { processTrack } from "./documents/processTrack";
import { skill } from "./documents/skill";
import { siteSettings } from "./documents/siteSettings";
import { jobApplicationVariant } from "./documents/jobApplicationVariant";
import { portfolioArchive } from "./documents/portfolioArchive";
import { backgroundPattern } from "./documents/backgroundPattern";
import { blogPost } from "./documents/blogPost";
import { dddEntry } from "./documents/dddEntry";

import { heroBlock } from "./objects/blocks/heroBlock";
import { metricsRowBlock } from "./objects/blocks/metricsRowBlock";
import { richTextBlock } from "./objects/blocks/richTextBlock";
import { sideBySideCardsBlock } from "./objects/blocks/sideBySideCardsBlock";
import { imageGalleryBlock } from "./objects/blocks/imageGalleryBlock";
import { chartBlock } from "./objects/blocks/chartBlock";
import { quoteBlock } from "./objects/blocks/quoteBlock";
import { processTimelineBlock } from "./objects/blocks/processTimelineBlock";
import { fullBleedImageBlock } from "./objects/blocks/fullBleedImageBlock";
import { imageGridBlock } from "./objects/blocks/imageGridBlock";
import { videoBlock } from "./objects/blocks/videoBlock";
import { textGridBlock } from "./objects/blocks/textGridBlock";
import { pipLinkPreviewBlock } from "./objects/blocks/pipLinkPreviewBlock";
import { sectionBreakBlock } from "./objects/blocks/sectionBreakBlock";

import { valueImpact } from "./objects/valueImpact";
import { projectAccent } from "./objects/projectAccent";
import { aboutSection } from "./objects/aboutSection";
import { socialLink } from "./objects/socialLink";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  project,
  product,
  industry,
  processTrack,
  skill,
  siteSettings,
  jobApplicationVariant,
  portfolioArchive,
  backgroundPattern,
  blogPost,
  dddEntry,
  // Page-builder blocks
  heroBlock,
  metricsRowBlock,
  richTextBlock,
  sideBySideCardsBlock,
  imageGalleryBlock,
  chartBlock,
  quoteBlock,
  processTimelineBlock,
  fullBleedImageBlock,
  imageGridBlock,
  videoBlock,
  textGridBlock,
  pipLinkPreviewBlock,
  sectionBreakBlock,
  // Shared objects
  valueImpact,
  projectAccent,
  aboutSection,
  socialLink,
];
