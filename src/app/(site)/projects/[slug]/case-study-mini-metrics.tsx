import type { Project } from "@/lib/types";

export function CaseStudyMiniMetrics({ project }: { project: Project }) {
  if (project.scale.length === 0) return null;

  return (
    <div>
      <p className="type-eyebrow mb-2.5">Scope at a glance</p>
      <div className="grid grid-cols-2 gap-2">
        {project.scale.slice(0, 4).map((metric) => (
          <div key={metric.label} className="rounded-lg border border-hairline bg-surface px-2.5 py-2">
            <p className="text-[15px] font-semibold leading-none text-ink-em">{metric.value}</p>
            <p className="mt-1 text-[10px] leading-tight text-ink-muted">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
