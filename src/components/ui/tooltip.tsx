"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({
  className,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "tooltip-content z-50 rounded-md border border-hairline bg-surface px-2.5 py-1.5 text-[11.5px] font-medium text-ink-strong shadow-[0_4px_16px_rgb(35_25_15_/_0.12)]",
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}
