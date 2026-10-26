import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";

export function RedesignPreviewSection({ project, teaserText }: { project: Project; teaserText?: string }) {
  const coverSrc = project.coverGifUrl ?? project.coverImage;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group mx-auto flex max-w-4xl flex-col overflow-hidden rounded-2xl border border-hairline bg-surface transition-shadow hover:shadow-[0_16px_40px_rgb(15_15_15_/_0.1)] sm:flex-row"
    >
      <div
        className="aspect-[4/3] w-full shrink-0 overflow-hidden sm:aspect-square sm:w-2/5"
        style={{
          background: coverSrc
            ? undefined
            : `linear-gradient(135deg, ${project.accent.primary}, ${project.accent.secondary})`,
        }}
      >
        {coverSrc && (
          // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
          <img
            src={coverSrc}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-3 p-6 sm:p-8">
        <p className="text-[20px] font-bold text-ink-em">{project.name}</p>
        <p className="type-body text-ink-muted">{teaserText || project.oneLiner}</p>
        <span className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary-500">
          See the full breakdown
          <ArrowUpRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
