import { Globe2 } from "lucide-react";
import { getCountryBreakdown, getUniqueVisitorCount } from "@/lib/metrics-store";

export function VisitorMetrics() {
  const countries = getCountryBreakdown();
  const total = getUniqueVisitorCount();

  if (total === 0) return null;

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-hairline pt-6 text-center">
      <span className="flex items-center gap-1.5 text-[12.5px] text-ink-soft">
        <Globe2 size={13} />
        {total} anonymous, aggregate {total === 1 ? "visitor" : "visitors"} so far, from{" "}
        {countries.length} {countries.length === 1 ? "location" : "locations"}
      </span>
      {countries.slice(0, 6).map((c) => (
        <span
          key={c.country}
          className="data-mono rounded-full border border-hairline px-2 py-0.5 text-[11px] text-ink-soft"
        >
          {c.country} · {c.count}
        </span>
      ))}
    </div>
  );
}
