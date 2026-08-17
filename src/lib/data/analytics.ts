import { projects } from "./projects";

/**
 * Career-wide aggregates that can't be derived from the 3 seeded case
 * studies alone (the case studies are all dashboards; the real body of work
 * spans apps, websites, branding, and campaigns too). Illustrative
 * placeholders — swap for real numbers directly in this file.
 */
export const isAnalyticsAggregatePlaceholder = true;

/** Derived directly from the seeded case studies — no invented numbers. */
export const totalPagesDesigned = projects.reduce((sum, p) => sum + p.scale.pages, 0);
export const cumulativeValueImpact = projects.reduce(
  (sum, p) => sum + (p.valueImpact?.amount ?? 0),
  0,
);
export const pagesByProject = projects.map((p) => ({ project: p.name, pages: p.scale.pages }));

export const projectTypeBreakdown = [
  { type: "Dashboards", count: 14 },
  { type: "Apps", count: 11 },
  { type: "Websites", count: 16 },
  { type: "Branding", count: 12 },
  { type: "Campaigns", count: 9 },
];

export const projectsOverTime = [
  { year: "2019", count: 4 },
  { year: "2020", count: 6 },
  { year: "2021", count: 7 },
  { year: "2022", count: 9 },
  { year: "2023", count: 10 },
  { year: "2024", count: 11 },
  { year: "2025", count: 9 },
  { year: "2026", count: 6 },
];
