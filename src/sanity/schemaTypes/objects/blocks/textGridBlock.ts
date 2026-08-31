import { defineArrayMember, defineField, defineType } from "sanity";

export const textGridBlock = defineType({
  name: "textGrid",
  title: "Text grid",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "columns",
      type: "number",
      options: { list: [2, 3, 4] },
      initialValue: 2,
    }),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "textGridItem",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Text grid" }),
  },
});
