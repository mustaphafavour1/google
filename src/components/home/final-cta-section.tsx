"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { useContactForm } from "@/components/contact/contact-form-context";
import { ClapButton } from "@/components/case-study/clap-button";
import { CommentBox } from "@/components/case-study/comment-box";
import { cn } from "@/lib/utils";
import { useScrollInView } from "@/lib/use-scroll-in-view";
import { GridSquaresBackground, GRID_SQUARE_SIZE } from "./grid-squares-background";

const TARGET_BOX_WIDTH = 384;

export function FinalCtaSection({ initialClaps }: { initialClaps: number }) {
  const { openForm } = useContactForm();
  const outerRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: TARGET_BOX_WIDTH, marginLeft: 0 });
  const { ref: contentRef, inView } = useScrollInView("-100px");

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    function snapToGrid() {
      const cs = getComputedStyle(outer!);
      const paddingLeft = parseFloat(cs.paddingLeft);
      const gridSpaceWidth = outer!.clientWidth;
      const width = Math.round(TARGET_BOX_WIDTH / GRID_SQUARE_SIZE) * GRID_SQUARE_SIZE;
      const idealOffset = (gridSpaceWidth - width) / 2;
      const snappedOffset = Math.round(idealOffset / GRID_SQUARE_SIZE) * GRID_SQUARE_SIZE;
      setBox({ width, marginLeft: snappedOffset - paddingLeft });
    }

    snapToGrid();
    const observer = new ResizeObserver(snapToGrid);
    observer.observe(outer);
    return () => observer.disconnect();
  }, []);

  function scrollToComments() {
    document.getElementById("drop-a-message")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div ref={outerRef} className="relative overflow-hidden px-4 py-14 sm:px-8">
      <GridSquaresBackground />

      <motion.div
        ref={contentRef}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
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
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-primary-500 text-primary-500 hover:bg-primary-tint hover:text-primary-600",
            )}
          >
            Drop a message
          </button>
        </div>
      </motion.div>

      <div
        id="drop-a-message"
        className="relative mt-12 scroll-mt-24 bg-surface p-5"
        style={{ width: box.width, marginLeft: box.marginLeft }}
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
