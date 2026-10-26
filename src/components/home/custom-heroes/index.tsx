import type { ComponentType } from "react";
import type { JobApplicationVariant, SiteSettings } from "@/lib/types";

export type CustomHeroProps = {
  jdVariant: JobApplicationVariant;
  profile: SiteSettings["profile"];
};

/**
 * Fully bespoke, hand-coded hero components for specific tailored
 * applications — not CMS-driven, unlike heroStyle "image"/"video". Register
 * a new one here (keyed by whatever string makes sense) when a one-off
 * hero needs more than a background swap: a unique layout, interaction, or
 * concept entirely. Each component owns the WHOLE hero — it replaces the
 * title/subtitle/CTA markup too, not just the background layer.
 *
 * To activate: set that key as the variant's "heroCustomComponentKey" in
 * Studio with heroStyle set to Custom. An unregistered or unset key falls
 * back to the default hero (see hero.tsx) — a typo can never break the
 * page, it just silently doesn't apply.
 */
export const CUSTOM_HEROES: Record<string, ComponentType<CustomHeroProps>> = {};
