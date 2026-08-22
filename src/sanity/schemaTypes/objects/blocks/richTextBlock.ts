import { defineField, defineType } from "sanity";

export const richTextBlock = defineType({
  name: "richText",
  title: "Rich text",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "format",
      type: "string",
      options: {
        list: [
          { title: "Prose", value: "prose" },
          { title: "Bullet list", value: "bullets" },
        ],
        layout: "radio",
      },
      initialValue: "prose",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "paragraphs",
      type: "array",
      of: [{ type: "text", rows: 3 }],
      hidden: ({ parent }) => parent?.format !== "prose",
    }),
    defineField({
      name: "bullets",
      type: "array",
      of: [{ type: "string" }],
      hidden: ({ parent }) => parent?.format !== "bullets",
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "format" },
  },
});
