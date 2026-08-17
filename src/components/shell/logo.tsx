import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5", className)}
      aria-label="Favour Mustapha — home"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-500 text-[13px] font-semibold text-white transition-transform group-hover:scale-105">
        FM
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[13.5px] font-semibold text-ink-em">Favour Mustapha</span>
          <span className="type-eyebrow !text-[9.5px] text-ink-soft">Product Designer</span>
        </span>
      )}
    </Link>
  );
}
