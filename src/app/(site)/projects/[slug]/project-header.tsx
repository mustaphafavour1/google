import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProjectSummaryPanel } from "./project-summary-panel";
import type { Project } from "@/lib/types";

export function ProjectHeader({ project, contactEmail }: { project: Project; contactEmail: string }) {
  const coverSrc = project.coverImage;

  return (
    <div className="mb-10">
      <span className="type-eyebrow text-ink-muted">{project.industry}</span>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <h1 className="type-display text-ink-em">{project.name}</h1>
        <ProjectSummaryPanel project={project} contactEmail={contactEmail} />
      </div>
      <p className="mt-2 max-w-2xl text-[14px] text-ink-soft sm:text-[15px]">{project.oneLiner}</p>

      <div className="mt-10 flex flex-wrap items-center gap-x-14 gap-y-3">
        <MetaItem label="Year" value={String(project.year)} mono />
        <MetaItem label="Industry" value={project.industry} />
        <MetaItem label="Role" value={project.role} />
        {project.techStack.length > 0 && (
          <>
            <div className="hidden h-8 w-px bg-hairline sm:block" />
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((t) => (
                <span
                  key={t}
                  className="data-mono rounded-full border border-hairline px-2 py-0.5 text-ink-soft"
                >
                  {t}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {project.links.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {project.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              {link.label}
              <ArrowUpRight size={13} />
            </a>
          ))}
        </div>
      )}

      <div
        className="relative mt-6 h-64 w-full overflow-hidden rounded-2xl sm:h-80"
        style={{
          background: `linear-gradient(135deg, ${project.accent.primary}, ${project.accent.secondary})`,
        }}
      >
        {coverSrc && (
          // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
          <img src={coverSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
      </div>
    </div>
  );
}

function MetaItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="type-label">{label}</p>
      <p className={mono ? "data-mono mt-0.5 text-[13px] text-ink-strong" : "mt-0.5 text-[13px] font-medium text-ink-strong"}>
        {value}
      </p>
    </div>
  );
}
