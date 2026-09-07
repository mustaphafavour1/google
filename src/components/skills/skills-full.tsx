import { Badge } from "@/components/ui/badge";
import { skillCategories } from "@/lib/data/skills";
import type { Skill, SkillGroup } from "@/lib/types";

function groupBySubgroup(items: Skill[]) {
  const map = new Map<string, Skill[]>();
  for (const item of items) {
    map.set(item.group, [...(map.get(item.group) ?? []), item]);
  }
  return Array.from(map.entries());
}

export function SkillsFull({ skills, skillGroups }: { skills: Skill[]; skillGroups: SkillGroup[] }) {
  return (
    <div>
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

      {skillGroups.length > 0 && (
        <div className="mt-8 border-t border-hairline pt-8">
          <p className="type-eyebrow mb-4">More from how I work</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {skillGroups.map((group) => (
              <div key={group._id} className="card p-5">
                <p className="type-label mb-2">{group.title}</p>
                <div className="flex flex-wrap gap-1.5">
                  {group.pills.map((pill) => (
                    <Badge key={pill} variant="neutral">
                      {pill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
