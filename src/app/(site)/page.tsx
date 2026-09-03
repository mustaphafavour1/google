import { Hero } from "@/components/home/hero";
import { LandingSection } from "@/components/home/landing-section";
import { SectionHeading } from "@/components/home/section-heading";
import { MetricsSection } from "@/components/home/metrics-section";
import { VisitorMetrics } from "@/components/home/visitor-metrics";
import { JourneySection } from "@/components/home/journey-section";
import { SelectedWorkShowcase } from "@/components/home/selected-work-showcase";
import { WhyMeSection } from "@/components/home/why-me-section";
import { SkillsSuitcaseSection } from "@/components/home/skills-suitcase-section";
import { WorkingTogetherSection } from "@/components/home/working-together-section";
import { DesignSystemSection } from "@/components/home/design-system-section";
import { FinalCtaSection } from "@/components/home/final-cta-section";
import {
  getProjects,
  getSiteSettings,
  getSkillGroups,
  getJobApplicationVariant,
} from "@/lib/content";
import { getClaps } from "@/lib/metrics-store";

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
  const { profile, landing, featuredProjects, siteMetrics, contact } = siteSettings;
  const shippedProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 4);
  const landingClaps = getClaps("landing-page");

  return (
    <div>
      <LandingSection id="hero" className="pt-0 sm:pt-0">
        <Hero profile={profile} hero={landing.hero} jdVariant={jdVariant} />
      </LandingSection>

      <LandingSection id="metrics">
        <MetricsSection metrics={siteMetrics} resumeUrl={contact.resumeUrl} visitorMetrics={<VisitorMetrics />} />
      </LandingSection>

      <LandingSection id="journey" background="surface">
        <SectionHeading
          eyebrow="The journey so far"
          title="The Journey So Far"
          subtitle="Design impact, year over year, from an unpaid role to fluent AI-native building."
          align="center"
        />
        <JourneySection milestones={landing.journeyMilestones} />
      </LandingSection>

      <LandingSection id="work">
        <SectionHeading
          eyebrow="Proof"
          title="Projects that Project my Range"
          subtitle="Recent projects to see how good it gets; yours will be better of course. A new project is always better than the last one."
        />
        <SelectedWorkShowcase projects={shippedProjects} />
      </LandingSection>

      <LandingSection id="why-me">
        <WhyMeSection />
      </LandingSection>

      <LandingSection id="skills">
        <SectionHeading
          eyebrow="Fit"
          title="Skills In My Set"
          subtitle="Several skills sharpened over the year to serve you the best."
          align="center"
        />
        <SkillsSuitcaseSection groups={skillGroups} />
      </LandingSection>

      <LandingSection id="process" background="surface">
        <SectionHeading
          eyebrow="Working together"
          title="Working with me is always a pleasant experience"
          subtitle="For the various design work or needs, I have processes, values and work ethics that makes it all smooth and enjoyable."
        />
        <WorkingTogetherSection items={landing.workingTogetherItems} projects={projects} />
      </LandingSection>

      <LandingSection id="design-system">
        <DesignSystemSection projects={projects} />
      </LandingSection>

      <LandingSection id="contact" className="pb-0">
        <FinalCtaSection initialClaps={landingClaps} />
      </LandingSection>
    </div>
  );
}
