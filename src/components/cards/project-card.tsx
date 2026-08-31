import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-[0_4px_16px_rgb(15_23_42_/_0.08)]"
    >
      <div
        className="relative h-36 w-full shrink-0"
        style={{
          background: `linear-gradient(135deg, ${project.accent.primary}, ${project.accent.secondary})`,
        }}
      >
        <div className="absolute inset-0 flex items-end justify-between p-4">
          <span className="type-eyebrow text-white/85">{project.industry}</span>
          <span className="data-mono rounded-full bg-black/20 px-2 py-0.5 text-white/90">
            {project.year}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="type-subheading">{project.name}</h3>
        <p className="type-body mt-1.5 line-clamp-2 flex-1 text-ink-muted">{project.oneLiner}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 2).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[12px] font-medium text-primary-500 transition-all group-hover:gap-1.5">
            View case study
            <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
