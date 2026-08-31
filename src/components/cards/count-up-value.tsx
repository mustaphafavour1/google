"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

const NUMERIC_PREFIX = /^(-?\d+(?:\.\d+)?)(.*)$/;

export function CountUpValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const match = value.match(NUMERIC_PREFIX);
  const [display, setDisplay] = useState(match ? `0${match[2]}` : value);

  useEffect(() => {
    if (!isInView) return;
    const m = value.match(NUMERIC_PREFIX);
    if (!m) return;
    const target = parseFloat(m[1]);
    const suffix = m[2];
    const decimals = m[1].includes(".") ? m[1].split(".")[1].length : 0;
    const controls = animate(0, target, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate(latest) {
        setDisplay(latest.toFixed(decimals) + suffix);
      },
    });
    return () => controls.stop();
  }, [isInView, value]);

  return <span ref={ref}>{display}</span>;
}
