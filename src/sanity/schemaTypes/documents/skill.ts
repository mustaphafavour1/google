import { defineField, defineType } from "sanity";

export const skill = defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: ["Product / UX", "Visual / Brand", "Technical", "Tools"].map((v) => ({
          title: v,
          value: v,
        })),
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "group", type: "string", validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: "name", subtitle: "category" },
  },
});
