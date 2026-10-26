import { Hero } from "@/components/home/hero";
import { LandingSection } from "@/components/home/landing-section";
import { renderSection } from "@/components/home/section-registry";
import { getProjects, getSiteSettings, getSkillGroups, getJobApplicationVariant } from "@/lib/content";
import { getClaps } from "@/lib/metrics-store";
import { DEFAULT_SECTION_ORDER } from "@/lib/types";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ jd?: string }>;
}) {
  const { jd } = await searchParams;
  const [projects, siteSettings, skillGroups, jdVariant] = await Promise.all([
    getProjects(),
    getSiteSettings(),
    getSkillGroups(),
    jd ? getJobApplicationVariant(jd) : Promise.resolve(undefined),
  ]);
  const { profile, landing } = siteSettings;
  const landingClaps = getClaps("landing-page");
  const sectionOrder = jdVariant?.sections?.length ? jdVariant.sections : DEFAULT_SECTION_ORDER;

  return (
    <div>
      <LandingSection id="hero" className="pt-0 sm:pt-0">
        <Hero profile={profile} hero={landing.hero} jdVariant={jdVariant} />
      </LandingSection>

      {sectionOrder.map((type) => renderSection(type, { siteSettings, projects, skillGroups, jdVariant, landingClaps }))}
    </div>
  );
}
