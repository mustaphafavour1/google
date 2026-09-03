"use client";

import { useMemo, useState } from "react";
import { Briefcase } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { ProjectCard } from "@/components/cards/project-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Project } from "@/lib/types";

const ALL = "All";

const SORTS = {
  recent: { label: "Most recent", key: "recency" as const },
  complex: { label: "Most complex", key: "complexity" as const },
};
type SortKey = keyof typeof SORTS;

const SPAN_CLASSES: Record<NonNullable<Project["cardSize"]>, string> = {
  small: "",
  wide: "sm:col-span-2",
  tall: "sm:row-span-2",
  large: "sm:col-span-2 sm:row-span-2",
};

export function ProjectsIndexClient({ projects }: { projects: Project[] }) {
  const [industry, setIndustry] = useState(ALL);
  const [tag, setTag] = useState(ALL);
  const [sort, setSort] = useState<SortKey>("recent");

  const industries = useMemo(
    () => [ALL, ...Array.from(new Set(projects.map((p) => p.industry)))],
    [projects],
  );
  const tags = useMemo(
    () => [ALL, ...Array.from(new Set(projects.flatMap((p) => p.tags)))],
    [projects],
  );

  const filtered = useMemo(() => {
    const key = SORTS[sort].key;
    return projects
      .filter(
        (p) =>
          (industry === ALL || p.industry === industry) &&
          (tag === ALL || p.tags.includes(tag)),
      )
      .sort((a, b) => (b[key] ?? -1) - (a[key] ?? -1));
  }, [projects, industry, tag, sort]);

  function handleFilterChange(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLSelectElement>) => setter(e.target.value);
  }

  return (
    <>
      <PageHeader
        title={
          <>
            Work
            <span className="mx-2 text-ink-faint">·</span>
            <span className="text-primary-500">
              {filtered.length} project{filtered.length === 1 ? "" : "s"}
            </span>
          </>
        }
        subtitle="Selected case studies — dashboards, apps, and systems designed end to end."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select
          value={industry}
          onChange={handleFilterChange(setIndustry)}
          className="h-8 rounded-md border border-border bg-surface pl-2 pr-7 text-[12px] text-ink-strong outline-none focus:ring-2 focus:ring-primary-500/15"
        >
          {industries.map((i) => (
            <option key={i} value={i}>
              {i === ALL ? "All industries" : i}
            </option>
          ))}
        </select>
        <select
          value={tag}
          onChange={handleFilterChange(setTag)}
          className="h-8 rounded-md border border-border bg-surface pl-2 pr-7 text-[12px] text-ink-strong outline-none focus:ring-2 focus:ring-primary-500/15"
        >
          {tags.map((t) => (
            <option key={t} value={t}>
              {t === ALL ? "All tags" : t}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="h-8 rounded-md border border-border bg-surface pl-2 pr-7 text-[12px] text-ink-strong outline-none focus:ring-2 focus:ring-primary-500/15"
        >
          {Object.entries(SORTS).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No projects match these filters"
          description="Try a different industry or tag combination."
        />
      ) : (
        <div className="grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[180px] sm:grid-cols-3 sm:[grid-auto-flow:dense] lg:grid-cols-4">
          {filtered.map((project) => (
            <div key={project._id} className={SPAN_CLASSES[project.cardSize ?? "small"]}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
