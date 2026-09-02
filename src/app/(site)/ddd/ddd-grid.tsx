"use client";

import { useState } from "react";
import { Images } from "lucide-react";
import { AutoScrollControl } from "@/components/ui/auto-scroll-control";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { DddTile } from "./ddd-tile";
import type { DddEntry } from "@/lib/types";

const PAGE_SIZE = 40;

export function DddGrid({ entries }: { entries: DddEntry[] }) {
  const [page, setPage] = useState(1);

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Images}
        title="Nothing posted yet"
        description="Add entries in Sanity Studio, under Daily Design Dose, and they'll show up here."
      />
    );
  }

  const start = (page - 1) * PAGE_SIZE;
  const pageEntries = entries.slice(start, start + PAGE_SIZE);

  function changePage(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <div className="mb-6 rounded-xl border border-hairline bg-surface p-3">
        <AutoScrollControl />
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
          total={entries.length}
          noun="entries"
          onPageChange={changePage}
        />
      </div>
    </div>
  );
}
