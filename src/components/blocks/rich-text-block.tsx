import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { RichTextBlock as RichTextBlockT } from "@/lib/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="type-body max-w-3xl">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="max-w-3xl space-y-2.5">{children}</ul>,
    number: ({ children }) => <ol className="max-w-3xl list-decimal space-y-2.5 pl-5">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-2.5">
        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
        <span className="type-body">{children}</span>
      </li>
    ),
    number: ({ children }) => <li className="type-body pl-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink-em">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline underline-offset-2">{children}</span>,
  },
};

export function RichTextBlock({ block }: { block: RichTextBlockT }) {
  return (
    <div>
      {block.heading && <h3 className="type-subheading mb-3">{block.heading}</h3>}
      <div className="space-y-3">
        <PortableText value={block.content} components={components} />
      </div>
    </div>
  );
}
