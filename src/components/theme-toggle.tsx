"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // next-themes can't know the resolved theme during SSR (or the client's
  // first hydration pass) — resolvedTheme briefly disagrees with what the
  // server rendered right after mount, which is fine for the CSS-driven
  // sun/moon icon swap below, but not for an attribute React itself
  // controls and diffs. Gating on `mounted` keeps isDark (and therefore
  // aria-pressed) identical through hydration, then catches up right after.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // A one-shot "has the client mounted yet" flag can only ever be set
    // from an effect — there's no synchronous way to know this during the
    // render that must match the server's. That's the whole point of the
    // guard above, not a sign it should be derived differently.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle dark mode"
          aria-pressed={isDark}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink-strong",
            className,
          )}
        >
          <Sun size={15} className="hidden dark:block" />
          <Moon size={15} className="block dark:hidden" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{isDark ? "Switch to light mode" : "Switch to dark mode"}</TooltipContent>
    </Tooltip>
  );
}
