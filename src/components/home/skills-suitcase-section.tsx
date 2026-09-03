"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useContactForm } from "@/components/contact/contact-form-context";
import { useScrollInView } from "@/lib/use-scroll-in-view";
import type { SkillGroup } from "@/lib/types";

export function SkillsSuitcaseSection({ groups }: { groups: SkillGroup[] }) {
  const { openForm } = useContactForm();
  const { ref, inView } = useScrollInView("-60px");

  return (
    <div className="flex flex-col items-center">
      <div className="relative mx-auto w-full max-w-[760px]">
        <div className="absolute -top-7 left-1/2 h-9 w-32 -translate-x-1/2 rounded-t-2xl border-[10px] border-b-0 border-primary-200 bg-transparent" />

        <div className="relative flex h-[46vh] max-h-[440px] min-h-[320px] w-full flex-col overflow-hidden rounded-3xl border-[8px] border-primary-200 bg-gradient-to-br from-surface to-surface-muted shadow-[0_24px_60px_rgb(35_25_15_/_0.14)]">
          <div ref={ref} className="flex-1 overflow-y-auto px-6 py-8 sm:px-9">
            {groups.map((group, i) => (
              <motion.div
                key={group._id}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
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
        <Button
          variant="outline"
          size="lg"
          href="/skills"
          className="border-2 border-primary-500 text-primary-500 hover:bg-primary-tint hover:text-primary-600"
        >
          Full SkillSet
          <ArrowRight size={14} />
        </Button>
        <button type="button" onClick={openForm} className={buttonVariants({ size: "lg" })}>
          Let&rsquo;s discuss
        </button>
      </div>
    </div>
  );
}
