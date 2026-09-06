"use client";

import { useMemo, useState } from "react";
import { CalendarDays, CalendarRange, Images, LayoutGrid, ListOrdered, Shuffle } from "lucide-react";
import { AutoScrollControl } from "@/components/ui/auto-scroll-control";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { DddTile } from "./ddd-tile";
import { shuffle } from "@/lib/gallery";
import { cn } from "@/lib/utils";
import type { DddEntry } from "@/lib/types";

const PAGE_SIZE = 40;

type ViewMode = "all" | "weekly" | "monthly";

type Bucket = { key: string; label: string; entries: DddEntry[] };

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function buildBuckets(entries: DddEntry[], unit: "week" | "month"): Bucket[] {
  const dated = entries.filter((e): e is DddEntry & { date: string } => Boolean(e.date));
  const undated = entries.filter((e) => !e.date);

  const map = new Map<string, DddEntry[]>();
  for (const entry of dated) {
    const d = new Date(`${entry.date}T00:00:00`);
    const key =
      unit === "week"
        ? startOfWeek(d).toISOString().slice(0, 10)
        : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(entry);
  }

  const buckets = Array.from(map.keys())
    .sort()
    .map((key) => ({
      key,
      label:
        unit === "week"
          ? `Week of ${new Date(`${key}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
          : new Date(`${key}-01T00:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      entries: map.get(key)!,
    }));

  if (undated.length > 0) buckets.push({ key: "undated", label: "Undated", entries: undated });
  return buckets;
}

export function DddGrid({ entries }: { entries: DddEntry[] }) {
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<"ordered" | "random">("ordered");
  const [view, setView] = useState<ViewMode>("all");
  const [shuffled, setShuffled] = useState<DddEntry[] | null>(null);

  const baseEntries = order === "random" ? (shuffled ?? entries) : entries;

  const buckets = useMemo(
    () => (view === "all" ? null : buildBuckets(baseEntries, view === "weekly" ? "week" : "month")),
    [baseEntries, view],
  );

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Images}
        title="Nothing posted yet"
        description="Add a batch of images in Sanity Studio, under Daily Design Dose, and they'll show up here."
      />
    );
  }

  function setOrderMode(mode: "ordered" | "random") {
    setOrder(mode);
    if (mode === "random") setShuffled(shuffle(entries));
    setPage(1);
  }

  function setViewMode(mode: ViewMode) {
    setView(mode);
    setPage(1);
  }

  const totalPages =
    view === "all" ? Math.max(1, Math.ceil(baseEntries.length / PAGE_SIZE)) : Math.max(1, buckets!.length);
  const pageEntries =
    view === "all"
      ? baseEntries.slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE)
      : (buckets![page - 1]?.entries ?? []);
  const pageLabel = view !== "all" ? buckets![page - 1]?.label : null;

  function changePage(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function advancePageForAutoScroll() {
    setPage((p) => (p % totalPages) + 1);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
    return true;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-hairline bg-surface p-3">
        <AutoScrollControl onReachBottom={advancePageForAutoScroll} />
        <div className="flex flex-wrap items-center gap-2">
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

          <div className="flex items-center gap-1 rounded-md border border-hairline p-1">
            <button
              type="button"
              onClick={() => setViewMode("all")}
              aria-pressed={view === "all"}
              className={cn(
                "flex items-center gap-1.5 rounded px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                view === "all" ? "bg-primary-tint text-primary-tint-text" : "text-ink-soft hover:text-ink-strong",
              )}
            >
              <LayoutGrid size={13} />
              All
            </button>
            <button
              type="button"
              onClick={() => setViewMode("weekly")}
              aria-pressed={view === "weekly"}
              className={cn(
                "flex items-center gap-1.5 rounded px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                view === "weekly" ? "bg-primary-tint text-primary-tint-text" : "text-ink-soft hover:text-ink-strong",
              )}
            >
              <CalendarDays size={13} />
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setViewMode("monthly")}
              aria-pressed={view === "monthly"}
              className={cn(
                "flex items-center gap-1.5 rounded px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                view === "monthly" ? "bg-primary-tint text-primary-tint-text" : "text-ink-soft hover:text-ink-strong",
              )}
            >
              <CalendarRange size={13} />
              Monthly
            </button>
          </div>
        </div>
      </div>

      {pageLabel && <p className="type-eyebrow mb-3">{pageLabel}</p>}

      <div className="grid grid-cols-2 items-start gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {pageEntries.map((entry) => (
          <DddTile key={entry._id} entry={entry} />
        ))}
      </div>

      <div className="mt-8">
        <Pagination
          page={page}
          pageSize={view === "all" ? PAGE_SIZE : 1}
          total={view === "all" ? baseEntries.length : totalPages}
          noun={view === "all" ? "entries" : view === "weekly" ? "weeks" : "months"}
          onPageChange={changePage}
        />
      </div>
    </div>
  );
}
