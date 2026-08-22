import { defineArrayMember, defineField, defineType } from "sanity";

export const imageGalleryBlock = defineType({
  name: "imageGallery",
  title: "Image gallery",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "images",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "galleryImage",
          fields: [
            defineField({
              name: "image",
              type: "image",
              options: { hotspot: true },
              description: "Optional — a gradient placeholder renders until a real screen is uploaded.",
            }),
            defineField({ name: "caption", type: "string" }),
            defineField({
              name: "aspect",
              type: "string",
              options: {
                list: [
                  { title: "Wide", value: "wide" },
                  { title: "Square", value: "square" },
                  { title: "Tall", value: "tall" },
                ],
              },
              initialValue: "wide",
            }),
          ],
          preview: { select: { title: "caption", media: "image" } },
        }),
      ],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Image gallery" }),
  },
});
