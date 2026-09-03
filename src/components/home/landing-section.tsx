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
    <section id={id} className={cn("scroll-mt-20 py-28 sm:py-36", backgrounds[background], className)}>
      <div className={cn("mx-auto w-full px-[4%]", containerClassName)}>{children}</div>
    </section>
  );
}
