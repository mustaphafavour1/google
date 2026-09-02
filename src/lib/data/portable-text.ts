import type { PortableTextBlock } from "@portabletext/types";

let counter = 0;
function key(prefix: string) {
  counter += 1;
  return `${prefix}-${counter}`;
}

export function paragraph(text: string): PortableTextBlock {
  return {
    _type: "block",
    _key: key("p"),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key("span"), text, marks: [] }],
  };
}

export function bulletItem(text: string): PortableTextBlock {
  return {
    _type: "block",
    _key: key("li"),
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [{ _type: "span", _key: key("span"), text, marks: [] }],
  };
}
