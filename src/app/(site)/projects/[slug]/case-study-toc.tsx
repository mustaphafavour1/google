"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function CaseStudyToc({ items }: { items: { id: string; label: string }[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className="sticky top-[calc(var(--header-h)+1.5rem)] hidden h-max max-h-[calc(100vh-var(--header-h)-3rem)] w-52 shrink-0 overflow-y-auto xl:block"
    >
      <p className="type-eyebrow mb-3">On this page</p>
      <ul className="flex flex-col gap-0.5 border-l border-hairline">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={() => setActiveId(item.id)}
              aria-current={activeId === item.id ? "location" : undefined}
              className={cn(
                "-ml-px block truncate border-l-2 py-1.5 pl-3 text-[12.5px] transition-colors",
                activeId === item.id
                  ? "border-primary-500 font-medium text-ink-strong"
                  : "border-transparent text-ink-muted hover:text-ink-strong",
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
