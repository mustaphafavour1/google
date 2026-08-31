import { defineField, defineType } from "sanity";

export const portfolioArchive = defineType({
  name: "portfolioArchive",
  title: "Portfolio archive",
  type: "document",
  fields: [
    defineField({ name: "year", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "url",
      title: "Live URL",
      type: "url",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      description: "Optional — a gradient placeholder renders until a real snapshot is uploaded.",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    {
      title: "Year, newest first",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "year", subtitle: "description", media: "image" },
  },
});
