import { PageContainer } from "@/components/shell/page-container";
import { PageHeader } from "@/components/shell/page-header";
import { getProcessTracks } from "@/lib/content";
import { ProcessTabs } from "@/components/process/process-tabs";

export default async function ProcessPage() {
  const processTracks = await getProcessTracks();

  return (
    <PageContainer>
      <PageHeader
        title="Process"
        subtitle="How each discipline runs, from framing the problem to handover."
      />
      <ProcessTabs processTracks={processTracks} />
    </PageContainer>
  );
}
