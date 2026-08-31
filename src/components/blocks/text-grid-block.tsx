import { cn } from "@/lib/utils";
import type { TextGridBlock as TextGridBlockT } from "@/lib/types";

const colsClass: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function TextGridBlock({ block }: { block: TextGridBlockT }) {
  const cols = colsClass[block.columns ?? 2] ?? colsClass[2];

  return (
    <div>
      {block.heading && <h3 className="type-subheading mb-4">{block.heading}</h3>}
      <div className={cn("grid gap-x-6 gap-y-5", cols)}>
        {block.items.map((item) => (
          <div key={item.title}>
            <h4 className="text-[13.5px] font-semibold text-ink-em">{item.title}</h4>
            <p className="type-body mt-1.5 text-ink-muted">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
