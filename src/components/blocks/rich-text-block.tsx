import { RichContent } from "@/components/portable-text";
import type { RichTextBlock as RichTextBlockT } from "@/lib/types";

export function RichTextBlock({ block }: { block: RichTextBlockT }) {
  return (
    <div>
      {block.heading && <h3 className="type-subheading mb-3">{block.heading}</h3>}
      <RichContent value={block.content} />
    </div>
  );
}
