import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AccessibilityMenu } from "./accessibility-menu";

export function FloatingUtilityBar({ onOpenPalette }: { onOpenPalette: () => void }) {
  return (
    <div className="fixed right-4 top-4 z-30 hidden items-center gap-2 lg:flex">
      <button
        type="button"
        onClick={onOpenPalette}
        aria-label="Open command palette (⌘K)"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface/95 text-ink-soft shadow-[0_4px_16px_rgb(35_25_15_/_0.08)] backdrop-blur transition-colors hover:bg-surface-muted hover:text-ink-strong"
      >
        <Search size={15} />
      </button>
      <AccessibilityMenu className="bg-surface/95 shadow-[0_4px_16px_rgb(35_25_15_/_0.08)] backdrop-blur" />
      <ThemeToggle className="bg-surface/95 shadow-[0_4px_16px_rgb(35_25_15_/_0.08)] backdrop-blur" />
    </div>
  );
}
