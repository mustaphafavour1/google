"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { primaryNav, isNavItemActive } from "./nav-config";
import { Logo, initials } from "./logo";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

const STORAGE_KEY = "sidebar-collapsed";
const EXPANDED_W = "14rem";
const COLLAPSED_W = "4.5rem";
const collapsedListeners = new Set<() => void>();

function subscribeCollapsed(listener: () => void) {
  collapsedListeners.add(listener);
  return () => collapsedListeners.delete(listener);
}

function getCollapsedSnapshot() {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

function getCollapsedServerSnapshot() {
  return false;
}

function setCollapsedPreference(next: boolean) {
  localStorage.setItem(STORAGE_KEY, String(next));
  collapsedListeners.forEach((listener) => listener());
}

export function useSidebarCollapsed(): boolean {
  return useSyncExternalStore(subscribeCollapsed, getCollapsedSnapshot, getCollapsedServerSnapshot);
}

export function Sidebar({ profile }: { profile: SiteSettings["profile"] }) {
  const pathname = usePathname();
  const collapsed = useSidebarCollapsed();

  function toggleCollapsed() {
    setCollapsedPreference(!collapsed);
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? COLLAPSED_W : EXPANDED_W }}
      transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
      style={{ width: EXPANDED_W }}
      className="sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-hairline bg-surface lg:flex"
    >
      <div
        className={cn(
          "flex h-(--header-h) shrink-0 items-center border-b border-hairline",
          collapsed ? "justify-center px-2" : "px-4",
        )}
      >
        <Logo name={profile.name} title={profile.title} compact={collapsed} />
      </div>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-0.5">
          {primaryNav.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            const Icon = item.icon;
            const link = (
              <Link
                href={item.href}
                aria-label={item.label}
                className={cn(
                  "flex items-center gap-2.5 truncate rounded-lg px-3 py-2.5 text-[13px] transition-colors",
                  collapsed && "justify-center px-0",
                  active
                    ? "bg-primary-tint font-semibold text-primary-tint-text"
                    : "text-ink-soft hover:bg-surface-muted hover:text-ink-strong",
                )}
              >
                <Icon size={16} className="shrink-0" strokeWidth={2} />
                {!collapsed && <span className="truncate whitespace-nowrap">{item.label}</span>}
              </Link>
            );

            return (
              <li key={item.href}>
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  link
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-hairline p-3">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/profile"
                aria-label={`${profile.name} — Profile`}
                className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-primary-tint text-[11px] font-semibold text-primary-tint-text"
              >
                {initials(profile.name)}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{profile.name}</TooltipContent>
          </Tooltip>
        ) : (
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
        )}
      </div>

      <div className="shrink-0 border-t border-hairline p-2">
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex h-8 w-full items-center gap-2 rounded-md text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink-strong",
            collapsed ? "justify-center" : "px-2.5",
          )}
        >
          {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
          {!collapsed && <span className="text-[12px] font-medium">Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
