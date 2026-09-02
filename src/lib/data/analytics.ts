import type { Project } from "@/lib/types";

/**
 * Pure helpers computed straight from whatever project list was fetched
 * (live from Sanity, or the local fallback) — never hardcoded.
 */
export function getTotalScaleMetricsLogged(projects: Project[]) {
  return projects.reduce((sum, p) => sum + p.scale.length, 0);
}

export function getCumulativeValueImpact(projects: Project[]) {
  return projects.reduce((sum, p) => sum + (p.valueImpact?.amount ?? 0), 0);
}

export function getScaleMetricsByProject(projects: Project[]) {
  return projects.map((p) => ({ project: p.name, metrics: p.scale.length }));
}
