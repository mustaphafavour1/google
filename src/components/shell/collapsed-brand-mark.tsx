"use client";

import { motion } from "framer-motion";

const BRAND_TEXT = "HeadFavour's Portfolio";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
};

const letter = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

export function CollapsedBrandMark() {
  return (
    <div className="flex flex-1 items-center justify-center overflow-hidden py-4">
      <motion.div
        key="collapsed-brand-mark"
        variants={container}
        initial="hidden"
        animate="visible"
        className="flex -rotate-90 items-center whitespace-nowrap font-brand text-[19px] leading-none text-primary-500"
      >
        {BRAND_TEXT.split("").map((char, i) => (
          <motion.span key={i} variants={letter} transition={{ duration: 0.25 }}>
            {char === " " ? " " : char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
