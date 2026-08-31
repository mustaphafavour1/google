"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight, Quote } from "lucide-react";
import type { Project } from "@/lib/types";

const ILLUSTRATIVE_COPY: Record<string, string> = {
  caretrace:
    "The scheduling view alone cut our coordinators' morning routine from about an hour to ten minutes. It stopped feeling like software we had to fight.",
  corridor:
    "We finally had one screen that told the truth about where a payout actually was. That sounds small until you've spent years without it.",
  switchboard:
    "It's the first tool where switching providers felt like flipping a setting, not shipping a migration project.",
};

function buildTestimonials(projects: Project[]) {
  return projects.map((project) => ({
    key: project._id,
    quote: ILLUSTRATIVE_COPY[project.slug] ?? project.oneLiner,
    project: project.name,
    role: `${project.industry} · illustrative`,
  }));
}

export function TestimonialsSection({ projects }: { projects: Project[] }) {
  const testimonials = buildTestimonials(projects);
  const [order, setOrder] = useState(() => testimonials.map((_, i) => i));
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || order.length < 2) return;
    const id = setInterval(() => {
      setOrder((cur) => [...cur.slice(1), cur[0]]);
    }, 5200);
    return () => clearInterval(id);
  }, [prefersReducedMotion, order.length]);

  if (testimonials.length === 0) return null;

  return (
    <div className="flex flex-col items-center">
      <p className="type-meta mb-7 flex items-center gap-1.5">
        <Quote size={12} />
        Illustrative — the kind of feedback this work aims for
      </p>
      <div className="relative h-64 w-full max-w-xl sm:h-52">
        {order.map((testimonialIndex, stackPosition) => {
          const t = testimonials[testimonialIndex];
          const isTop = stackPosition === 0;
          const side = stackPosition % 2 === 0 ? 1 : -1;
          return (
            <motion.div
              key={t.key}
              className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-hairline bg-surface p-7 shadow-[0_10px_30px_rgb(15_15_15_/_0.08)]"
              animate={{
                rotate: stackPosition === 0 ? 0 : side * (2 + stackPosition * 1.5),
                x: stackPosition === 0 ? 0 : side * stackPosition * 6,
                y: stackPosition * 10,
                scale: 1 - stackPosition * 0.045,
                opacity: stackPosition > 2 ? 0 : 1 - stackPosition * 0.28,
                zIndex: 10 - stackPosition,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <p className="text-[16px] leading-relaxed text-ink-strong sm:text-[17px]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="text-[13px] font-semibold text-ink-em">{t.project}</p>
                <p className="type-meta mt-0.5">{t.role}</p>
              </div>
              {isTop && (
                <button
                  type="button"
                  onClick={() => setOrder((cur) => [...cur.slice(1), cur[0]])}
                  aria-label="Show next testimonial"
                  className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-surface text-ink-soft shadow-sm transition-colors hover:bg-surface-muted hover:text-ink-strong"
                >
                  <ChevronRight size={15} />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
