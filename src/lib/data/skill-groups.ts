import type { SkillGroup } from "@/lib/types";

/**
 * Fallback used until skillGroup documents are populated in Sanity (see
 * src/sanity/schemaTypes/documents/skillGroup.ts). Powers the landing
 * page's "Skills In My Set" suitcase.
 */
export const skillGroups: SkillGroup[] = [
  {
    _id: "skill-group-philosophy",
    title: "Design Philosophy",
    order: 1,
    pills: ["API-driven, invisible complexity", "Data-model-aware interfaces", "Outcomes over outputs", "Systems thinking"],
  },
  {
    _id: "skill-group-research",
    title: "Research at Cadence",
    order: 2,
    pills: ["5-user usability tests", "Rapid Figma/Cursor prototyping", "Mixpanel & behavioural analysis", "Internal design reviews"],
  },
  {
    _id: "skill-group-craft-fundamentals",
    title: "Craft Fundamentals",
    order: 3,
    pills: ["Type, spacing, rhythm, hierarchy", "Figma (tokens, auto-layout)", "Design systems"],
  },
  {
    _id: "skill-group-product-design",
    title: "Product Design",
    order: 4,
    pills: ["End-to-end ownership", "Dense B2B interfaces", "Compliance & fintech workflows"],
  },
  {
    _id: "skill-group-ai-in-the-craft",
    title: "AI in the Craft",
    order: 5,
    pills: ["Claude & Claude Code", "Cursor", "Pressure-testing ideas & specs", "LLM-built prototypes"],
  },
  {
    _id: "skill-group-systems-build",
    title: "Systems & Build",
    order: 6,
    pills: ["Next.js", "Tailwind CSS", "GitHub & PR review", "Prototypes-as-spec"],
  },
];
