import { PageContainer } from "@/components/shell/page-container";
import { PageHeader } from "@/components/shell/page-header";
import { getProjects, getSiteSettings } from "@/lib/content";
import {
  getCumulativeValueImpact,
  getScaleMetricsByProject,
  getTotalScaleMetricsLogged,
} from "@/lib/data/analytics";
import { AnalyticsCharts } from "./analytics-charts";

export default async function AnalyticsPage() {
  const [projects, siteSettings] = await Promise.all([getProjects(), getSiteSettings()]);
  const projectsDelivered = siteSettings.siteMetrics.find((m) => m.key === "projects");

  return (
    <PageContainer>
      <PageHeader
        title="Analytics"
        subtitle="A chart-led breakdown of the body of work behind this portfolio."
      />
      <AnalyticsCharts
        caseStudyCount={projects.length}
        totalScaleMetricsLogged={getTotalScaleMetricsLogged(projects)}
        cumulativeValueImpact={getCumulativeValueImpact(projects)}
        scaleMetricsByProject={getScaleMetricsByProject(projects)}
        projectsDelivered={projectsDelivered}
        analyticsAggregate={siteSettings.analyticsAggregate}
      />
    </PageContainer>
  );
}
