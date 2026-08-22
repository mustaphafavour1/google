import { defineField, defineType } from "sanity";

export const socialLink = defineType({
  name: "socialLink",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "href", type: "url", validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
