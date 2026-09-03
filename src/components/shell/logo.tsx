import Link from "next/link";
import { cn } from "@/lib/utils";

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function Logo({
  className,
  compact = false,
  name = "Favour Mustapha",
  title = "Product Designer",
  photoUrl,
}: {
  className?: string;
  compact?: boolean;
  name?: string;
  title?: string;
  photoUrl?: string;
}) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5", className)}
      aria-label={`${name} — home`}
    >
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
        <img
          src={photoUrl}
          alt=""
          className="h-8 w-8 shrink-0 rounded-md object-cover transition-transform group-hover:scale-105"
        />
      ) : (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-500 text-[13px] font-semibold text-white transition-transform group-hover:scale-105">
          {initials(name)}
        </span>
      )}
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[13.5px] font-semibold text-ink-em">{name}</span>
          <span className="type-eyebrow !text-[9.5px] text-ink-soft">{title}</span>
        </span>
      )}
    </Link>
  );
}
