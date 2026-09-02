"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [pendingBack, setPendingBack] = useState(false);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setDirection(pendingBack ? "back" : "forward");
    setPendingBack(false);
  }

  useEffect(() => {
    function onPopState() {
      setPendingBack(true);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ x: direction === "back" ? -56 : 56, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ y: -24, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
