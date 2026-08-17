import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

export function PreviewPanel({
  title,
  viewMoreHref,
  children,
}: {
  title: string;
  viewMoreHref: string;
  children: ReactNode;
}) {
  return (
    <div className="card flex h-full flex-col p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="type-subheading">{title}</h3>
        <Link
          href={viewMoreHref}
          className="flex shrink-0 items-center gap-1 text-[12px] font-medium text-primary-500 hover:text-primary-600"
        >
          View more
          <ArrowUpRight size={12} />
        </Link>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
