import { defineArrayMember, defineField, defineType } from "sanity";

export const sideBySideCardsBlock = defineType({
  name: "sideBySideCards",
  title: "Side-by-side cards",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "card",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
            defineField({
              name: "tone",
              type: "string",
              options: {
                list: [
                  { title: "Default", value: "default" },
                  { title: "Primary tint", value: "primary" },
                ],
              },
              initialValue: "default",
            }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
      validation: (r) => r.min(1).max(4),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Side-by-side cards" }),
  },
});
