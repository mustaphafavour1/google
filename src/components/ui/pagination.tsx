"use client";

import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  noun: string;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
};

export function Pagination({
  page,
  pageSize,
  total,
  noun,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  function stepPageSize(direction: 1 | -1) {
    if (!onPageSizeChange) return;
    const idx = pageSizeOptions.indexOf(pageSize);
    const nextIdx = Math.min(pageSizeOptions.length - 1, Math.max(0, idx + direction));
    onPageSizeChange(pageSizeOptions[nextIdx]);
  }

  return (
    <div className="pagination-bar">
      <p className="type-meta">
        Showing {from}–{to} of {total} {noun}
      </p>

      <div className="flex items-center gap-2">
        {onPageSizeChange && (
          <>
            <div className="flex h-7 items-center gap-1 rounded-md border border-border px-2">
              <span className="data-mono text-[11px] text-ink-strong">{pageSize}</span>
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => stepPageSize(-1)}
                  className="text-ink-soft hover:text-ink-strong"
                  aria-label="Fewer per page"
                >
                  <ChevronUp size={8} />
                </button>
                <button
                  type="button"
                  onClick={() => stepPageSize(1)}
                  className="text-ink-soft hover:text-ink-strong"
                  aria-label="More per page"
                >
                  <ChevronDown size={8} />
                </button>
              </div>
            </div>
            <span className="type-meta">per page</span>
          </>
        )}

        <button
          type="button"
          className="step-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={13} />
        </button>

        <span className={cn("page-chip")}>{page}</span>
        <span className="type-meta">of {totalPages}</span>

        <button
          type="button"
          className="step-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
