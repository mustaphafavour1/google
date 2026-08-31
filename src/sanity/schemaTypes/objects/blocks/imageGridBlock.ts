import { defineArrayMember, defineField, defineType } from "sanity";

export const imageGridBlock = defineType({
  name: "imageGrid",
  title: "Image grid",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "items",
      title: "Grid items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "gridImage",
          fields: [
            defineField({
              name: "image",
              type: "image",
              options: { hotspot: true },
              description: "Optional — a gradient placeholder renders until a real screen is uploaded.",
            }),
            defineField({ name: "caption", type: "string" }),
            defineField({
              name: "span",
              title: "Column span",
              type: "number",
              options: { list: [1, 2] },
              initialValue: 1,
              description: "2 makes this cell twice as wide, for an asymmetric bento-style grid.",
            }),
          ],
          preview: { select: { title: "caption", media: "image" } },
        }),
      ],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Image grid" }),
  },
});
