import { defineArrayMember, defineField, defineType } from "sanity";

export const processTrack = defineType({
  name: "processTrack",
  title: "Process track",
  type: "document",
  fields: [
    defineField({
      name: "discipline",
      type: "string",
      options: {
        list: ["Overall", "UI/UX", "Web Development", "Branding", "Campaigns & Marketing"].map((v) => ({
          title: v,
          value: v,
        })),
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "summary", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({
      name: "phases",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "phase",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "description",
              type: "text",
              rows: 2,
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "label" } },
        }),
      ],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: "discipline" },
  },
});
