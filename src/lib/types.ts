/**
 * Content shape mirrors a Sanity schema on purpose: document types (Project, Skill,
 * ProcessTrack) and a typed, ordered `blocks[]` array on Project (Sanity's
 * block-content / page-builder pattern). Swapping the seed data module in
 * `lib/data/` for `next-sanity` queries later shouldn't require touching the
 * components that render it.
 */

import type { PortableTextBlock } from "@portabletext/types";

export type ScaleMetric = {
  value: string;
  label: string;
};

export type PortableTextImageEntry = {
  _type: "image";
  _key: string;
  url?: string;
};

export type RichContentValue = (PortableTextBlock | PortableTextImageEntry)[];

export type ProjectLink = {
  label: string;
  url: string;
};

export type ValueImpact = {
  label: string;
  amount: number;
  /** true when the figure is illustrative/estimated rather than a reported result */
  estimated?: boolean;
};

// ---- ProjectBlock union -----------------------------------------------------

export type HeroBlock = {
  _type: "hero";
  _key: string;
  eyebrow?: string;
  heading: string;
  body?: string;
  image?: string;
};

export type MetricsRowBlock = {
  _type: "metricsRow";
  _key: string;
  heading?: string;
  metrics: { label: string; value: string; caption?: string }[];
};

export type RichTextBlock = {
  _type: "richText";
  _key: string;
  heading?: string;
  content: RichContentValue;
};

export type SideBySideCardsBlock = {
  _type: "sideBySideCards";
  _key: string;
  heading?: string;
  cards: { title: string; body: string; tone?: "default" | "primary" }[];
};

export type ImageGalleryBlock = {
  _type: "imageGallery";
  _key: string;
  heading?: string;
  images: { src?: string; caption?: string; aspect?: "wide" | "square" | "tall" }[];
};

export type ChartDataPoint = {
  label: string;
  value: number;
};

export type ChartBlock = {
  _type: "chart";
  _key: string;
  heading?: string;
  caption?: string;
  chartType: "bar" | "line" | "pie";
  data: ChartDataPoint[];
};

export type QuoteBlock = {
  _type: "quote";
  _key: string;
  quote: string;
  attribution?: string;
  role?: string;
};

export type ProcessTimelineBlock = {
  _type: "processTimeline";
  _key: string;
  heading?: string;
  phases: { label: string; description: string }[];
};

export type FullBleedImageBlock = {
  _type: "fullBleedImage";
  _key: string;
  image?: string;
  caption?: string;
  aspect?: "wide" | "ultrawide" | "tall";
};

export type ImageGridBlock = {
  _type: "imageGrid";
  _key: string;
  heading?: string;
  items: { image?: string; caption?: string; span?: 1 | 2 }[];
};

export type VideoBlock = {
  _type: "video";
  _key: string;
  heading?: string;
  caption?: string;
  embedUrl?: string;
  duration?: string;
};

export type TextGridBlock = {
  _type: "textGrid";
  _key: string;
  heading?: string;
  columns?: 2 | 3 | 4;
  items: { title: string; body: string }[];
};

export type PipLinkPreviewBlock = {
  _type: "pipLinkPreview";
  _key: string;
  title: string;
  description?: string;
  url: string;
  linkLabel?: string;
};

export type SectionBreakBlock = {
  _type: "sectionBreak";
  _key: string;
  title: string;
  subtitle?: string;
};

export type ProjectBlock =
  | HeroBlock
  | MetricsRowBlock
  | RichTextBlock
  | SideBySideCardsBlock
  | ImageGalleryBlock
  | ChartBlock
  | QuoteBlock
  | ProcessTimelineBlock
  | FullBleedImageBlock
  | ImageGridBlock
  | VideoBlock
  | TextGridBlock
  | PipLinkPreviewBlock
  | SectionBreakBlock;

// ---- Documents ---------------------------------------------------------------

export type Project = {
  _id: string;
  slug: string;
  name: string;
  oneLiner: string;
  industry: string;
  coverImage?: string;
  coverGifUrl?: string;
  tags: string[];
  projectType: "Dashboard" | "App" | "Website" | "Branding" | "Campaign";
  year: number;
  role: string;
  techStack: string[];
  links: ProjectLink[];
  scale: ScaleMetric[];
  valueImpact?: ValueImpact;
  complexity?: number;
  recency?: number;
  cardSize?: "small" | "wide" | "tall" | "large";
  accent: {
    primary: string;
    secondary: string;
  };
  processDisciplines?: ProcessDiscipline[];
  aiContext?: string;
  showOnPortfolio: boolean;
  blocks: ProjectBlock[];
};

