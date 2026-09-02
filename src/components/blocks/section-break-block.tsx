import type { SectionBreakBlock as SectionBreakBlockT } from "@/lib/types";

export function SectionBreakBlock({ block }: { block: SectionBreakBlockT }) {
  return (
    <div>
      <h2 className="text-[22px] font-semibold text-ink-em">{block.title}</h2>
      {block.subtitle && <p className="type-body mt-1.5 max-w-3xl text-ink-soft">{block.subtitle}</p>}
    </div>
  );
}
