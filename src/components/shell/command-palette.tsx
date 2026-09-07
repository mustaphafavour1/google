"use client";

import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "cmdk";
import { Moon, Search, Sun } from "lucide-react";
import { primaryNav } from "./nav-config";
import type { Project } from "@/lib/types";
import type { SearchEntry, SearchIndex } from "@/lib/search-index";

const groupClasses =
  "px-1 py-2 [&_[cmdk-group-heading]]:block [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-ink-muted";

const itemClasses =
  "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-2.5 text-[13.5px] text-ink-strong outline-none aria-selected:bg-primary-tint aria-selected:text-primary-tint-text";

export function CommandPalette({
  projects,
  searchIndex,
  open,
  onOpenChange,
}: {
  projects: Project[];
  searchIndex: SearchIndex;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  function toggleTheme() {
    onOpenChange(false);
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  function entryGroup(heading: string, entries: SearchEntry[]) {
    if (entries.length === 0) return null;
    return (
      <>
        <CommandSeparator className="my-1 h-px bg-hairline" />
        <CommandGroup heading={heading} className={groupClasses}>
          {entries.map((entry) => (
            <CommandItem
              key={entry.id}
              value={entry.label}
              keywords={entry.keywords}
              onSelect={() => go(entry.href)}
              className={itemClasses}
            >
              <span className="min-w-0">
                <span className="block truncate font-medium">{entry.label}</span>
                {entry.sublabel && (
                  <span className="block truncate text-[11.5px] text-ink-muted">{entry.sublabel}</span>
                )}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </>
    );
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command palette"
      overlayClassName="palette-overlay fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
      contentClassName="fixed left-1/2 top-[12vh] z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2"
      className="palette-content flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-hairline bg-surface shadow-[0_16px_48px_rgb(35_25_15_/_0.22)]"
    >
      <div className="flex items-center gap-2.5 border-b border-hairline px-4">
        <Search size={16} className="shrink-0 text-ink-muted" />
        <CommandInput
          placeholder="Search projects, skills, blog, jump to a section…"
          className="h-12 flex-1 bg-transparent text-[14px] text-ink-strong placeholder:text-ink-muted focus:outline-none"
        />
        <kbd className="hidden shrink-0 rounded border border-hairline px-1.5 py-0.5 font-mono text-[10.5px] text-ink-muted sm:block">
          Esc
        </kbd>
      </div>

      <CommandList className="flex-1 overflow-y-auto p-2">
        <CommandEmpty className="py-10 text-center text-[13px] text-ink-muted">
          No results found.
        </CommandEmpty>

        <CommandGroup heading="Navigate" className={groupClasses}>
          {primaryNav.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.href}
                value={item.label}
                onSelect={() => go(item.href)}
                className={itemClasses}
              >
                <span className="flex items-center gap-2.5">
                  <Icon size={16} className="shrink-0" />
                  {item.label}
                </span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        {projects.length > 0 && (
          <>
            <CommandSeparator className="my-1 h-px bg-hairline" />
            <CommandGroup heading="Projects" className={groupClasses}>
              {projects.map((project) => (
                <CommandItem
                  key={project._id}
                  value={project.name}
                  keywords={[...project.tags, project.industry, ...project.projectType]}
                  onSelect={() => go(`/projects/${project.slug}`)}
                  className={itemClasses}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{project.name}</span>
                    <span className="block truncate text-[11.5px] text-ink-muted">
                      {project.oneLiner}
                    </span>
                  </span>
                  <span className="shrink-0 text-[11px] text-ink-muted">{project.year}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {entryGroup("Skills", searchIndex.skills)}
        {entryGroup("Design Superpowers", searchIndex.superpowers)}
        {entryGroup("Blog", searchIndex.blogPosts)}
        {entryGroup("Products", searchIndex.products)}

        <CommandSeparator className="my-1 h-px bg-hairline" />
        <CommandGroup heading="Theme" className={groupClasses}>
          <CommandItem
            value="Toggle theme"
            keywords={["dark mode", "light mode", "appearance", "t"]}
            onSelect={toggleTheme}
            className={itemClasses}
          >
            <span className="flex items-center gap-2.5">
              {resolvedTheme === "dark" ? (
                <Sun size={16} className="shrink-0" />
              ) : (
                <Moon size={16} className="shrink-0" />
              )}
              Toggle theme
            </span>
            <kbd className="shrink-0 rounded border border-hairline px-1.5 py-0.5 font-mono text-[10.5px] text-ink-muted">
              T
            </kbd>
          </CommandItem>
        </CommandGroup>
      </CommandList>

      <div className="hidden shrink-0 items-center gap-3 border-t border-hairline px-4 py-2 text-[11px] text-ink-muted sm:flex">
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-hairline px-1 py-0.5 font-mono text-[10px]">↑↓</kbd>
          Navigate
        </span>
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-hairline px-1 py-0.5 font-mono text-[10px]">↵</kbd>
          Select
        </span>
        <span className="ml-auto flex items-center gap-1">
          <kbd className="rounded border border-hairline px-1 py-0.5 font-mono text-[10px]">⌘K</kbd>
          Toggle
        </span>
      </div>
    </CommandDialog>
  );
}
