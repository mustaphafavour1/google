import { defineField, defineType } from "sanity";

export const aboutSection = defineType({
  name: "aboutSection",
  title: "About section",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "paragraphs",
      type: "array",
      of: [{ type: "text", rows: 3 }],
      validation: (r) => r.min(1),
    }),
  ],
});
