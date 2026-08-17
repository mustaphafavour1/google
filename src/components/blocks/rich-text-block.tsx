import type { RichTextBlock as RichTextBlockT } from "@/lib/types";

export function RichTextBlock({ block }: { block: RichTextBlockT }) {
  return (
    <div>
      {block.heading && <h3 className="type-subheading mb-3">{block.heading}</h3>}
      {block.format === "prose" ? (
        <div className="space-y-3">
          {block.paragraphs?.map((paragraph, i) => (
            <p key={i} className="type-body max-w-3xl">
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        <ul className="max-w-3xl space-y-2.5">
          {block.bullets?.map((bullet, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
              <span className="type-body">{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
