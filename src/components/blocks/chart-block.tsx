"use client";

import { useTheme } from "next-themes";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { getNivoPalette, getNivoTheme } from "@/lib/nivo-theme";
import type { ChartBlock as ChartBlockT } from "@/lib/types";
import type { Project } from "@/lib/types";

export function ChartBlock({ block, project }: { block: ChartBlockT; project: Project }) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  const { tooltipBg } = getNivoPalette(dark);
  const nivoTheme = getNivoTheme(dark);
  const primary = project.accent.primary;
  const secondary = project.accent.secondary;

  return (
    <div>
      {block.heading && <h3 className="type-subheading mb-1">{block.heading}</h3>}
      {block.caption && <p className="type-meta mb-3">{block.caption}</p>}
      <div className="h-[280px] rounded-lg border border-hairline p-4">
        {block.chartType === "bar" && (
          <ResponsiveBar
            data={block.data as never}
            keys={block.keys ?? ["value"]}
            indexBy={block.indexBy ?? "index"}
            margin={{ top: 10, right: 10, bottom: 32, left: 36 }}
            padding={0.4}
            borderRadius={4}
            enableGridX={false}
            enableGridY
            axisBottom={{ tickSize: 0, tickPadding: 8 }}
            axisLeft={{ tickSize: 0, tickPadding: 8 }}
            theme={nivoTheme}
            colors={[primary]}
            defs={[
              {
                id: "barGradient",
                type: "linearGradient",
                colors: [
                  { offset: 0, color: primary },
                  { offset: 100, color: primary, opacity: 0.5 },
                ],
              },
            ]}
            fill={[{ match: "*", id: "barGradient" }]}
          />
        )}

        {block.chartType === "line" && (
          <ResponsiveLine
            data={[
              {
                id: block.keys?.[0] ?? "value",
                data: block.data.map((d) => ({
                  x: d[block.indexBy ?? "index"],
                  y: d[block.keys?.[0] ?? "value"],
                })) as never,
              },
            ]}
            margin={{ top: 10, right: 16, bottom: 32, left: 36 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: 0, max: "auto" }}
            curve="monotoneX"
            enableGridX={false}
            enableGridY
            axisBottom={{ tickSize: 0, tickPadding: 8 }}
            axisLeft={{ tickSize: 0, tickPadding: 8 }}
            enableArea
            areaOpacity={0.18}
            colors={[primary]}
            lineWidth={2.5}
            pointSize={6}
            pointColor={tooltipBg}
            pointBorderWidth={2}
            pointBorderColor={primary}
            enablePoints
            useMesh
            theme={nivoTheme}
            defs={[
              {
                id: "lineGradient",
                type: "linearGradient",
                colors: [
                  { offset: 0, color: primary, opacity: 0.35 },
                  { offset: 100, color: primary, opacity: 0 },
                ],
              },
            ]}
            fill={[{ match: "*", id: "lineGradient" }]}
          />
        )}

        {block.chartType === "pie" && (
          <ResponsivePie
            data={block.data as never}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            innerRadius={0.6}
            padAngle={1.5}
            cornerRadius={3}
            activeOuterRadiusOffset={4}
            colors={[primary, secondary, dark ? "#3A4358" : "#CBD5E1", dark ? "#2A3348" : "#E2E8F0"]}
            borderWidth={0}
            enableArcLinkLabels={false}
            arcLabelsSkipAngle={20}
            arcLabelsTextColor={dark ? "#0B0F1A" : "#FFFFFF"}
            arcLabel={(d) => `${d.value}%`}
            theme={nivoTheme}
          />
        )}
      </div>
    </div>
  );
}
