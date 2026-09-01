import Link from "next/link";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProjectCard({ project }: { project: Project }) {
  const staticSrc = project.coverImage;
  const hoverSrc = project.coverGifUrl;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block h-full w-full overflow-hidden rounded-[8px]"
      style={{
        background: `linear-gradient(135deg, ${project.accent.primary}, ${project.accent.secondary})`,
      }}
    >
      {staticSrc && (
        // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
        <img
          src={staticSrc}
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
            hoverSrc && "group-hover:opacity-0",
          )}
        />
      )}
      {hoverSrc && (
        // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
        <img
          src={hoverSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="text-[14px] font-semibold leading-tight text-white">{project.name}</h3>
        <p className="mt-0.5 truncate text-[10px] text-white/85">{project.oneLiner}</p>
      </div>
    </Link>
  );
}
