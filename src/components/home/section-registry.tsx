import type { ReactNode } from "react";
import { LandingSection } from "./landing-section";
import { SectionHeading } from "./section-heading";
import { MetricsSection } from "./metrics-section";
import { VisitorMetrics } from "./visitor-metrics";
import { JourneySection } from "./journey-section";
import { SelectedWorkShowcase } from "./selected-work-showcase";
import { WhyMeSection } from "./why-me-section";
import { SkillsSuitcaseSection } from "./skills-suitcase-section";
import { WorkingTogetherSection } from "./working-together-section";
import { DesignSystemSection } from "./design-system-section";
import { FinalCtaSection } from "./final-cta-section";
import { RedesignPreviewSection } from "./redesign-preview-section";
import type { JobApplicationVariant, Project, SectionType, SiteSettings, SkillGroup } from "@/lib/types";

export type SectionContext = {
  siteSettings: SiteSettings;
  projects: Project[];
  skillGroups: SkillGroup[];
  jdVariant?: JobApplicationVariant;
  landingClaps: number;
};

/**
 * One render function per selectable section, shared by the general home
 * page (src/app/(site)/page.tsx) and the job-application variant home page
 * (src/app/(site)/apply/[slug]/page.tsx) — both pick a SectionType[] (the
 * general page's is fixed at DEFAULT_SECTION_ORDER, a variant's comes from
 * its own `sections` field) and map it through this same renderer, so the
 * two never drift apart on what each section actually looks like.
 */
export function renderSection(type: SectionType, ctx: SectionContext): ReactNode {
  const { siteSettings, projects, skillGroups, jdVariant, landingClaps } = ctx;
  const { landing, featuredProjects, siteMetrics, contact } = siteSettings;

  switch (type) {
    case "metrics":
      return (
        <LandingSection id="metrics" key="metrics">
          <MetricsSection metrics={siteMetrics} resumeUrl={contact.resumeUrl} visitorMetrics={<VisitorMetrics />} />
        </LandingSection>
      );

    case "journey":
      return (
        <LandingSection id="journey" background="surface" key="journey">
          <SectionHeading
            eyebrow="The journey so far"
            title="The Journey So Far"
            subtitle="Design impact, year over year, from an unpaid role to fluent AI-native building."
            align="center"
          />
          <JourneySection milestones={landing.journeyMilestones} />
        </LandingSection>
      );

    case "redesign-preview": {
      const preview = jdVariant?.redesignPreview;
      if (!jdVariant || !preview?.enabled || !preview.project) return null;
      return (
        <LandingSection id="redesign-preview" key="redesign-preview">
          <SectionHeading
            eyebrow="A head start"
            title={`A Quick Take on ${jdVariant.companyName}`}
            subtitle="A small redesign or fix I put together on your own product, before you even asked."
          />
          <RedesignPreviewSection project={preview.project} teaserText={preview.teaserText} />
        </LandingSection>
      );
    }

    case "work": {
      const workProjects = jdVariant?.selectedProjects.length
        ? jdVariant.selectedProjects
        : featuredProjects.length > 0
          ? featuredProjects
          : projects.slice(0, 4);
      return (
        <LandingSection id="work" key="work">
          <SectionHeading
            eyebrow="Proof"
            title={jdVariant ? `Projects most relevant to ${jdVariant.companyName}` : "Projects that Project my Range"}
            subtitle="Recent projects to see how good it gets; yours will be better of course. A new project is always better than the last one."
          />
          <SelectedWorkShowcase projects={workProjects} />
        </LandingSection>
      );
    }

    case "why-me":
      return (
        <LandingSection id="why-me" key="why-me">
          <WhyMeSection content={landing.whyMe} />
        </LandingSection>
      );

    case "skills":
      return (
        <LandingSection id="skills" key="skills">
          <SectionHeading
            eyebrow="Fit"
            title="Skills In My Set"
            subtitle="Several skills sharpened over the year to serve you the best."
            align="center"
          />
          <SkillsSuitcaseSection groups={skillGroups} />
        </LandingSection>
      );

    case "process":
      return (
        <LandingSection id="process" background="surface" key="process">
          <SectionHeading
            eyebrow="Working together"
            title="Working with me is always a pleasant experience"
            subtitle="For the various design work or needs, I have processes, values and work ethics that makes it all smooth and enjoyable."
          />
          <WorkingTogetherSection items={landing.workingTogetherItems} projects={projects} />
        </LandingSection>
      );

    case "design-system":
      return (
        <LandingSection id="design-system" key="design-system">
          <DesignSystemSection projects={projects} />
        </LandingSection>
      );

    case "contact":
      return (
        <LandingSection id="contact" className="pb-0" key="contact">
          <FinalCtaSection initialClaps={landingClaps} />
        </LandingSection>
      );
  }
}
