import type { Project } from "@/lib/types";

export function ProjectHeader({ project }: { project: Project }) {
  const coverSrc = project.coverImage;

  return (
    <div className="mb-10">
      <div
        className="relative h-64 w-full overflow-hidden rounded-2xl sm:h-80"
        style={{
          background: `linear-gradient(135deg, ${project.accent.primary}, ${project.accent.secondary})`,
        }}
      >
        {coverSrc && (
          // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
          <img src={coverSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-9">
          <span className="type-eyebrow text-white/85">{project.industry}</span>
          <h1 className="type-display mt-1 text-white">{project.name}</h1>
          <p className="mt-2 max-w-2xl text-[14px] text-white/85 sm:text-[15px]">{project.oneLiner}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3">
        <MetaItem label="Role" value={project.role} />
        <MetaItem label="Year" value={String(project.year)} mono />
        <MetaItem label="Industry" value={project.industry} />
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
