import { defineArrayMember, defineField, defineType } from "sanity";

export const jobApplicationVariant = defineType({
  name: "jobApplicationVariant",
  title: "Job application",
  type: "document",
  fields: [
    defineField({ name: "companyName", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      description: "Used in the shareable link: yoursite.com/apply/{slug}",
      options: { source: "companyName" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "roleTitle", title: "Role / position title", type: "string" }),
    defineField({
      name: "introNote",
      title: "Custom intro note",
      type: "text",
      rows: 3,
      description: "A short blurb specific to this application, used near the welcome/hero area.",
    }),
    defineField({
      name: "selectedProjects",
      title: "Projects to feature",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: "companyName", subtitle: "roleTitle" },
  },
});
