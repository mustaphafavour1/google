import { defineArrayMember, defineField, defineType } from "sanity";

export const metricsRowBlock = defineType({
  name: "metricsRow",
  title: "Metrics row",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "metrics",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "metric",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "value", type: "string", validation: (r) => r.required() }),
            defineField({ name: "caption", type: "string" }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Metrics row" }),
  },
});
