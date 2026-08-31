"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mobileTabs, isNavItemActive } from "./nav-config";
import { MoreSheet } from "./more-sheet";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

export function BottomTabBar({ contact }: { contact: SiteSettings["contact"] }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-hairline bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      {mobileTabs.map((item) => {
        const active = isNavItemActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2",
              active ? "text-primary-500" : "text-ink-soft",
            )}
          >
            <Icon size={19} strokeWidth={2} />
            <span className={cn("text-[10.5px]", active ? "font-semibold" : "font-medium")}>
              {item.label}
            </span>
          </Link>
        );
      })}
      <MoreSheet contact={contact} />
    </nav>
  );
}
