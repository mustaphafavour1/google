"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gem, Palette, Layers3, ShieldCheck } from "lucide-react";
import { useContactForm } from "@/components/contact/contact-form-context";

const CARDS = [
  {
    title: "Quality Design & Dev",
    subtitle: "1 budget for both design & dev at high quality",
    icon: Gem,
  },
  {
    title: "Brand & Product",
    subtitle: "One Senior hire to handle everything design.",
    icon: Palette,
  },
  {
    title: "Multi-Niche Depth",
    subtitle: "Rare depth in Fintech, Govtech, healthtech, non-profits etc.",
    icon: Layers3,
  },
  {
    title: "Reliability & Resourcefulness",
    subtitle: "The one quality everybody and companies I've worked with always mention is my reliability.",
    icon: ShieldCheck,
  },
];

export function WhyMeSection() {
  const { openForm } = useContactForm();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 px-4 py-12 text-white sm:px-8">
      <div className="relative mx-auto max-w-2xl text-center">
        <p className="type-eyebrow mb-2.5 text-white/70">Why me</p>
        <h2 className="text-[clamp(1.5rem,3vw,2.1rem)] font-semibold leading-tight tracking-tight text-white">
          A Rare Synergy of Quality for You
        </h2>
        <p className="type-body mt-3 text-white/75">
          Some of the rare things I offer that makes me the best-fit.
        </p>
      </div>

      <div className="relative mx-auto mt-9 grid max-w-4xl gap-4 sm:grid-cols-2">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
          >
            <card.icon
              size={72}
              className="pointer-events-none absolute -right-3 -top-3 rotate-[18deg] text-white opacity-0 transition-all duration-500 group-hover:rotate-[8deg] group-hover:opacity-[0.14]"
            />
            <div className="relative">
              <h3 className="text-[14.5px] font-semibold text-white">{card.title}</h3>
              <p className="type-body mt-1.5 text-white/80">{card.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative mt-8 flex justify-center">
        <button
          type="button"
          onClick={openForm}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-white px-5 text-[14px] font-medium text-primary-600 transition-colors hover:bg-white/90"
        >
          Let&rsquo;s discuss
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
