"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { primaryNav, isNavItemActive } from "./nav-config";
import { Logo, initials } from "./logo";
import { CollapsedBrandMark } from "./collapsed-brand-mark";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

const SIDEBAR_W = "4.5rem";

export function Sidebar({
  profile,
  profileMedia,
}: {
  profile: SiteSettings["profile"];
  profileMedia: SiteSettings["profileMedia"];
}) {
  const pathname = usePathname();
  const avatarPhoto = profileMedia.find((item) => item.image)?.image;

  return (
    <aside
      style={{ width: SIDEBAR_W }}
      className="sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-hairline bg-surface lg:flex"
    >
      <div className="flex h-(--header-h) shrink-0 items-center justify-center border-b border-hairline px-2">
        <Logo compact name={profile.name} title={profile.title} photoUrl={avatarPhoto} />
      </div>

      <p className="mt-3 px-2 text-center text-[8.5px] font-medium leading-[1.15] tracking-tight text-ink-muted">
        Cmd + K for quick moves
      </p>

      <nav aria-label="Primary" className="shrink-0 overflow-y-auto px-2 py-4">
        <ul className="flex flex-col gap-1">
          {primaryNav.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-label={item.label}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-md px-1 py-2.5 text-center transition-colors",
                    active
                      ? "bg-primary-tint font-semibold text-primary-tint-text"
                      : "text-ink-soft hover:bg-surface-muted hover:text-ink-strong",
                  )}
                >
                  <Icon size={16} className="shrink-0" strokeWidth={2} />
                  <span className="text-[8.5px] font-medium leading-[1.15] tracking-tight">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <CollapsedBrandMark phrases={profile.brandTextRotation} />

      <div className="shrink-0 border-t border-hairline p-2.5">
        <Link
          href="/profile"
          aria-label={`${profile.name} — Profile`}
          className="flex items-center justify-center"
        >
          {avatarPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
            <img src={avatarPhoto} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-tint text-[11px] font-semibold text-primary-tint-text">
              {initials(profile.name)}
            </span>
          )}
        </Link>
      </div>
    </aside>
  );
}
