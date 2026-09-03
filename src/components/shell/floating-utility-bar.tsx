"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AccessibilityMenu } from "./accessibility-menu";
import { GlobalAutoScroll } from "./global-auto-scroll";
import { SearchOverlay } from "./search-overlay";
import type { Project, SiteSettings } from "@/lib/types";

const UTILITY_BTN =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface/95 text-ink-soft shadow-[0_4px_16px_rgb(35_25_15_/_0.08)] backdrop-blur transition-colors hover:bg-surface-muted hover:text-ink-strong";

export function FloatingUtilityBar({
  projects,
  siteSettings,
}: {
  projects: Project[];
  siteSettings: SiteSettings;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function toggleSearch() {
    if (searchOpen) {
      close();
      return;
    }
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
      <div className="fixed right-4 top-4 z-30 hidden items-center gap-2 lg:flex">
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative h-9"
            >
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") close();
                  if (event.key === "Enter") runSearch();
                }}
                placeholder="Search the site…"
                className="h-9 w-full rounded-md border border-border bg-surface/95 px-3 pr-9 text-[13px] text-ink-strong shadow-[0_4px_16px_rgb(35_25_15_/_0.08)] outline-none placeholder:text-ink-muted"
              />
              <button
                type="button"
                onClick={runSearch}
                aria-label="Run search"
                className="absolute inset-y-0 right-1 my-auto flex h-7 w-7 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink-strong"
              >
                <ArrowRight size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={toggleSearch}
          aria-label={searchOpen ? "Close search" : "Search the site"}
          className={UTILITY_BTN}
        >
          {searchOpen ? <X size={15} /> : <Search size={15} />}
        </button>
        <AccessibilityMenu className="bg-surface/95 shadow-[0_4px_16px_rgb(35_25_15_/_0.08)] backdrop-blur" />
        <GlobalAutoScroll />
        <ThemeToggle className="bg-surface/95 shadow-[0_4px_16px_rgb(35_25_15_/_0.08)] backdrop-blur" />
      </div>

      <SearchOverlay
        open={searchOpen && submittedQuery.trim().length > 0}
        query={submittedQuery}
        onClose={close}
        projects={projects}
        siteSettings={siteSettings}
      />
    </>
  );
}
