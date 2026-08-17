import type { Skill } from "@/lib/types";

export const skills: Skill[] = [
  // Product / UX
  { _id: "skill-product-strategy", name: "Product strategy", category: "Product / UX", group: "Strategy" },
  { _id: "skill-ux-research", name: "UX research", category: "Product / UX", group: "Research" },
  { _id: "skill-ia", name: "Information architecture", category: "Product / UX", group: "Structure" },
  { _id: "skill-interaction-design", name: "Interaction design", category: "Product / UX", group: "Structure" },
  { _id: "skill-wireframing", name: "Wireframing & flows", category: "Product / UX", group: "Structure" },
  { _id: "skill-design-systems", name: "Design systems", category: "Product / UX", group: "Systems" },
  { _id: "skill-usability", name: "Usability testing", category: "Product / UX", group: "Research" },

  // Visual / Brand
  { _id: "skill-visual-design", name: "Visual design", category: "Visual / Brand", group: "Visual Design" },
  { _id: "skill-brand-identity", name: "Brand identity", category: "Visual / Brand", group: "Brand" },
  { _id: "skill-typography", name: "Typography", category: "Visual / Brand", group: "Visual Design" },
  { _id: "skill-color-systems", name: "Colour systems", category: "Visual / Brand", group: "Visual Design" },
  { _id: "skill-iconography", name: "Iconography", category: "Visual / Brand", group: "Visual Design" },
  { _id: "skill-motion", name: "Motion & micro-interaction", category: "Visual / Brand", group: "Motion" },
  { _id: "skill-art-direction", name: "Art direction", category: "Visual / Brand", group: "Brand" },

  // Technical
  { _id: "skill-react", name: "React / Next.js", category: "Technical", group: "Front-end" },
  { _id: "skill-typescript", name: "TypeScript", category: "Technical", group: "Front-end" },
  { _id: "skill-tailwind", name: "Tailwind CSS", category: "Technical", group: "Front-end" },
  { _id: "skill-design-to-code", name: "Design-to-code handoff", category: "Technical", group: "Front-end" },
  { _id: "skill-accessibility", name: "Accessibility (WCAG)", category: "Technical", group: "Quality" },
  { _id: "skill-data-viz", name: "Data visualization", category: "Technical", group: "Front-end" },
  { _id: "skill-cms", name: "Headless CMS (Sanity)", category: "Technical", group: "Front-end" },

  // Tools
  { _id: "skill-figma", name: "Figma", category: "Tools", group: "Design" },
  { _id: "skill-framer", name: "Framer", category: "Tools", group: "Design" },
  { _id: "skill-webflow", name: "Webflow", category: "Tools", group: "Design" },
  { _id: "skill-vscode", name: "VS Code", category: "Tools", group: "Development" },
  { _id: "skill-linear", name: "Linear", category: "Tools", group: "Workflow" },
  { _id: "skill-notion", name: "Notion", category: "Tools", group: "Workflow" },
];

export const skillCategories = ["Product / UX", "Visual / Brand", "Technical", "Tools"] as const;
