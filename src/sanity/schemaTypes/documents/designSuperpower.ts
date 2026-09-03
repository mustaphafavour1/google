import { defineField, defineType } from "sanity";

export const designSuperpower = defineType({
  name: "designSuperpower",
  title: "Design superpower",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers show first in the Skills page's Design Superpowers tab.",
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle" },
  },
});
