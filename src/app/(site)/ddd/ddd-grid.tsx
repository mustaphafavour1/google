"use client";

import { useState } from "react";
import { Images, ListOrdered, Shuffle } from "lucide-react";
import { AutoScrollControl } from "@/components/ui/auto-scroll-control";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { DddTile } from "./ddd-tile";
import { shuffle } from "@/lib/gallery";
import { cn } from "@/lib/utils";
import type { DddEntry } from "@/lib/types";

const PAGE_SIZE = 40;

export function DddGrid({ entries }: { entries: DddEntry[] }) {
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<"ordered" | "random">("ordered");
  const [displayEntries, setDisplayEntries] = useState(entries);

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Images}
        title="Nothing posted yet"
        description="Add a week's images in Sanity Studio, under Daily Design Dose, and they'll show up here."
      />
    );
  }

  function setOrderMode(mode: "ordered" | "random") {
    setOrder(mode);
    setDisplayEntries(mode === "random" ? shuffle(entries) : entries);
    setPage(1);
  }

  const start = (page - 1) * PAGE_SIZE;
  const pageEntries = displayEntries.slice(start, start + PAGE_SIZE);

  function changePage(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-hairline bg-surface p-3">
        <AutoScrollControl />
        <div className="flex items-center gap-1 rounded-md border border-hairline p-1">
          <button
            type="button"
            onClick={() => setOrderMode("ordered")}
            aria-pressed={order === "ordered"}
            className={cn(
              "flex items-center gap-1.5 rounded px-2.5 py-1.5 text-[12px] font-medium transition-colors",
              order === "ordered" ? "bg-primary-tint text-primary-tint-text" : "text-ink-soft hover:text-ink-strong",
            )}
          >
            <ListOrdered size={13} />
            Ordered
          </button>
          <button
            type="button"
            onClick={() => setOrderMode("random")}
            aria-pressed={order === "random"}
            className={cn(
              "flex items-center gap-1.5 rounded px-2.5 py-1.5 text-[12px] font-medium transition-colors",
              order === "random" ? "bg-primary-tint text-primary-tint-text" : "text-ink-soft hover:text-ink-strong",
            )}
          >
            <Shuffle size={13} />
            Random
          </button>
        </div>
      </div>

      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
        {pageEntries.map((entry) => (
          <DddTile key={entry._id} entry={entry} />
        ))}
      </div>

      <div className="mt-8">
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={displayEntries.length}
          noun="entries"
          onPageChange={changePage}
        />
      </div>
    </div>
  );
}
