import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * There's no sticky header bar anymore (just a small floating utility
 * cluster in the top-right corner), so every page carries enough of its
 * own top padding to clear it — ~64px for most pages, a bit less for
 * Home's own hero spacing.
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
        offset ? "pt-16" : "pt-10 sm:pt-12",
        className,
      )}
    >
      {children}
    </div>
  );
}
