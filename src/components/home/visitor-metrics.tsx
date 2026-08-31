import { Globe2 } from "lucide-react";
import { getCountryBreakdown, getUniqueVisitorCount } from "@/lib/metrics-store";

export function VisitorMetrics() {
  const countries = getCountryBreakdown();
  const total = getUniqueVisitorCount();

  if (total === 0) return null;

  return (
    <section className="mt-6">
      <div className="card p-5">
        <div className="mb-2 flex items-center gap-2 text-ink-soft">
          <Globe2 size={15} />
          <p className="type-eyebrow">Anonymous, aggregate visitor metrics</p>
        </div>
        <p className="text-[13px] text-ink-muted">
          {total} unique {total === 1 ? "visitor" : "visitors"} so far, from {countries.length}{" "}
          {countries.length === 1 ? "location" : "locations"}.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {countries.slice(0, 8).map((c) => (
            <span
              key={c.country}
              className="data-mono rounded-full border border-hairline px-2.5 py-1 text-ink-soft"
            >
              {c.country} · {c.count}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
