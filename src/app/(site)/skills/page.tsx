import { PageContainer } from "@/components/shell/page-container";
import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { DoodleStar } from "@/components/doodles/doodle-star";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getSkills, getDesignSuperpowers } from "@/lib/content";
import { skillCategories } from "@/lib/data/skills";
import type { Skill } from "@/lib/types";

function groupBySubgroup(items: Skill[]) {
  const map = new Map<string, Skill[]>();
  for (const item of items) {
    map.set(item.group, [...(map.get(item.group) ?? []), item]);
  }
  return Array.from(map.entries());
}

export default async function SkillsPage() {
  const [skills, superpowers] = await Promise.all([getSkills(), getDesignSuperpowers()]);

  return (
    <PageContainer>
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            Skills
            <DoodleStar className="h-3.5 w-3.5 -rotate-6 text-highlight-blue" />
          </span>
        }
        subtitle="What I bring to a project, grouped the way I actually think about it."
      />

      <Tabs defaultValue="skills">
        <TabsList>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="superpowers">Design Superpowers</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {skillCategories.map((category) => {
              const items = skills.filter((s) => s.category === category);
              const subgroups = groupBySubgroup(items);

              return (
                <div key={category} className="card p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="type-subheading">{category}</h3>
                    <span className="type-meta">{items.length} skills</span>
                  </div>
                  <div className="flex flex-col gap-3.5">
                    {subgroups.map(([group, groupSkills]) => (
                      <div key={group}>
                        <p className="type-eyebrow mb-2">{group}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {groupSkills.map((skill) => (
                            <Badge key={skill._id} variant="neutral">
                              {skill.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="superpowers" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {superpowers.map((power, i) => (
              <div key={power._id} className="card flex gap-4 p-5">
                <span className="data-mono shrink-0 text-[28px] font-medium leading-none text-primary-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="type-subheading">{power.title}</h3>
                  <p className="type-body mt-1.5 text-ink-muted">{power.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
