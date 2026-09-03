import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary-500 text-white hover:bg-primary-600",
        outline: "border border-border text-ink-strong hover:bg-surface-muted",
        ghost: "text-ink-soft hover:bg-surface-muted hover:text-ink-strong",
      },
      size: {
        default: "h-9 px-3.5 text-[14px]",
        sm: "h-8 px-3 text-[13px]",
        lg: "h-12 px-6 text-[15.5px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    href?: string;
  };

export function Button({ className, variant, size, asChild, href, ...props }: ButtonProps) {
  if (href) {
    return (
      <Link href={href} className={cn(buttonVariants({ variant, size, className }))}>
        {props.children}
      </Link>
    );
  }
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
