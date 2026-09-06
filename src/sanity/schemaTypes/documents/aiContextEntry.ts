import { defineField, defineType } from "sanity";

export const aiContextEntry = defineType({
  name: "aiContextEntry",
  title: "AI context entry",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name / purpose",
      type: "string",
      description: 'What this entry is for — e.g. "Daily Design Dose", "Pricing", "Availability".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      rows: 8,
      description: "What FaveAI should know about this topic when it comes up.",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "content" },
  },
});
