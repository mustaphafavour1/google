import { defineField, defineType } from "sanity";

export const sectionBreakBlock = defineType({
  name: "sectionBreak",
  title: "Section break",
  type: "object",
  description: "Starts a new named section — drives the case-study page's table of contents.",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", type: "string" }),
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle" },
    prepare: ({ title, subtitle }) => ({ title: `— ${title}`, subtitle }),
  },
});
