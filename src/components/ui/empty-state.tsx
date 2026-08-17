import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-hairline px-6 py-16 text-center">
      <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-ink-soft">
        <Icon size={18} />
      </div>
      <p className="type-subheading">{title}</p>
      {description && <p className="type-body max-w-sm text-ink-muted">{description}</p>}
    </div>
  );
}
