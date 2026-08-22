import { defineField, defineType } from "sanity";

const hexPattern = /^#([0-9A-Fa-f]{6})$/;

export const projectAccent = defineType({
  name: "projectAccent",
  title: "Case-study accent",
  type: "object",
  description: "The two-colour gradient used on this project's own hero/cover art — separate from the portfolio's own rose-gold chrome.",
  fields: [
    defineField({
      name: "primary",
      type: "string",
      description: "Hex, e.g. #0F9488",
      validation: (r) => r.required().regex(hexPattern, { name: "hex color" }),
    }),
    defineField({
      name: "secondary",
      type: "string",
      description: "Hex, e.g. #EC4899",
      validation: (r) => r.required().regex(hexPattern, { name: "hex color" }),
    }),
  ],
});
