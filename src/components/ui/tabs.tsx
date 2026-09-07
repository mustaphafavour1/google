"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <div className="max-w-full overflow-x-auto">
      <TabsPrimitive.List
        className={cn(
          "inline-flex w-max items-center gap-1 rounded-lg border border-hairline bg-surface-muted p-1",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "shrink-0 whitespace-nowrap rounded-md px-3.5 py-1.5 text-[13px] font-medium text-ink-soft transition-colors",
        "data-[state=active]:bg-surface data-[state=active]:text-ink-em data-[state=active]:shadow-[0_1px_2px_rgb(15_23_42_/_0.08)]",
        "hover:text-ink-strong",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn("outline-none", className)} {...props} />;
}

/**
 * Underline style — visually distinct from the pill TabsList/TabsTrigger
 * above, for pages that already nest a pill-tab group inside one of these
 * tabs (Process+Skills) and need the outer level to read differently.
 */
export function LineTabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <div className="max-w-full overflow-x-auto">
      <TabsPrimitive.List
        className={cn("flex w-max items-center gap-6 border-b border-hairline", className)}
        {...props}
      />
    </div>
  );
}

export function LineTabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "shrink-0 whitespace-nowrap border-b-2 border-transparent pb-2.5 text-[14px] font-medium text-ink-muted transition-colors",
        "hover:text-ink-strong",
        "data-[state=active]:border-primary-500 data-[state=active]:font-semibold data-[state=active]:text-primary-500",
        className,
      )}
      {...props}
    />
  );
}
