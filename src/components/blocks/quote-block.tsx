import { Quote } from "lucide-react";
import type { QuoteBlock as QuoteBlockT, Project } from "@/lib/types";

export function QuoteBlock({ block, project }: { block: QuoteBlockT; project: Project }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface-muted/50 p-6 sm:p-8">
      <Quote size={22} style={{ color: project.accent.primary }} className="mb-3" />
      <p className="max-w-2xl text-[16px] leading-relaxed text-ink-strong">
        &ldquo;{block.quote}&rdquo;
      </p>
      {(block.attribution || block.role) && (
        <p className="type-meta mt-3">
          {block.attribution}
          {block.role && <span className="text-ink-faint"> — {block.role}</span>}
        </p>
      )}
    </div>
  );
}
