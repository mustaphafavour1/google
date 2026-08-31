import Link from "next/link";
import { Download, Mail, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AccessibilityMenu } from "./accessibility-menu";

export function TopBar({
  resumeUrl,
  onOpenPalette,
}: {
  resumeUrl?: string;
  onOpenPalette: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 hidden h-(--header-h) shrink-0 items-center justify-between border-b border-hairline bg-surface/95 px-6 backdrop-blur lg:flex">
      <button
        type="button"
        onClick={onOpenPalette}
        aria-label="Open command palette"
        className="flex h-9 w-72 items-center gap-2 rounded-md border border-border bg-surface-muted/60 px-3 text-[13px] text-ink-muted transition-colors hover:border-primary-300 hover:text-ink-soft"
      >
        <Search size={14} className="shrink-0" />
        <span className="flex-1 text-left">Search or jump to…</span>
        <kbd className="shrink-0 rounded border border-hairline bg-surface px-1.5 py-0.5 font-mono text-[10.5px] text-ink-muted">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-3">
        {resumeUrl && (
          <a
            href={resumeUrl}
            download
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3.5 text-[13px] font-medium text-ink-strong transition-colors hover:bg-surface-muted"
          >
            <Download size={14} />
            Resume
          </a>
        )}
        <Link
          href="/contact"
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary-500 px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-primary-600"
        >
          <Mail size={14} />
          Contact
        </Link>
        <div className="ml-1 h-5 w-px bg-hairline" />
        <AccessibilityMenu />
        <ThemeToggle />
      </div>
    </header>
  );
}
