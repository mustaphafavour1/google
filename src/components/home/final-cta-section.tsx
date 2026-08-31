"use client";

import { motion } from "framer-motion";
import { Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/types";

export function FinalCtaSection({ contact }: { contact: SiteSettings["contact"] }) {
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
        Let&rsquo;s build something that feels alive.
      </h2>
      <p className="type-body mt-4 max-w-md text-ink-muted">
        Open to new product design and front-end build work — fintech, health-tech, B2B SaaS, or
        anything that needs a real system, not just a set of screens.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        <Button href="/contact" size="lg">
          <Mail size={15} />
          Get in touch
        </Button>
        {contact.resumeUrl && (
          <Button variant="outline" size="lg" asChild>
            <a href={contact.resumeUrl} download>
              <Download size={15} />
              Download résumé
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
