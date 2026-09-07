import { defineField, defineType } from "sanity";

export const lovedFont = defineType({
  name: "lovedFont",
  title: "Loved font",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Font name",
      type: "string",
      description:
        'Must match the exact Google Fonts family name (e.g. "Unbounded") — the For Fun page fetches this name live from Google Fonts to render a real preview.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers show first.",
      initialValue: 0,
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
    select: { title: "name" },
  },
});
