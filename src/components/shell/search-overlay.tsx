"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { primaryNav } from "./nav-config";
import { FaveAiMini } from "@/components/chat/faveai-mini";
import { buildChatModes } from "@/lib/chatbot-content";
import type { Project, SiteSettings } from "@/lib/types";
import type { SearchEntry, SearchIndex } from "@/lib/search-index";

function matchEntries(entries: SearchEntry[], trimmed: string): SearchEntry[] {
  return entries.filter((entry) =>
    [entry.label, entry.sublabel, ...entry.keywords].some((field) => field?.toLowerCase().includes(trimmed)),
  );
}

export function SearchOverlay({
  open,
  query,
  onClose,
  projects,
  siteSettings,
  searchIndex,
}: {
  open: boolean;
  query: string;
  onClose: () => void;
  projects: Project[];
  siteSettings: SiteSettings;
  searchIndex: SearchIndex;
}) {
  const trimmed = query.trim().toLowerCase();

  const navResults = trimmed
    ? primaryNav.filter((item) => item.label.toLowerCase().includes(trimmed))
    : [];
  const projectResults = trimmed
    ? projects.filter((project) =>
        [project.name, project.oneLiner, project.industry, ...project.projectType, ...project.tags].some(
          (field) => field?.toLowerCase().includes(trimmed),
        ),
      )
    : [];
  const skillResults = trimmed ? matchEntries(searchIndex.skills, trimmed) : [];
  const superpowerResults = trimmed ? matchEntries(searchIndex.superpowers, trimmed) : [];
  const blogResults = trimmed ? matchEntries(searchIndex.blogPosts, trimmed) : [];
  const productResults = trimmed ? matchEntries(searchIndex.products, trimmed) : [];

  const faveAiConfig = buildChatModes(siteSettings, projects).general;
  const hasResults =
    navResults.length > 0 ||
    projectResults.length > 0 ||
    skillResults.length > 0 ||
    superpowerResults.length > 0 ||
    blogResults.length > 0 ||
    productResults.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Search results"
          className="fixed inset-y-0 right-0 z-40 flex w-full max-w-sm flex-col border-l border-hairline bg-surface shadow-[-16px_0_48px_rgb(35_25_15_/_0.15)]"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-hairline px-4 py-3">
            <div>
              <p className="text-[13px] font-semibold text-ink-strong">Search results</p>
              <p className="type-meta mt-0.5">&ldquo;{query}&rdquo;</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="shrink-0 rounded-md p-1 text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink-strong"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {!hasResults ? (
              <p className="type-meta px-1 py-8 text-center">No results found.</p>
            ) : (
              <>
                {navResults.length > 0 && (
                  <div className="mb-3">
                    <p className="type-label mb-1.5 px-1">Pages</p>
                    <div className="flex flex-col gap-0.5">
                      {navResults.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-ink-strong transition-colors hover:bg-surface-muted"
                          >
                            <Icon size={15} className="shrink-0 text-ink-soft" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {projectResults.length > 0 && (
                  <div className="mb-3">
                    <p className="type-label mb-1.5 px-1">Projects</p>
                    <div className="flex flex-col gap-0.5">
                      {projectResults.map((project) => (
                        <Link
                          key={project._id}
                          href={`/projects/${project.slug}`}
                          onClick={onClose}
                          className="block rounded-lg px-2.5 py-2 transition-colors hover:bg-surface-muted"
                        >
                          <span className="block truncate text-[13px] font-medium text-ink-strong">
                            {project.name}
                          </span>
                          <span className="block truncate text-[11.5px] text-ink-muted">
                            {project.oneLiner}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <EntryResultGroup label="Skills" entries={skillResults} onClose={onClose} />
                <EntryResultGroup label="Design Superpowers" entries={superpowerResults} onClose={onClose} />
                <EntryResultGroup label="Blog" entries={blogResults} onClose={onClose} />
                <EntryResultGroup label="Products" entries={productResults} onClose={onClose} />
              </>
            )}
          </div>

          <div className="shrink-0 border-t border-hairline p-3">
            <FaveAiMini mode="general" config={faveAiConfig} fallbackEmail={siteSettings.contact.email} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EntryResultGroup({
  label,
  entries,
  onClose,
}: {
  label: string;
  entries: SearchEntry[];
  onClose: () => void;
}) {
  if (entries.length === 0) return null;
  return (
    <div className="mb-3">
      <p className="type-label mb-1.5 px-1">{label}</p>
      <div className="flex flex-col gap-0.5">
        {entries.map((entry) => (
          <Link
            key={entry.id}
            href={entry.href}
            onClick={onClose}
            className="block rounded-lg px-2.5 py-2 transition-colors hover:bg-surface-muted"
          >
            <span className="block truncate text-[13px] font-medium text-ink-strong">{entry.label}</span>
            {entry.sublabel && (
              <span className="block truncate text-[11.5px] text-ink-muted">{entry.sublabel}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
