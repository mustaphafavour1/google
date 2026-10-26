import { defineArrayMember, defineField, defineType } from "sanity";

const SECTION_TYPE_LIST = [
  { title: "Meet the Metrics", value: "metrics" },
  { title: "The Journey So Far", value: "journey" },
  { title: "Redesign / Fix Preview", value: "redesign-preview" },
  { title: "Projects that Project my Range", value: "work" },
  { title: "Why Me", value: "why-me" },
  { title: "Skills In My Set", value: "skills" },
  { title: "Working With Me", value: "process" },
  { title: "With Me, AI-built", value: "design-system" },
  { title: "Final CTA", value: "contact" },
];

export const jobApplicationVariant = defineType({
  name: "jobApplicationVariant",
  title: "Job application",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "layout", title: "Sections" },
    { name: "hero", title: "Hero" },
    { name: "redesign", title: "Redesign preview" },
  ],
  fields: [
    defineField({
      name: "companyName",
      type: "string",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      description:
        "Used in the shareable link — once the wildcard subdomain is set up: {slug}.headfavour.com. Until then: yoursite.com/apply/{slug}",
      options: { source: "companyName" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "roleTitle", title: "Role / position title", type: "string", group: "content" }),
    defineField({
      name: "introNote",
      title: "Custom intro note",
      type: "text",
      rows: 3,
      group: "content",
      description: "A short blurb specific to this application, used near the welcome/hero area.",
    }),
    defineField({
      name: "selectedProjects",
      title: "Projects to feature",
      type: "array",
      group: "content",
      description: "Used by the \"Projects that Project my Range\" section below, if it's included.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
    }),
    defineField({
      name: "defaultTheme",
      title: "Default theme",
      type: "string",
      group: "content",
      description:
        "The theme a first-time visitor to this tailored link sees. They can still toggle it themselves afterward — this only sets the starting point.",
      options: { list: [{ title: "Light", value: "light" }, { title: "Dark", value: "dark" }], layout: "radio" },
      initialValue: "light",
    }),
    defineField({
      name: "sections",
      title: "Home page sections",
      type: "array",
      group: "layout",
      description:
        "Pick which sections to show on this tailored home page, and drag to set their order. Leave empty to use the default home page's full order.",
      of: [
        defineArrayMember({
          type: "object",
          name: "section",
          fields: [
            defineField({
              name: "sectionType",
              title: "Section",
              type: "string",
              options: { list: SECTION_TYPE_LIST },
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { sectionType: "sectionType" },
            prepare: ({ sectionType }) => ({
              title: SECTION_TYPE_LIST.find((s) => s.value === sectionType)?.title ?? sectionType ?? "Untitled section",
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "heroStyle",
      title: "Hero background style",
      type: "string",
      group: "hero",
      options: {
        list: [
          { title: "Default (color blobs)", value: "default" },
          { title: "Image / GIF", value: "image" },
          { title: "Video", value: "video" },
          { title: "Custom (hand-coded)", value: "custom" },
        ],
        layout: "radio",
      },
      initialValue: "default",
    }),
    defineField({
      name: "heroBackgroundImage",
      title: "Hero background image or GIF",
      type: "image",
      group: "hero",
      hidden: ({ parent }) => parent?.heroStyle !== "image",
    }),
    defineField({
      name: "heroBackgroundVideo",
      title: "Hero background video",
      type: "file",
      group: "hero",
      options: { accept: "video/*" },
      hidden: ({ parent }) => parent?.heroStyle !== "video",
    }),
    defineField({
      name: "heroCustomComponentKey",
      title: "Custom hero component key",
      type: "string",
      group: "hero",
      description:
        "Matches a hand-coded hero component registered in src/components/home/custom-heroes/ — ask for one to be built and registered under a key, then enter that key here.",
      hidden: ({ parent }) => parent?.heroStyle !== "custom",
    }),
    defineField({
      name: "redesignPreview",
      title: "Redesign / fix preview",
      type: "object",
      group: "redesign",
      description:
        "A quick redesign or fix made for this company's own product. Shown as a teaser card (cover + 1-2 sentences) that opens into a full case-study view.",
      fields: [
        defineField({ name: "enabled", title: "Show this section", type: "boolean", initialValue: false }),
        defineField({
          name: "project",
          title: "Case study",
          description:
            'Pick (or create) a project document for this redesign — keep "Show on portfolio" off so it stays private to this link.',
          type: "reference",
          to: [{ type: "project" }],
          hidden: ({ parent }) => !parent?.enabled,
        }),
        defineField({
          name: "teaserText",
          title: "Teaser text",
          description: "1-2 sentences shown on the home page card, before they click through.",
          type: "text",
          rows: 2,
          hidden: ({ parent }) => !parent?.enabled,
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "companyName", subtitle: "roleTitle" },
  },
});
