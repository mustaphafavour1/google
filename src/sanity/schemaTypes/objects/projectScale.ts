import { defineField, defineType } from "sanity";

export const projectScale = defineType({
  name: "projectScale",
  title: "Scale",
  type: "object",
  fields: [
    defineField({ name: "pages", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "entities", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "roles", type: "number", validation: (r) => r.required().min(0) }),
  ],
});
