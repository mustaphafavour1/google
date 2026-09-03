"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";

const DESIGN_SYSTEM_URL = "https://designsystem.headfavour.com";
const ALLOWANCE_URL = "https://allowance-kohl.vercel.app/";
const ENSEMBLE_URL = "https://ensemble-two-navy.vercel.app/overview";

const LINKS = [
  { label: "Check out the Design System", href: DESIGN_SYSTEM_URL },
  { label: "Allowance Website", href: ALLOWANCE_URL },
  { label: "Ensemble Dashboard", href: ENSEMBLE_URL },
];

const ROTATE_MS = 3200;

export function DesignSystemSection({ projects }: { projects: Project[] }) {
  const aiProjects = projects.filter((p) => p.tags.includes("AI-coding") && (p.coverGifUrl ?? p.coverImage));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (aiProjects.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % aiProjects.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [aiProjects.length]);

  const active = aiProjects[index];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-ink-em">
          <span className="block">With me, AI-built ≠ Slop.</span>
          <span className="block">With Me, AI-built = Speed + Quality.</span>
        </h2>
      </motion.div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 sm:items-stretch">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-hairline bg-surface-muted">
          {active && (
            <AnimatePresence mode="wait">
              <motion.div
                key={active._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="h-full w-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host */}
                <img
                  src={active.coverGifUrl ?? active.coverImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div className="flex aspect-[4/3] w-full flex-col justify-center p-6 sm:p-7">
          <p className="type-body text-[17px] font-medium leading-relaxed text-ink-muted">
            There&rsquo;s this portfolio, a design system, and several outstanding websites &amp; apps
            to prove it.
          </p>
          <p className="type-body mt-6 text-ink-muted">
            Check out my personal Taste and Spec document in the design system (194 detailed website
            sections included).
          </p>
          <div className="mt-9 flex flex-col gap-5">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[24px] font-semibold text-ink-em underline decoration-primary-500 decoration-2 underline-offset-2 transition-colors hover:text-primary-500"
              >
                {link.label}
                <ArrowUpRight size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
