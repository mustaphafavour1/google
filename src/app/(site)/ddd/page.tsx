import { PageContainer } from "@/components/shell/page-container";
import { PageHeader } from "@/components/shell/page-header";
import { getDddEntries, getSiteSettings } from "@/lib/content";
import { DddGrid } from "./ddd-grid";

export default async function DddPage() {
  const [entries, siteSettings] = await Promise.all([getDddEntries(), getSiteSettings()]);

  return (
    <PageContainer>
      <PageHeader title="Daily Design Dose" subtitle={siteSettings.dddSubtitle} />
      <DddGrid entries={entries} />
    </PageContainer>
  );
}
