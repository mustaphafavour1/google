"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useContactForm } from "@/components/contact/contact-form-context";
import { HeroBlobs } from "./hero-blobs";
import type { JobApplicationVariant, SiteSettings } from "@/lib/types";

export function Hero({
  profile,
  hero,
  jdVariant,
}: {
  profile: SiteSettings["profile"];
  hero: SiteSettings["landing"]["hero"];
  jdVariant?: JobApplicationVariant;
}) {
  const { openForm } = useContactForm();

  return (
    <div className="relative flex min-h-[95vh] flex-col items-center justify-center px-4 py-6 text-center">
      <HeroBlobs />

      {jdVariant && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-tint px-3 py-1 text-[12px] font-medium text-primary-tint-text"
        >
          <Sparkles size={12} />
          Tailored for {jdVariant.companyName}
        </motion.div>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="max-w-3xl text-[clamp(2.1rem,4.6vw,3.5rem)] font-extrabold leading-[1.08] tracking-tight text-ink-em"
      >
        {jdVariant ? <>Hi {jdVariant.companyName} team — I&rsquo;m {profile.firstName}.</> : hero.title}
      </motion.h1>

      {!jdVariant && hero.titleUnderText && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-2 max-w-xl text-[28px] font-semibold leading-[1.15] text-ink-soft dark:text-primary-300"
        >
          {hero.titleUnderText}
        </motion.p>
      )}

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="type-body mt-5 max-w-xl text-[16px] font-bold leading-relaxed text-ink-muted dark:text-primary-300"
      >
        {jdVariant?.introNote || hero.subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-7 flex flex-wrap justify-center gap-2.5"
      >
        {jdVariant ? (
          <Button size="lg" href={`/apply/${jdVariant.slug}`}>
            See what I picked for {jdVariant.companyName}
          </Button>
        ) : (
          <>
            <button type="button" onClick={openForm} className={buttonVariants({ size: "lg" })}>
              {hero.ctaPrimaryLabel}
              <ArrowRight size={15} />
            </button>
            <Button
              variant="outline"
              size="lg"
              href="#work"
              className="border-primary-500 text-primary-500 hover:bg-primary-tint hover:text-primary-600"
            >
              {hero.ctaSecondaryLabel}
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
}
