import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  actions,
  align = "left",
}: {
  title: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "mb-6 flex flex-wrap items-start gap-4",
        centered ? "flex-col items-center text-center" : "justify-between",
      )}
    >
      <div>
        <h1 className="type-heading">{title}</h1>
        {subtitle && <p className={cn("type-subtitle mt-1 max-w-2xl", centered && "mx-auto")}>{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
