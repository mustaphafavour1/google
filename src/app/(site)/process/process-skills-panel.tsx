import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SkillGroup } from "@/lib/types";

export function ProcessSkillsPanel({ groups }: { groups: SkillGroup[] }) {
  return (
    <div>
      <p className="type-eyebrow mb-3">Skills</p>
      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <div key={group._id}>
            <p className="type-label mb-1.5">{group.title}</p>
            <div className="flex flex-wrap gap-1.5">
              {group.pills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-md border border-hairline bg-surface px-2 py-0.5 text-[11px] font-medium text-ink-strong"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/skills"
        className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-primary-500 transition-colors hover:text-primary-600"
      >
        See full skill set
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}
