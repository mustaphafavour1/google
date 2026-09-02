import { defineField, defineType } from "sanity";

export const skillGroup = defineType({
  name: "skillGroup",
  title: "Skill group (landing page)",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers show first in the landing page's skills suitcase.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "pills",
      title: "Skill pills",
      type: "array",
      of: [{ type: "string" }],
      validation: (r) => r.required().min(1),
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
    select: { title: "title", pills: "pills" },
    prepare: ({ title, pills }) => ({
      title,
      subtitle: pills?.join(" · "),
    }),
  },
});
