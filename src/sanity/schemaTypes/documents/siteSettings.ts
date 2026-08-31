import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "profile", title: "Profile", default: true },
    { name: "about", title: "About" },
    { name: "contact", title: "Contact" },
    { name: "hobbies", title: "Hobbies" },
    { name: "analytics", title: "Analytics aggregates" },
  ],
  fields: [
    defineField({
      name: "profile",
      type: "object",
      group: "profile",
      fields: [
        defineField({ name: "name", type: "string", validation: (r) => r.required() }),
        defineField({ name: "firstName", type: "string", validation: (r) => r.required() }),
        defineField({ name: "title", type: "string", validation: (r) => r.required() }),
        defineField({ name: "location", type: "string", validation: (r) => r.required() }),
        defineField({ name: "tagline", type: "text", rows: 2, validation: (r) => r.required() }),
        defineField({ name: "founderNote", type: "string" }),
      ],
    }),
    defineField({
      name: "siteMetrics",
      title: "Home metrics row",
      type: "array",
      group: "profile",
      of: [
        defineArrayMember({
          type: "object",
          name: "metric",
          fields: [
            defineField({ name: "key", type: "string", validation: (r) => r.required() }),
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "value", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "isPlaceholder",
              title: "This is a placeholder figure",
              type: "boolean",
              initialValue: true,
            }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
    defineField({
      name: "about",
      type: "object",
      group: "about",
      fields: [
        defineField({ name: "design", title: "Design-related tab", type: "aboutSection" }),
        defineField({ name: "general", title: "General tab", type: "aboutSection" }),
      ],
    }),
    defineField({
      name: "contact",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "email", type: "string", validation: (r) => r.required().email() }),
        defineField({
          name: "resumeFile",
          title: "Resume (PDF)",
          type: "file",
          options: { accept: ".pdf" },
        }),
        defineField({ name: "website", type: "socialLink" }),
        defineField({ name: "socials", type: "array", of: [{ type: "socialLink" }] }),
      ],
    }),
    defineField({
      name: "hobbies",
      title: "Hobbies",
      type: "array",
      group: "hobbies",
      description: "Shown on the Profile Hub — a few things outside the design system.",
      of: [
        defineArrayMember({
          type: "object",
          name: "hobby",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "note", type: "string" }),
          ],
          preview: { select: { title: "label", subtitle: "note" } },
        }),
      ],
    }),
    defineField({
      name: "analyticsAggregate",
      title: "Career-wide analytics (illustrative)",
      type: "object",
      group: "analytics",
      description:
        "Career-wide figures the Analytics page can't derive from the 3 case studies alone.",
      fields: [
        defineField({
          name: "projectTypeBreakdown",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "typeCount",
              fields: [
                defineField({ name: "type", type: "string", validation: (r) => r.required() }),
                defineField({ name: "count", type: "number", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "type", subtitle: "count" } },
            }),
          ],
        }),
        defineField({
          name: "projectsOverTime",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "yearCount",
              fields: [
                defineField({ name: "year", type: "string", validation: (r) => r.required() }),
                defineField({ name: "count", type: "number", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "year", subtitle: "count" } },
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
