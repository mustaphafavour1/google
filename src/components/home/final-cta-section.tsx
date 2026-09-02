"use client";

import { motion } from "framer-motion";
import { Download, Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ResumeGateButton } from "@/components/resume/resume-gate-button";
import { useContactForm } from "@/components/contact/contact-form-context";
import type { SiteSettings } from "@/lib/types";

export function FinalCtaSection({ contact }: { contact: SiteSettings["contact"] }) {
  const { openForm } = useContactForm();
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="mx-auto flex max-w-xl flex-col items-center text-center"
    >
      <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3 py-1.5 text-[12px] font-medium text-ink-soft">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        Open to new work
      </span>

      <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.15] tracking-tight text-ink-em">
        Ready to move at this speed?
      </h2>
      <p className="type-body mt-4 max-w-md text-ink-muted">
        Let&rsquo;s talk about what senior design, backed by a real AI-native workflow, could do
        for your team.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        <button type="button" onClick={openForm} className={buttonVariants({ size: "lg" })}>
          <Mail size={15} />
          Get In Touch
        </button>
        {contact.resumeUrl && (
          <ResumeGateButton className={buttonVariants({ variant: "outline", size: "lg" })}>
            <Download size={15} />
            Download Résumé
          </ResumeGateButton>
        )}
      </div>
    </motion.div>
  );
}
