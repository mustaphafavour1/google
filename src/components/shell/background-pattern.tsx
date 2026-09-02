"use client";

import { usePathname } from "next/navigation";
import type { BackgroundPattern, BackgroundPatternPageKey } from "@/lib/types";

const PAGE_KEY_BY_PATH: Record<string, BackgroundPatternPageKey> = {
  "/": "overview",
  "/projects": "projects",
  "/gallery": "gallery",
  "/products": "products",
  "/profile": "profile",
  "/playground": "playground",
  "/archive": "archive",
  "/process": "process",
  "/skills": "skills",
  "/contact": "contact",
  "/analytics": "analytics",
  "/blog": "blog",
  "/ddd": "ddd",
};

function resolvePattern(patterns: BackgroundPattern[], pathname: string): BackgroundPattern | null {
  const projectSlug = pathname.match(/^\/projects\/([^/]+)/)?.[1];
  const specific = projectSlug
    ? patterns.find((p) => p.projectSlugs.includes(projectSlug))
    : patterns.find((p) => PAGE_KEY_BY_PATH[pathname] && p.pages.includes(PAGE_KEY_BY_PATH[pathname]));
  if (specific) return specific;

  return patterns.find((p) => p.global) ?? null;
}

export function BackgroundPattern({ patterns }: { patterns: BackgroundPattern[] }) {
  const pathname = usePathname();
  const pattern = resolvePattern(patterns, pathname);

  if (!pattern?.svgUrl) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.06] dark:opacity-[0.1]"
      style={{
        backgroundImage: `url(${pattern.svgUrl})`,
        backgroundRepeat: "repeat",
        backgroundSize: "160px 160px",
      }}
    />
  );
}
