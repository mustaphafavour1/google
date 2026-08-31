import type { MetricsRowBlock, Project, ProjectBlock } from "@/lib/types";

function isMetricsRow(block: ProjectBlock): block is MetricsRowBlock {
  return block._type === "metricsRow";
}

export function CaseStudyMiniMetrics({ project }: { project: Project }) {
  const metricsBlock = project.blocks.find(isMetricsRow);
  const metrics = metricsBlock
    ? metricsBlock.metrics.slice(0, 4)
    : [
        { label: "Pages designed", value: String(project.scale.pages) },
        { label: "Core entities", value: String(project.scale.entities) },
        { label: "Roles modeled", value: String(project.scale.roles) },
        { label: "Year", value: String(project.year) },
      ];

  return (
    <div>
      <p className="type-eyebrow mb-2.5">Scope at a glance</p>
      <div className="grid grid-cols-2 gap-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-hairline bg-surface px-2.5 py-2">
            <p className="text-[15px] font-semibold leading-none text-ink-em">{metric.value}</p>
            <p className="mt-1 text-[10px] leading-tight text-ink-muted">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
