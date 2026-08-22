import Link from "next/link";
import { Download, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function TopBar({ resumeUrl }: { resumeUrl?: string }) {
  return (
    <header className="sticky top-0 z-30 hidden h-(--header-h) shrink-0 items-center justify-end border-b border-hairline bg-surface/95 px-6 backdrop-blur lg:flex">
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
        <ThemeToggle />
      </div>
    </header>
  );
}
