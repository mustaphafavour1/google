import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-[1px] text-[10px] font-medium",
  {
    variants: {
      variant: {
        neutral: "border border-hairline bg-surface-muted text-ink-muted",
        primary: "border border-primary-200 bg-primary-tint text-primary-tint-text",
        success: "border border-success-border bg-success-tint text-success",
        warning: "border border-warning-border bg-warning-tint text-warning",
        danger: "border border-danger-border bg-danger-tint text-danger",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
