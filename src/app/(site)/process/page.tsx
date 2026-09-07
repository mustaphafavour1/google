import { PageContainer } from "@/components/shell/page-container";
import { PageHeader } from "@/components/shell/page-header";
import { DoodleStar } from "@/components/doodles/doodle-star";
import { Tabs, TabsContent, LineTabsList, LineTabsTrigger } from "@/components/ui/tabs";
import { getProcessTracks, getSkillGroups, getSkills, getDesignSuperpowers } from "@/lib/content";
import { ProcessTabs } from "@/components/process/process-tabs";
import { SkillsFull } from "@/components/skills/skills-full";
import { DesignSuperpowersFull } from "@/components/skills/design-superpowers-full";

const TAB_VALUES = ["process", "skills", "superpowers"] as const;
type TabValue = (typeof TAB_VALUES)[number];

function isTabValue(value: string | undefined): value is TabValue {
  return TAB_VALUES.includes(value as TabValue);
}

export default async function ProcessPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const initialTab: TabValue = isTabValue(tab) ? tab : "process";

  const [processTracks, skillGroups, skills, superpowers] = await Promise.all([
    getProcessTracks(),
    getSkillGroups(),
    getSkills(),
    getDesignSuperpowers(),
  ]);

  return (
    <PageContainer>
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            Process + Skills
            <DoodleStar className="h-3.5 w-3.5 -rotate-6 text-highlight-blue" />
          </span>
        }
        subtitle="How each discipline runs, what I bring to it, and the range behind it."
      />

      <Tabs defaultValue={initialTab}>
        <LineTabsList>
          <LineTabsTrigger value="process">Process</LineTabsTrigger>
          <LineTabsTrigger value="skills">Skills</LineTabsTrigger>
          <LineTabsTrigger value="superpowers">Design Superpowers</LineTabsTrigger>
        </LineTabsList>

        <TabsContent value="process" className="mt-8">
          <ProcessTabs processTracks={processTracks} />
        </TabsContent>

        <TabsContent value="skills" className="mt-8">
          <SkillsFull skills={skills} skillGroups={skillGroups} />
        </TabsContent>

        <TabsContent value="superpowers" className="mt-8">
          <DesignSuperpowersFull superpowers={superpowers} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
