import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "./page-container";

export function SectionPreview({
  icon: Icon,
  title,
  description,
  eta,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  eta: string;
}) {
  return (
    <PageContainer>
      <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-tint text-primary-tint-text">
            <Icon size={24} />
          </span>
          <div>
            <h1 className="type-heading">{title}</h1>
            <p className="type-body mt-2 text-ink-muted">{description}</p>
          </div>
          <span className="type-label rounded-full border border-hairline px-3 py-1">{eta}</span>
          <Link
            href="/"
            className="mt-2 flex items-center gap-1.5 text-[12.5px] font-medium text-primary-500 hover:text-primary-600"
          >
            <ArrowLeft size={13} />
            Back to Overview
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
