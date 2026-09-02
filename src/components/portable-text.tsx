import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { RichContentValue } from "@/lib/types";

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
  types: {
    image: ({ value }) =>
      value.url ? (
        // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
        <img src={value.url} alt="" className="max-w-3xl rounded-xl border border-hairline" />
      ) : null,
  },
};

export function RichContent({ value }: { value: RichContentValue }) {
  return (
    <div className="space-y-3">
      <PortableText value={value} components={components} />
    </div>
  );
}
