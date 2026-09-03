"use client";

import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { useContactForm } from "@/components/contact/contact-form-context";
import { ClapButton } from "@/components/case-study/clap-button";
import { CommentBox } from "@/components/case-study/comment-box";
import { GridSquaresBackground } from "./grid-squares-background";

export function FinalCtaSection({ initialClaps }: { initialClaps: number }) {
  const { openForm } = useContactForm();

  function scrollToComments() {
    document.getElementById("drop-a-message")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-hairline px-4 py-14 sm:px-8">
      <GridSquaresBackground />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto flex max-w-xl flex-col items-center text-center"
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
            Let&rsquo;s speak
          </button>
          <button
            type="button"
            onClick={scrollToComments}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Drop a message
          </button>
        </div>
      </motion.div>

      <div
        id="drop-a-message"
        className="relative mx-auto mt-12 w-full max-w-sm scroll-mt-24 rounded-xl border border-hairline bg-surface p-5 shadow-[0_2px_10px_rgb(35_25_15_/_0.06)]"
      >
        <div className="flex items-center justify-between">
          <p className="type-eyebrow">Leave a thought</p>
          <ClapButton slug="landing-page" initialClaps={initialClaps} />
        </div>
        <div className="mt-3">
          <CommentBox projectName="the portfolio" />
        </div>
      </div>
    </div>
  );
}
