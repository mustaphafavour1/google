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
            defineField({
              name: "body",
              title: "Body",
              type: "array",
              of: [
                defineArrayMember({
                  type: "block",
                  styles: [{ title: "Normal", value: "normal" }],
                  lists: [
                    { title: "Bullet", value: "bullet" },
                    { title: "Numbered", value: "number" },
                  ],
                  marks: {
                    decorators: [
                      { title: "Bold", value: "strong" },
                      { title: "Italic", value: "em" },
                      { title: "Underline", value: "underline" },
                    ],
                  },
                }),
              ],
              validation: (r) => r.required(),
            }),
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
