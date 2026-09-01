import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "coverImage",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Brief description",
      type: "text",
      rows: 2,
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "description", media: "coverImage" },
  },
});
