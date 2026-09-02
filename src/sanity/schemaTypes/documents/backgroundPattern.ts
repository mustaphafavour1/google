import { defineArrayMember, defineField, defineType } from "sanity";

const PAGE_OPTIONS = [
  { title: "Overview", value: "overview" },
  { title: "Projects (index)", value: "projects" },
  { title: "Gallery", value: "gallery" },
  { title: "Profile", value: "profile" },
  { title: "Playground", value: "playground" },
  { title: "Archive", value: "archive" },
  { title: "Process", value: "process" },
  { title: "Skills", value: "skills" },
  { title: "Contact", value: "contact" },
  { title: "Analytics", value: "analytics" },
];

export const backgroundPattern = defineType({
  name: "backgroundPattern",
  title: "Background pattern",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "svgFile",
      title: "SVG file",
      type: "file",
      options: { accept: ".svg" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "enabled",
      title: "On",
      description: "Turn this pattern off without deleting it.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "global",
      title: "Apply to every page",
      description: "Overrides the page/project pickers below when on.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "pages",
      title: "Specific pages",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { list: PAGE_OPTIONS },
      description: "Ignored if 'Apply to every page' is on.",
    }),
    defineField({
      name: "projects",
      title: "Specific case studies",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
      description: "Show this pattern on these project pages too.",
    }),
  ],
  preview: {
    select: { title: "title", enabled: "enabled", global: "global", media: "svgFile" },
    prepare: ({ title, enabled, global, media }) => ({
      title,
      subtitle: !enabled ? "Off" : global ? "On · every page" : "On · selected pages",
      media,
    }),
  },
});
