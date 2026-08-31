"use client";

import { motion } from "framer-motion";
import { Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoodleUnderline } from "@/components/doodles/doodle-underline";
import { LiveDashboardMock } from "./live-dashboard-mock";
import type { JobApplicationVariant, SiteSettings } from "@/lib/types";

export function Hero({
  profile,
  jdVariant,
}: {
  profile: SiteSettings["profile"];
  jdVariant?: JobApplicationVariant;
}) {
  return (
    <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
      <div>
        {jdVariant ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-tint px-3 py-1 text-[12px] font-medium text-primary-tint-text"
          >
            <Sparkles size={12} />
            Tailored for {jdVariant.companyName}
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="type-eyebrow mb-4"
          >
            Product designer · Lagos, Nigeria
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-[clamp(2.25rem,4.5vw,3.5rem)] font-semibold leading-[1.06] tracking-tight text-ink-em"
        >
          {jdVariant ? (
            <>
              Hi {jdVariant.companyName} team — I&rsquo;m {profile.firstName}.
            </>
          ) : (
            <>
              I design{" "}
              <span className="relative inline-block">
                dashboards
                <DoodleUnderline className="absolute -bottom-1.5 left-0 h-3 w-full text-primary-300" />
              </span>{" "}
              that feel alive.
            </>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="type-body mt-5 max-w-lg text-[16px] leading-relaxed text-ink-muted"
        >
          {jdVariant?.introNote ||
            "Product systems for fintech, health-tech, and B2B SaaS teams — built on the belief that hierarchy, restraint, and a real design system beat decoration every time."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-7 flex flex-wrap gap-2.5"
        >
          <Button href="/contact" size="lg">
            <Mail size={15} />
            Get in touch
          </Button>
          {jdVariant ? (
            <Button variant="outline" size="lg" href={`/apply/${jdVariant.slug}`}>
              See what I picked for {jdVariant.companyName}
            </Button>
          ) : (
            <Button variant="outline" size="lg" href="/projects">
              See the work
            </Button>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex justify-center lg:justify-end"
      >
        <LiveDashboardMock />
      </motion.div>
    </div>
  );
}
