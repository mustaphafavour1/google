"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutPreviewSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      <p className="type-body max-w-2xl text-[16px] leading-relaxed text-ink-muted">
        My engineering background means I can work directly with your dev team, with nothing lost
        in translation. I design product and brand together, so you get one senior hire instead
        of two. And after years across fintech, health-tech, and B2B SaaS, I&rsquo;m already
        fluent in the kind of high-stakes, regulated-adjacent product work most companies
        actually need.
      </p>
      <div className="mt-6">
        <Button variant="outline" href="/about">
          Read the Full Background
          <ArrowRight size={14} />
        </Button>
      </div>
    </motion.div>
  );
}
