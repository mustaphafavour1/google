import { defineField, defineType } from "sanity";

export const fullBleedImageBlock = defineType({
  name: "fullBleedImage",
  title: "Full-bleed image",
  type: "object",
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
          { title: "Ultrawide", value: "ultrawide" },
          { title: "Tall", value: "tall" },
        ],
      },
      initialValue: "wide",
    }),
  ],
  preview: {
    select: { title: "caption", media: "image" },
    prepare: ({ title, media }) => ({ title: title || "Full-bleed image", media }),
  },
});
