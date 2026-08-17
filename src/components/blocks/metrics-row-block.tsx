import type { MetricsRowBlock as MetricsRowBlockT } from "@/lib/types";

export function MetricsRowBlock({ block }: { block: MetricsRowBlockT }) {
  return (
    <div>
      {block.heading && <p className="type-eyebrow mb-3">{block.heading}</p>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {block.metrics.map((metric) => (
          <div key={metric.label} className="stat-card">
            <p className="type-label">{metric.label}</p>
            <p className="mt-1.5 text-[1.75rem] font-bold leading-none text-ink-em">
              {metric.value}
            </p>
            {metric.caption && <p className="type-meta mt-1">{metric.caption}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
