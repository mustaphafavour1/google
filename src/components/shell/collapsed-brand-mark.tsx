"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ROTATE_MS = 4000;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035 } },
};

const letter = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

export function CollapsedBrandMark({ phrases }: { phrases: string[] }) {
  const list = phrases.length > 0 ? phrases : ["Favour M."];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (list.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % list.length), ROTATE_MS);
    return () => clearInterval(timer);
  }, [list.length]);

  const text = list[index % list.length];
  const isLong = text.length > 20;

  return (
    <div className="flex flex-1 items-center justify-center overflow-hidden py-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          variants={container}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          className={cn(
            "flex -rotate-90 items-center whitespace-nowrap font-brand leading-none text-primary-500",
            isLong ? "text-[23px]" : "text-[27px]",
          )}
        >
          {text.split("").map((char, i) => (
            <motion.span key={i} variants={letter} transition={{ duration: 0.25 }}>
              {char === " " ? <span className="inline-block w-[0.35em]" /> : char}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
