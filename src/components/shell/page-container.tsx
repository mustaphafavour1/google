import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Every page except Home gets ~50px of deliberate top offset before the
 * first content (title/count/first block). Home uses ordinary padding.
 */
export function PageContainer({
  children,
  offset = true,
  className,
}: {
  children: ReactNode;
  offset?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-(--content-max) px-5 pb-16 sm:px-8 lg:px-10",
        offset ? "pt-[50px]" : "pt-5 sm:pt-7",
        className,
      )}
    >
      {children}
    </div>
  );
}
