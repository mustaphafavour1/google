import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Handwritten({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn("font-handwriting leading-none", className)}>{children}</span>;
}
