import { defineArrayMember, defineField, defineType } from "sanity";

export const processTimelineBlock = defineType({
  name: "processTimeline",
  title: "Process timeline",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
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
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Process timeline" }),
  },
});
