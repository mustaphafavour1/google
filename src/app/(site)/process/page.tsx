import { PageContainer } from "@/components/shell/page-container";
import { PageHeader } from "@/components/shell/page-header";
import { getProcessTracks, getSkillGroups } from "@/lib/content";
import { ProcessTabs } from "@/components/process/process-tabs";
import { ProcessSkillsPanel } from "./process-skills-panel";

export default async function ProcessPage() {
  const [processTracks, skillGroups] = await Promise.all([getProcessTracks(), getSkillGroups()]);

  return (
    <PageContainer>
      <PageHeader
        title="Process"
        subtitle="How each discipline runs, from framing the problem to handover."
      />
      <div className="flex gap-10">
        <div className="min-w-0 flex-1">
          <ProcessTabs processTracks={processTracks} />
        </div>
        <aside className="sticky top-[calc(var(--header-h)+1.5rem)] hidden h-max max-h-[calc(100vh-var(--header-h)-3rem)] w-52 shrink-0 overflow-y-auto xl:block">
          <ProcessSkillsPanel groups={skillGroups} />
        </aside>
      </div>
    </PageContainer>
  );
}
