import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { LandingSection } from "@/components/home/landing-section";
import { renderSection } from "@/components/home/section-registry";
import { getJobApplicationVariant, getProjects, getSiteSettings, getSkillGroups } from "@/lib/content";
import { getClaps } from "@/lib/metrics-store";
import { DEFAULT_SECTION_ORDER } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const variant = await getJobApplicationVariant(slug);
  if (!variant) return {};
  return {
    title: `For ${variant.companyName}`,
    description: `A portfolio put together for ${variant.companyName}.`,
    robots: { index: false, follow: false },
  };
}

export default async function JobApplicationVariantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [jdVariant, projects, siteSettings, skillGroups] = await Promise.all([
    getJobApplicationVariant(slug),
    getProjects(),
    getSiteSettings(),
    getSkillGroups(),
  ]);
  if (!jdVariant) notFound();

  const { profile, landing } = siteSettings;
  const landingClaps = getClaps("landing-page");
  const sectionOrder = jdVariant.sections?.length ? jdVariant.sections : DEFAULT_SECTION_ORDER;

  return (
    <div>
      <LandingSection id="hero" className="pt-0 sm:pt-0">
        <Hero profile={profile} hero={landing.hero} jdVariant={jdVariant} />
      </LandingSection>

      {sectionOrder.map((type) => renderSection(type, { siteSettings, projects, skillGroups, jdVariant, landingClaps }))}
    </div>
  );
}
