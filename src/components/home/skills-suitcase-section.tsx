"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useContactForm } from "@/components/contact/contact-form-context";
import type { SkillGroup } from "@/lib/types";

export function SkillsSuitcaseSection({ groups }: { groups: SkillGroup[] }) {
  const { openForm } = useContactForm();

  return (
    <div className="flex flex-col items-center">
      <div className="relative mx-auto w-full max-w-[600px]">
        <div className="absolute -top-3 left-1/2 h-3 w-24 -translate-x-1/2 rounded-t-lg border border-b-0 border-hairline bg-surface-muted" />

        <div className="relative flex h-[58vh] max-h-[540px] min-h-[380px] w-full flex-col overflow-hidden rounded-3xl border border-hairline bg-gradient-to-br from-surface to-surface-muted shadow-[0_24px_60px_rgb(35_25_15_/_0.14)]">
          <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-9">
            {groups.map((group, i) => (
              <motion.div
                key={group._id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className={i > 0 ? "mt-5 border-t border-hairline pt-5" : ""}
              >
                <p className="type-label mb-2.5">{group.title}</p>
                <div className="flex flex-wrap gap-1.5">
                  {group.pills.map((pill) => (
                    <span
                      key={pill}
                      className="rounded-md border border-hairline bg-surface px-2.5 py-1 text-[12px] font-medium text-ink-strong shadow-sm"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-9 flex flex-wrap justify-center gap-2.5">
        <Button variant="outline" href="/skills">
          See the Full Skill Set
          <ArrowRight size={14} />
        </Button>
        <button type="button" onClick={openForm} className={buttonVariants({})}>
          Let&rsquo;s discuss
        </button>
      </div>
    </div>
  );
}
