import { defineField, defineType } from "sanity";

export const aiGuidelines = defineType({
  name: "aiGuidelines",
  title: "AI guidelines",
  type: "document",
  fields: [
    defineField({
      name: "rules",
      title: "Rules for FaveAI",
      type: "text",
      rows: 12,
      description:
        'Do\'s and don\'ts for edge cases — e.g. "Don\'t quote exact rates, point to the Contact form instead", "If asked something outside the site\'s content, say so rather than guessing."',
    }),
  ],
  preview: {
    prepare: () => ({ title: "AI guidelines" }),
  },
});
