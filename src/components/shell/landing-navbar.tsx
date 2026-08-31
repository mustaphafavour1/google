import Link from "next/link";
import { Download, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AccessibilityMenu } from "./accessibility-menu";

const NAV_LINKS = [
  { label: "Work", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Process", href: "/process" },
];

export function LandingNavbar({ resumeUrl }: { resumeUrl?: string }) {
  return (
    <header className="sticky top-0 z-30 hidden h-(--header-h) shrink-0 items-center justify-between border-b border-hairline bg-surface/80 px-8 backdrop-blur lg:flex">
      <nav aria-label="Site" className="flex items-center gap-7">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[13.5px] font-medium text-ink-soft transition-colors hover:text-ink-strong"
          >
            {link.label}
          </Link>
        ))}
        {resumeUrl && (
          <a
            href={resumeUrl}
            download
            className="flex items-center gap-1.5 text-[13.5px] font-medium text-ink-soft transition-colors hover:text-ink-strong"
          >
            <Download size={13} />
            Resume
          </a>
        )}
      </nav>

      <div className="flex items-center gap-3">
        <AccessibilityMenu />
        <ThemeToggle />
        <Link
          href="/contact"
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary-500 px-4 text-[13px] font-medium text-white transition-colors hover:bg-primary-600"
        >
          <Mail size={14} />
          Let&rsquo;s talk
        </Link>
      </div>
    </header>
  );
}
