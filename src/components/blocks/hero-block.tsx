import type { HeroBlock as HeroBlockT, Project } from "@/lib/types";

export function HeroBlock({ block, project }: { block: HeroBlockT; project: Project }) {
  return (
    <div>
      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          background: `linear-gradient(135deg, ${project.accent.primary}, ${project.accent.secondary})`,
        }}
      >
        <div className="px-6 py-10 sm:px-10 sm:py-14">
          {block.eyebrow && <p className="type-eyebrow text-white/80">{block.eyebrow}</p>}
          <h1 className="type-display mt-2 text-white">{block.heading}</h1>
          {block.body && (
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/90">
              {block.body}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3">
        <MetaItem label="Role" value={project.role} />
        <MetaItem label="Year" value={String(project.year)} mono />
        <MetaItem label="Industry" value={project.industry} />
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
