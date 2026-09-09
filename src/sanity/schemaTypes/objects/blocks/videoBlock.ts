import { defineField, defineType } from "sanity";

export const videoBlock = defineType({
  name: "video",
  title: "Video",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "file",
      title: "Uploaded video",
      type: "file",
      options: { accept: "video/*" },
      description:
        "A self-hosted video file — plays inline with native controls. Use this OR an embed URL below, not both; the uploaded file wins if both are set.",
    }),
    defineField({
      name: "embedUrl",
      title: "Embed URL",
      type: "url",
      description: "A YouTube/Vimeo embed URL, used only when no video file is uploaded above. A styled placeholder renders until either one is set.",
    }),
    defineField({ name: "duration", type: "string", description: "e.g. \"2:14\" — shown on the placeholder." }),
    defineField({ name: "caption", type: "string" }),
  ],
  preview: {
    select: { title: "heading", subtitle: "embedUrl" },
    prepare: ({ title, subtitle }) => ({ title: title || "Video", subtitle }),
  },
});
