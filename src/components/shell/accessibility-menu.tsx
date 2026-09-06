"use client";

import { Accessibility, Captions, Volume2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { soundPreference, captionsPreference } from "@/lib/persistent-toggle";
import { cn } from "@/lib/utils";

export function AccessibilityMenu({ className }: { className?: string }) {
  const soundEnabled = soundPreference.useValue();
  const captionsEnabled = captionsPreference.useValue();

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Accessibility settings"
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink-strong",
                className,
              )}
            >
              <Accessibility size={16} />
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Accessibility</TooltipContent>
      </Tooltip>
      <PopoverContent aria-label="Accessibility settings">
        <p className="type-eyebrow mb-3">Accessibility</p>
        <div className="flex flex-col gap-4">
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span className="flex items-center gap-2.5">
              <Volume2 size={16} className="shrink-0 text-ink-soft" />
              <span>
                <span className="block text-[13px] font-medium text-ink-strong">UI sounds</span>
                <span className="block text-[11.5px] text-ink-muted">Soft feedback on interactions</span>
              </span>
            </span>
            <Switch
              checked={soundEnabled}
              onCheckedChange={soundPreference.set}
              aria-label="Toggle UI sounds"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span className="flex items-center gap-2.5">
              <Captions size={16} className="shrink-0 text-ink-soft" />
              <span>
                <span className="block text-[13px] font-medium text-ink-strong">Video captions</span>
                <span className="block text-[11.5px] text-ink-muted">Always show captions on video</span>
              </span>
            </span>
            <Switch
              checked={captionsEnabled}
              onCheckedChange={captionsPreference.set}
              aria-label="Toggle video captions"
            />
          </label>
        </div>
      </PopoverContent>
    </Popover>
  );
}
