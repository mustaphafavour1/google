"use client";

import { useMemo, useState } from "react";
import { Briefcase, Filter } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { ProjectCard } from "@/components/cards/project-card";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import type { Project } from "@/lib/types";

const ALL = "All";

export function ProjectsIndexClient({ projects }: { projects: Project[] }) {
  const [industry, setIndustry] = useState(ALL);
  const [tag, setTag] = useState(ALL);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const industries = useMemo(
    () => [ALL, ...Array.from(new Set(projects.map((p) => p.industry)))],
    [projects],
  );
  const tags = useMemo(
    () => [ALL, ...Array.from(new Set(projects.flatMap((p) => p.tags)))],
    [projects],
  );

  const filtered = useMemo(() => {
    return projects.filter(
      (p) =>
        (industry === ALL || p.industry === industry) &&
        (tag === ALL || p.tags.includes(tag)),
    );
  }, [projects, industry, tag]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  function handleFilterChange(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value);
      setPage(1);
    };
  }

  return (
    <>
      <PageHeader
        title="Work"
        subtitle="Selected case studies — dashboards, apps, and systems designed end to end."
        actions={
          <span className="text-[16px] font-semibold text-primary-500">
            {filtered.length} project{filtered.length === 1 ? "" : "s"}
          </span>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 text-ink-soft">
          <Filter size={13} />
          <span className="type-meta">Filter</span>
        </span>
        <select
          value={industry}
          onChange={handleFilterChange(setIndustry)}
          className="h-8 rounded-md border border-border bg-surface px-2 text-[12px] text-ink-strong outline-none focus:ring-2 focus:ring-primary-500/15"
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
          className="h-8 rounded-md border border-border bg-surface px-2 text-[12px] text-ink-strong outline-none focus:ring-2 focus:ring-primary-500/15"
        >
          {tags.map((t) => (
            <option key={t} value={t}>
              {t === ALL ? "All tags" : t}
            </option>
          ))}
        </select>
      </div>

      {paged.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No projects match these filters"
          description="Try a different industry or tag combination."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      <div className="mt-6">
        <Pagination
          page={page}
          pageSize={pageSize}
          total={filtered.length}
          noun="projects"
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 20, 50]}
        />
      </div>
    </>
  );
}
