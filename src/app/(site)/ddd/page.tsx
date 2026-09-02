import { PageContainer } from "@/components/shell/page-container";
import { PageHeader } from "@/components/shell/page-header";
import { getDddEntries } from "@/lib/content";
import { DddGrid } from "./ddd-grid";

export default async function DddPage() {
  const entries = await getDddEntries();

  return (
    <PageContainer>
      <PageHeader
        title="Daily Design Dose"
        subtitle="365 days of design tips, one a day — May 2024 to May 2025."
      />
      <DddGrid entries={entries} />
    </PageContainer>
  );
}
