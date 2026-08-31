import { defineField, defineType } from "sanity";

export const videoBlock = defineType({
  name: "video",
  title: "Video",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "embedUrl",
      title: "Embed URL",
      type: "url",
      description: "Optional — a YouTube/Vimeo embed URL. A styled placeholder renders until one is set.",
    }),
    defineField({ name: "duration", type: "string", description: "e.g. \"2:14\" — shown on the placeholder." }),
    defineField({ name: "caption", type: "string" }),
  ],
  preview: {
    select: { title: "heading", subtitle: "embedUrl" },
    prepare: ({ title, subtitle }) => ({ title: title || "Video", subtitle }),
  },
});
