import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  caption,
  isPlaceholder,
  className,
}: {
  label: string;
  value: string;
  caption?: string;
  isPlaceholder?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("stat-card", className)}>
      <p className="type-label">{label}</p>
      <p className="type-display mt-1.5">
        {value}
        {isPlaceholder && <span className="ml-0.5 text-ink-faint">*</span>}
      </p>
      {caption && <p className="type-meta mt-1">{caption}</p>}
    </div>
  );
}
