import { defineField, defineType } from "sanity";

export const quoteBlock = defineType({
  name: "quote",
  title: "Quote",
  type: "object",
  fields: [
    defineField({ name: "quote", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "attribution", type: "string" }),
    defineField({
      name: "role",
      type: "string",
      description: "e.g. \"Illustrative — for case-study demonstration\" if this isn't a real quote.",
    }),
  ],
  preview: {
    select: { title: "quote", subtitle: "attribution" },
  },
});
