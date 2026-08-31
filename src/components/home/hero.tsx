"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Download, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoodleUnderline } from "@/components/doodles/doodle-underline";
import type { JobApplicationVariant, Project, SiteSettings } from "@/lib/types";

export function Hero({
  profile,
  contact,
  projects,
  jdVariant,
}: {
  profile: SiteSettings["profile"];
  contact: SiteSettings["contact"];
  projects: Project[];
  jdVariant?: JobApplicationVariant;
}) {
  return (
    <section className="pt-1">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
        <div>
          {jdVariant ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-tint px-3 py-1 text-[12px] font-medium text-primary-tint-text"
            >
              <Sparkles size={12} />
              Tailored for {jdVariant.companyName}
            </motion.div>
          ) : (
            <p className="type-eyebrow">Welcome</p>
          )}

          <h1 className="type-display mt-2">
            {jdVariant ? (
              <>
                Hi {jdVariant.companyName} team — I&rsquo;m {profile.firstName}.
              </>
            ) : (
              <>
                Hi, I&rsquo;m {profile.firstName} —{" "}
                <span className="relative inline-block">
                  {profile.title.toLowerCase()}
                  <DoodleUnderline className="absolute -bottom-1.5 left-0 h-2.5 w-full text-primary-300" />
                </span>
                .
              </>
            )}
          </h1>

          <p className="type-body mt-3 max-w-xl">{jdVariant?.introNote || profile.tagline}</p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button href="/contact">
              <Mail size={14} />
              Get in touch
            </Button>
            {jdVariant ? (
              <Button variant="outline" href={`/apply/${jdVariant.slug}`}>
                See what I picked for {jdVariant.companyName}
              </Button>
            ) : (
              contact.resumeUrl && (
                <Button variant="outline" asChild>
                  <a href={contact.resumeUrl} download>
                    <Download size={14} />
                    Download resume
                  </a>
                </Button>
              )
            )}
          </div>
        </div>

        <FloatingStack projects={projects} />
      </div>
    </section>
  );
}

function FloatingStack({ projects }: { projects: Project[] }) {
  const reduceMotion = useReducedMotion();
  const cards = projects.slice(0, 3);
  if (cards.length === 0) return null;

  return (
    <div aria-hidden="true" className="relative hidden h-56 w-56 shrink-0 lg:block">
      {cards.map((project, i) => (
        <motion.div
          key={project._id}
          className="absolute h-32 w-44 rounded-2xl border border-hairline shadow-[0_12px_32px_rgb(35_25_15_/_0.16)]"
          style={{
            background: `linear-gradient(135deg, ${project.accent.primary}, ${project.accent.secondary})`,
            top: i * 28,
            left: i * 20,
            zIndex: cards.length - i,
            rotate: i % 2 === 0 ? -3 : 3,
          }}
          animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        >
          <div className="flex h-full flex-col justify-end p-3">
            <p className="text-[11px] font-semibold text-white/90">{project.name}</p>
            <p className="text-[10px] text-white/70">{project.industry}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
