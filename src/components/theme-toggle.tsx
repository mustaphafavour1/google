"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark mode"
      aria-pressed={resolvedTheme === "dark"}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink-strong",
        className,
      )}
    >
      <Sun size={15} className="hidden dark:block" />
      <Moon size={15} className="block dark:hidden" />
    </button>
  );
}
