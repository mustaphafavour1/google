"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { primaryNav, isNavItemActive } from "./nav-config";
import { Logo, initials } from "./logo";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

export function Sidebar({ profile }: { profile: SiteSettings["profile"] }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-(--sidebar-w) shrink-0 flex-col border-r border-hairline bg-surface lg:flex">
      <div className="flex h-(--header-h) shrink-0 items-center border-b border-hairline px-4">
        <Logo name={profile.name} title={profile.title} />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-0.5">
          {primaryNav.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 truncate rounded-lg px-3 py-2.5 text-[13px] transition-colors",
                    active
                      ? "bg-primary-tint font-semibold text-primary-tint-text"
                      : "text-ink-soft hover:bg-surface-muted hover:text-ink-strong",
                  )}
                >
                  <Icon size={16} className="shrink-0" strokeWidth={2} />
                  <span className="truncate whitespace-nowrap">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-hairline p-4">
        <div className="stat-card !p-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-tint text-[11px] font-semibold text-primary-tint-text">
              {initials(profile.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-ink-em">{profile.name}</p>
              <p className="flex items-center gap-1 truncate text-[11px] text-ink-muted">
                <MapPin size={10} className="shrink-0" /> {profile.location}
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-success"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Open to new work
          </Link>
        </div>
      </div>
    </aside>
  );
}