export type SkillCategory = "Product / UX" | "Visual / Brand" | "Technical" | "Tools";

export type Skill = {
  _id: string;
  name: string;
  category: SkillCategory;
  group: string;
};

export type SkillGroup = {
  _id: string;
  title: string;
  order: number;
  pills: string[];
};

export type DesignSuperpower = {
  _id: string;
  title: string;
  subtitle: string;
  order: number;
};

export type ProcessDiscipline =
  | "Overall"
  | "AI-workflow"
  | "UI/UX"
  | "Web Development"
  | "Branding"
  | "Campaigns & Marketing";

export type ProcessPhase = {
  label: string;
  description: string;
};

export type ProcessTrack = {
  _id: string;
  discipline: ProcessDiscipline;
  summary: string;
  phases: ProcessPhase[];
};

// ---- Site settings (singleton) -----------------------------------------------

export type SiteMetric = {
  key: string;
  label: string;
  value: string;
  isPlaceholder: boolean;
};

export type AboutSection = {
  heading: string;
  paragraphs: string[];
};

export type SocialLink = {
  label: string;
  href: string;
};

export type Hobby = {
  label: string;
  note?: string;
  image?: string;
};

export type ProfileMediaItem = {
  image?: string;
  video?: string;
  caption?: string;
};

export type JourneyMilestone = {
  year: string;
  text: string;
};

export type WorkingTogetherItem = {
  discipline: ProcessDiscipline;
  description: string;
};

export type SiteSettings = {
  profile: {
    name: string;
    firstName: string;
    title: string;
    location: string;
    tagline: string;
    founderNote: string;
    brandTextRotation: string[];
  };
  featuredProjects: Project[];
  profileMedia: ProfileMediaItem[];
  landing: {
    hero: {
      title: string;
      titleUnderText: string;
      subtitle: string;
      ctaPrimaryLabel: string;
      ctaSecondaryLabel: string;
    };
    journeyMilestones: JourneyMilestone[];
    workingTogetherItems: WorkingTogetherItem[];
  };
  siteMetrics: SiteMetric[];
  about: {
    design: AboutSection;
    general: AboutSection;
  };
  contact: {
    email: string;
    resumeUrl?: string;
    resumeVariants: { label: string; url: string }[];
    website: SocialLink;
    socials: SocialLink[];
  };
  hobbies: Hobby[];
  analyticsAggregate: {
    projectTypeBreakdown: { type: string; count: number }[];
    projectsOverTime: { year: string; count: number }[];
  };
  dddSubtitle: string;
};

// ---- AI context ------------------------------------------------------------------

export type AiContextEntry = {
  name: string;
  content: string;
};

// ---- Background patterns --------------------------------------------------------

export type BackgroundPatternPageKey =
  | "overview"
  | "projects"
  | "gallery"
  | "profile"
  | "playground"
  | "archive"
  | "process"
  | "skills"
  | "contact"
  | "analytics"
  | "blog"
  | "ddd";

export type BackgroundPattern = {
  _id: string;
  title: string;
  svgUrl?: string;
  enabled: boolean;
  global: boolean;
  pages: BackgroundPatternPageKey[];
  projectSlugs: string[];
};

// ---- My products ----------------------------------------------------------------

export type Product = {
  _id: string;
  name: string;
  coverImage?: string;
  description: string;
  link: string;
};

// ---- Portfolio archive ---------------------------------------------------------

export type PortfolioArchiveEntry = {
  _id: string;
  year: string;
  url: string;
  image?: string;
  description: string;
};

// ---- Blog -----------------------------------------------------------------------

export type BlogPost = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  publishedAt: string;
  tags: string[];
  content: RichContentValue;
};

// ---- Daily Design Dose ------------------------------------------------------------

export type DddEntry = {
  _id: string;
  image: string;
  day?: number;
  date?: string;
  caption?: string;
};

// ---- Job application variant --------------------------------------------------

export type JobApplicationVariant = {
  _id: string;
  companyName: string;
  slug: string;
  roleTitle?: string;
  introNote?: string;
  selectedProjects: Project[];
};
