import { defineField, defineType } from "sanity";

export const valueImpact = defineType({
  name: "valueImpact",
  title: "Value impact",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "amount", type: "number", validation: (r) => r.required() }),
    defineField({
      name: "estimated",
      type: "boolean",
      initialValue: true,
      description: "Leave on unless this is a reported (not illustrative/modeled) figure.",
    }),
  ],
});
