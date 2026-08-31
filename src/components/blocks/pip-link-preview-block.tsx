import { ExternalLink, Globe } from "lucide-react";
import type { PipLinkPreviewBlock as PipLinkPreviewBlockT } from "@/lib/types";

export function PipLinkPreviewBlock({ block }: { block: PipLinkPreviewBlockT }) {
  let hostname = block.url;
  try {
    hostname = new URL(block.url).hostname.replace(/^www\./, "");
  } catch {
    // Not a fully-qualified URL (e.g. CMS entered "example.com") — show it verbatim.
  }

  return (
    <a
      href={block.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block max-w-sm overflow-hidden rounded-xl border border-hairline bg-surface shadow-[0_8px_24px_rgb(35_25_15_/_0.1)] transition-shadow hover:shadow-[0_12px_32px_rgb(35_25_15_/_0.16)]"
    >
      <div className="flex items-center gap-1.5 border-b border-hairline bg-surface-muted px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-danger/60" />
        <span className="h-2 w-2 rounded-full bg-warning/60" />
        <span className="h-2 w-2 rounded-full bg-success/60" />
        <span className="data-mono ml-2 truncate text-[10.5px] text-ink-muted">{hostname}</span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-ink-soft">
          <Globe size={14} />
          <span className="type-eyebrow">Live preview</span>
        </div>
        <h4 className="mt-1.5 text-[14px] font-semibold text-ink-em">{block.title}</h4>
        {block.description && <p className="type-body mt-1 text-ink-muted">{block.description}</p>}
        <span className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary-500 transition-all group-hover:gap-2">
          {block.linkLabel ?? "Visit site"}
          <ExternalLink size={12} />
        </span>
      </div>
    </a>
  );
}
