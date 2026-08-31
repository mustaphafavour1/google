import { defineField, defineType } from "sanity";

export const pipLinkPreviewBlock = defineType({
  name: "pipLinkPreview",
  title: "Picture-in-picture link preview",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 2 }),
    defineField({ name: "url", type: "url", validation: (r) => r.required() }),
    defineField({ name: "linkLabel", title: "Link label", type: "string", initialValue: "Visit site" }),
  ],
  preview: {
    select: { title: "title", subtitle: "url" },
  },
});
