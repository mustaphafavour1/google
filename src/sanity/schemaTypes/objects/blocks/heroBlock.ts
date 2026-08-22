import { defineField, defineType } from "sanity";

export const heroBlock = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", type: "text", rows: 3 }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow" },
  },
});
