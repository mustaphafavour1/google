import type { SchemaTypeDefinition } from "sanity";

import { project } from "./documents/project";
import { processTrack } from "./documents/processTrack";
import { skill } from "./documents/skill";
import { siteSettings } from "./documents/siteSettings";
import { jobApplicationVariant } from "./documents/jobApplicationVariant";

import { heroBlock } from "./objects/blocks/heroBlock";
import { metricsRowBlock } from "./objects/blocks/metricsRowBlock";
import { richTextBlock } from "./objects/blocks/richTextBlock";
import { sideBySideCardsBlock } from "./objects/blocks/sideBySideCardsBlock";
import { imageGalleryBlock } from "./objects/blocks/imageGalleryBlock";
import { chartBlock } from "./objects/blocks/chartBlock";
import { quoteBlock } from "./objects/blocks/quoteBlock";
import { processTimelineBlock } from "./objects/blocks/processTimelineBlock";

import { projectScale } from "./objects/projectScale";
import { valueImpact } from "./objects/valueImpact";
import { projectAccent } from "./objects/projectAccent";
import { aboutSection } from "./objects/aboutSection";
import { socialLink } from "./objects/socialLink";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  project,
  processTrack,
  skill,
  siteSettings,
  jobApplicationVariant,
  // Page-builder blocks
  heroBlock,
  metricsRowBlock,
  richTextBlock,
  sideBySideCardsBlock,
  imageGalleryBlock,
  chartBlock,
  quoteBlock,
  processTimelineBlock,
  // Shared objects
  projectScale,
  valueImpact,
  projectAccent,
  aboutSection,
  socialLink,
];
