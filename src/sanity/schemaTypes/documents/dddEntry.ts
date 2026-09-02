import { defineField, defineType } from "sanity";

export const dddEntry = defineType({
  name: "dddEntry",
  title: "Daily Design Dose",
  type: "document",
  fields: [
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "day",
      title: "Day number",
      type: "number",
      description: "1-365, in case two entries share a date or a date is missing.",
    }),
    defineField({ name: "date", type: "date" }),
    defineField({ name: "caption", type: "string" }),
  ],
  orderings: [
    { title: "Day, ascending", name: "dayAsc", by: [{ field: "day", direction: "asc" }] },
  ],
  preview: {
    select: { title: "day", subtitle: "caption", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title: title ? `Day ${title}` : "Daily Design Dose",
      subtitle,
      media,
    }),
  },
});
