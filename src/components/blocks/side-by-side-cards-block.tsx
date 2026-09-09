import { cn } from "@/lib/utils";
import { RichContent } from "@/components/portable-text";
import type { SideBySideCardsBlock as SideBySideCardsBlockT } from "@/lib/types";

const gridColsClass: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function SideBySideCardsBlock({ block }: { block: SideBySideCardsBlockT }) {
  const cols = gridColsClass[Math.min(block.cards.length, 4)] ?? "sm:grid-cols-3";

  return (
    <div>
      {block.heading && <h3 className="type-subheading mb-3">{block.heading}</h3>}
      <div className={cn("grid gap-4", cols)}>
        {block.cards.map((card) => (
          <div
            key={card.title}
            className={cn("card p-5", card.tone === "primary" && "bg-primary-tint")}
          >
            <h4 className="text-[13.5px] font-semibold text-ink-em">{card.title}</h4>
            <div className="mt-2 text-[0.9375rem] [&_.type-body]:text-ink-muted">
              <RichContent value={card.body} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
