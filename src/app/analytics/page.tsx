"use client";

import { useTheme } from "next-themes";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { PageContainer } from "@/components/shell/page-container";
import { PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/cards/stat-card";
import { getNivoTheme } from "@/lib/nivo-theme";
import { formatCompactCurrency, formatNumber } from "@/lib/utils";
import { projects } from "@/lib/data/projects";
import { siteMetrics } from "@/lib/data/site";
import {
  totalPagesDesigned,
  cumulativeValueImpact,
  pagesByProject,
  projectTypeBreakdown,
  projectsOverTime,
} from "@/lib/data/analytics";

export default function AnalyticsPage() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const nivoTheme = getNivoTheme(dark);
  const projectsDelivered = siteMetrics.find((m) => m.key === "projects");

  return (
    <PageContainer>
      <PageHeader
        title="Analytics"
        subtitle="A chart-led breakdown of the body of work behind this portfolio."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Pages designed"
          value={formatNumber(totalPagesDesigned)}
          caption="Across the 3 case studies"
        />
        <StatCard label="Case studies analyzed" value={String(projects.length)} />
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
          <h3 className="type-subheading">Pages designed per case study</h3>
          <p className="type-meta mb-4 mt-1">Derived directly from each project&rsquo;s scope</p>
          <div className="h-[260px]">
            <ResponsiveBar
              data={pagesByProject}
              keys={["pages"]}
              indexBy="project"
              margin={{ top: 10, right: 10, bottom: 32, left: 32 }}
              padding={0.5}
              borderRadius={4}
              enableGridX={false}
              enableGridY
              axisBottom={{ tickSize: 0, tickPadding: 8 }}
              axisLeft={{ tickSize: 0, tickPadding: 8 }}
              theme={nivoTheme}
              colors={["#2F6FED"]}
              defs={[
                {
                  id: "pagesGradient",
                  type: "linearGradient",
                  colors: [
                    { offset: 0, color: "#2F6FED" },
                    { offset: 100, color: "#2F6FED", opacity: 0.5 },
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
              data={projectTypeBreakdown}
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
              colors={["#F59E0B"]}
              defs={[
                {
                  id: "breakdownGradient",
                  type: "linearGradient",
                  colors: [
                    { offset: 0, color: "#F59E0B" },
                    { offset: 100, color: "#F59E0B", opacity: 0.5 },
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
                data: projectsOverTime.map((d) => ({ x: d.year, y: d.count })),
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
            colors={["#2F6FED"]}
            lineWidth={2.5}
            pointSize={6}
            pointColor={dark ? "#111727" : "#FFFFFF"}
            pointBorderWidth={2}
            pointBorderColor="#2F6FED"
            useMesh
            theme={nivoTheme}
            defs={[
              {
                id: "trendGradient",
                type: "linearGradient",
                colors: [
                  { offset: 0, color: "#2F6FED", opacity: 0.35 },
                  { offset: 100, color: "#2F6FED", opacity: 0 },
                ],
              },
            ]}
            fill={[{ match: "*", id: "trendGradient" }]}
          />
        </div>
      </div>

      <p className="type-meta mt-4">
        * Figures marked Illustrative are career-wide placeholders — swap for real numbers in{" "}
        <code className="data-mono">lib/data/analytics.ts</code>. The case-study figures above are
        computed directly from the seeded project data.
      </p>
    </PageContainer>
  );
}
