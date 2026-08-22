import { defineArrayMember, defineField, defineType } from "sanity";

export const chartBlock = defineType({
  name: "chart",
  title: "Chart",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "caption", type: "string" }),
    defineField({
      name: "chartType",
      type: "string",
      options: {
        list: [
          { title: "Bar", value: "bar" },
          { title: "Line", value: "line" },
          { title: "Pie", value: "pie" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "data",
      type: "array",
      description: "One label/value pair per bar, point, or slice.",
      of: [
        defineArrayMember({
          type: "object",
          name: "dataPoint",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "value", type: "number", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "chartType" },
  },
});
