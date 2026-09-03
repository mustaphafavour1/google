"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gem, Palette, Layers3, ShieldCheck } from "lucide-react";
import { useContactForm } from "@/components/contact/contact-form-context";
import { useScrollInView } from "@/lib/use-scroll-in-view";

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

const CARD_RADIUS = "16px";

const GRADIENT_BORDER_STYLE = {
  background: "linear-gradient(135deg, white, #c0c0c0 50%, white)",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
  padding: 2,
  borderRadius: CARD_RADIUS,
} as const;

const ICON_FADE_MASK = "linear-gradient(to bottom, transparent, black 75%)";

export function WhyMeSection() {
  const { openForm } = useContactForm();
  const { ref, inView } = useScrollInView("-80px");

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 px-4 py-16 text-white sm:px-8">
      <div className="relative mx-auto max-w-2xl text-center">
        <p className="type-eyebrow mb-2.5 text-white/70">Why me</p>
        <h2 className="text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-white">
          A Rare Synergy of Quality for You
        </h2>
        <p className="mt-3.5 text-[17px] font-medium leading-relaxed text-white/80">
          Some of the rare things I offer that makes me the best-fit.
        </p>
      </div>

      <div ref={ref} className="relative mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-4">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            style={{ borderRadius: CARD_RADIUS }}
            className="group relative aspect-square overflow-hidden bg-white/10 p-5 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-50"
              style={GRADIENT_BORDER_STYLE}
            />
            <card.icon
              size={144}
              className="pointer-events-none absolute -right-3 -top-3 rotate-[18deg] text-white opacity-0 transition-all duration-500 group-hover:rotate-[8deg] group-hover:opacity-[0.16]"
              style={{ maskImage: ICON_FADE_MASK, WebkitMaskImage: ICON_FADE_MASK }}
            />
            <div className="relative flex h-full flex-col justify-center">
              <h3 className="text-[20px] font-bold text-white">{card.title}</h3>
              <p className="type-body mt-1.5 text-white/80">{card.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative mt-8 flex justify-center">
        <button
          type="button"
          onClick={openForm}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-white px-6 text-[15.5px] font-semibold text-primary-600 transition-colors hover:bg-white/90"
        >
          Let&rsquo;s discuss
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
