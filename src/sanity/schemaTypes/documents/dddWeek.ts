import { defineArrayMember, defineField, defineType } from "sanity";

export const dddWeek = defineType({
  name: "dddWeek",
  title: "Daily Design Dose — upload batch",
  type: "document",
  fields: [
    defineField({
      name: "week",
      title: "Batch order",
      type: "number",
      description:
        "Only breaks ties when two batches share a date — display order everywhere else comes from each image's own date.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      description: "Drop in every image for this batch at once — each one carries its own date.",
      of: [
        defineArrayMember({
          type: "object",
          name: "dddImage",
          fields: [
            defineField({ name: "image", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
            defineField({
              name: "date",
              title: "Date",
              type: "date",
              description: "The calendar date this design was posted for.",
              validation: (r) => r.required(),
            }),
            defineField({ name: "caption", type: "string" }),
          ],
          preview: { select: { title: "date", subtitle: "caption", media: "image" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
  ],
  orderings: [{ title: "Batch order, ascending", name: "weekAsc", by: [{ field: "week", direction: "asc" }] }],
  preview: {
    select: { week: "week", images: "images" },
    prepare: ({ week, images }) => {
      const dates: string[] = (images ?? []).map((img: { date?: string }) => img?.date).filter(Boolean);
      const range =
        dates.length > 0
          ? dates.length === 1
            ? dates[0]
            : `${dates.slice().sort()[0]} – ${dates.slice().sort().at(-1)}`
          : `Batch ${week ?? "?"}`;
      return {
        title: range,
        subtitle: `${images?.length ?? 0} image${images?.length === 1 ? "" : "s"}`,
        media: images?.[0]?.image,
      };
    },
  },
});
