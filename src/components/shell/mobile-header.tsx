"use client";

import { useRef, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "./logo";
import { AccessibilityMenu } from "./accessibility-menu";
import { BackButton } from "./back-button";
import { SearchOverlay } from "./search-overlay";
import type { Project, SiteSettings } from "@/lib/types";
import type { SearchIndex } from "@/lib/search-index";

export function MobileHeader({
  projects,
  siteSettings,
  searchIndex,
}: {
  projects: Project[];
  siteSettings: SiteSettings;
  searchIndex: SearchIndex;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function openSearch() {
    setSearchOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function runSearch() {
    setSubmittedQuery(query);
  }

  function close() {
    setSearchOpen(false);
    setQuery("");
    setSubmittedQuery("");
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-(--header-h) shrink-0 items-center justify-between border-b border-hairline bg-surface/95 px-4 backdrop-blur lg:hidden">
        {searchOpen ? (
          <div className="flex w-full items-center gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") close();
                  if (event.key === "Enter") runSearch();
                }}
                placeholder="Search the site…"
                className="h-9 w-full rounded-md border border-border bg-surface px-3 pr-9 text-[13px] text-ink-strong outline-none placeholder:text-ink-muted"
              />
              <button
                type="button"
                onClick={runSearch}
                aria-label="Run search"
                className="absolute inset-y-0 right-1 my-auto flex h-7 w-7 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink-strong"
              >
                <ArrowRight size={14} />
              </button>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close search"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink-strong"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <BackButton />
              <Logo compact />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openSearch}
                aria-label="Search the site"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink-strong"
              >
                <Search size={16} />
              </button>
              <AccessibilityMenu />
              <ThemeToggle />
            </div>
          </>
        )}
      </header>

      <SearchOverlay
        open={searchOpen && submittedQuery.trim().length > 0}
        query={submittedQuery}
        onClose={close}
        projects={projects}
        siteSettings={siteSettings}
        searchIndex={searchIndex}
      />
    </>
  );
}
