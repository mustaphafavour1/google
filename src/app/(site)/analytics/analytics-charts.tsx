"use client";

import { useTheme } from "next-themes";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { StatCard } from "@/components/cards/stat-card";
import { getNivoPalette, getNivoTheme } from "@/lib/nivo-theme";
import { formatCompactCurrency, formatNumber } from "@/lib/utils";
import type { SiteMetric, SiteSettings } from "@/lib/types";

const PRIMARY = "#A55C4E";
const HIGHLIGHT = "#B35A04";

type Props = {
  caseStudyCount: number;
  totalScaleMetricsLogged: number;
  cumulativeValueImpact: number;
  scaleMetricsByProject: { project: string; metrics: number }[];
  projectsDelivered: SiteMetric | undefined;
  analyticsAggregate: SiteSettings["analyticsAggregate"];
};

export function AnalyticsCharts({
  caseStudyCount,
  totalScaleMetricsLogged,
  cumulativeValueImpact,
  scaleMetricsByProject,
  projectsDelivered,
  analyticsAggregate,
}: Props) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const nivoTheme = getNivoTheme(dark);
  const { tooltipBg } = getNivoPalette(dark);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Scope metrics logged"
          value={formatNumber(totalScaleMetricsLogged)}
          caption={`Across the ${caseStudyCount} case studies`}
        />
        <StatCard label="Case studies analyzed" value={String(caseStudyCount)} />
        <StatCard
          label="Value modeled"
          value={formatCompactCurrency(cumulativeValueImpact)}
          caption="Estimated, summed per case study"
        />
        <StatCard
          label="Projects delivered (career)"
          value={projectsDelivered?.value ?? "—"}
          isPlaceholder={projectsDelivered?.isPlaceholder}
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="type-subheading">Scope metrics per case study</h3>
          <p className="type-meta mb-4 mt-1">Derived directly from each project&rsquo;s scope</p>
          <div className="h-[260px]">
            <ResponsiveBar
              data={scaleMetricsByProject}
              keys={["metrics"]}
              indexBy="project"
              margin={{ top: 10, right: 10, bottom: 32, left: 32 }}
              padding={0.5}
              borderRadius={4}
              enableGridX={false}
              enableGridY
              axisBottom={{ tickSize: 0, tickPadding: 8 }}
              axisLeft={{ tickSize: 0, tickPadding: 8 }}
              theme={nivoTheme}
              colors={[PRIMARY]}
              defs={[
                {
                  id: "pagesGradient",
                  type: "linearGradient",
                  colors: [
                    { offset: 0, color: PRIMARY },
                    { offset: 100, color: PRIMARY, opacity: 0.5 },
                  ],
                },
              ]}
              fill={[{ match: "*", id: "pagesGradient" }]}
            />
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h3 className="type-subheading">Project-type breakdown</h3>
            <span className="type-meta">Illustrative</span>
          </div>
          <p className="type-meta mb-4 mt-1">
            Career-wide mix — dashboards, apps, websites, branding, campaigns
          </p>
          <div className="h-[260px]">
            <ResponsiveBar
              data={analyticsAggregate.projectTypeBreakdown}
              keys={["count"]}
              indexBy="type"
              margin={{ top: 10, right: 10, bottom: 32, left: 32 }}
              padding={0.4}
              borderRadius={4}
              enableGridX={false}
              enableGridY
              axisBottom={{ tickSize: 0, tickPadding: 8 }}
              axisLeft={{ tickSize: 0, tickPadding: 8 }}
              theme={nivoTheme}
              colors={[HIGHLIGHT]}
              defs={[
                {
                  id: "breakdownGradient",
                  type: "linearGradient",
                  colors: [
                    { offset: 0, color: HIGHLIGHT },
                    { offset: 100, color: HIGHLIGHT, opacity: 0.5 },
                  ],
                },
              ]}
              fill={[{ match: "*", id: "breakdownGradient" }]}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 card p-5">
        <div className="flex items-center justify-between">
          <h3 className="type-subheading">Projects over time</h3>
          <span className="type-meta">Illustrative</span>
        </div>
        <p className="type-meta mb-4 mt-1">Career-wide project count by year</p>
        <div className="h-[280px]">
          <ResponsiveLine
            data={[
              {
                id: "projects",
                data: analyticsAggregate.projectsOverTime.map((d) => ({ x: d.year, y: d.count })),
              },
            ]}
            margin={{ top: 10, right: 16, bottom: 32, left: 32 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: 0, max: "auto" }}
            curve="monotoneX"
            enableGridX={false}
            enableGridY
            axisBottom={{ tickSize: 0, tickPadding: 8 }}
            axisLeft={{ tickSize: 0, tickPadding: 8 }}
            enableArea
            areaOpacity={0.15}
            colors={[PRIMARY]}
            lineWidth={2.5}
            pointSize={6}
            pointColor={tooltipBg}
            pointBorderWidth={2}
            pointBorderColor={PRIMARY}
            useMesh
            theme={nivoTheme}
            defs={[
              {
                id: "trendGradient",
                type: "linearGradient",
                colors: [
                  { offset: 0, color: PRIMARY, opacity: 0.35 },
                  { offset: 100, color: PRIMARY, opacity: 0 },
                ],
              },
            ]}
            fill={[{ match: "*", id: "trendGradient" }]}
          />
        </div>
      </div>

      <p className="type-meta mt-4">
        * Figures marked Illustrative are career-wide placeholders — swap for real numbers in Site
        settings → Analytics aggregates. The case-study figures above are computed directly from
        the live project data.
      </p>
    </>
  );
}
