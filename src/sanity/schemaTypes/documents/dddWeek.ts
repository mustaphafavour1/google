import { defineArrayMember, defineField, defineType } from "sanity";

export const dddWeek = defineType({
  name: "dddWeek",
  title: "Daily Design Dose — week",
  type: "document",
  fields: [
    defineField({
      name: "week",
      title: "Week number",
      type: "number",
      description: "1, 2, 3… — sets the order entries appear in when browsing chronologically.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      description:
        "Drop in every image for the week at once — order here becomes the day-by-day order within the week.",
      of: [
        defineArrayMember({
          type: "object",
          name: "dddImage",
          fields: [
            defineField({ name: "image", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
            defineField({ name: "caption", type: "string" }),
          ],
          preview: { select: { title: "caption", media: "image" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
  ],
  orderings: [{ title: "Week, ascending", name: "weekAsc", by: [{ field: "week", direction: "asc" }] }],
  preview: {
    select: { week: "week", images: "images" },
    prepare: ({ week, images }) => ({
      title: `Week ${week ?? "?"}`,
      subtitle: `${images?.length ?? 0} image${images?.length === 1 ? "" : "s"}`,
      media: images?.[0]?.image,
    }),
  },
});
