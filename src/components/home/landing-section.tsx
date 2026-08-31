import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const backgrounds = {
  default: "",
  surface: "bg-surface",
  tint: "bg-primary-tint/30",
};

export function LandingSection({
  children,
  id,
  background = "default",
  className,
  containerClassName,
}: {
  children: ReactNode;
  id?: string;
  background?: keyof typeof backgrounds;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20 py-20 sm:py-28", backgrounds[background], className)}>
      <div className={cn("mx-auto max-w-[1200px] px-[4%]", containerClassName)}>{children}</div>
    </section>
  );
}
