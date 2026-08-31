import { Hero } from "@/components/home/hero";
import { LandingSection } from "@/components/home/landing-section";
import { SectionHeading } from "@/components/home/section-heading";
import { StatsStrip } from "@/components/home/stats-strip";
import { VisitorMetrics } from "@/components/home/visitor-metrics";
import { PhilosophySection } from "@/components/home/philosophy-section";
import { CapabilityGrid } from "@/components/home/capability-grid";
import { SelectedWorkShowcase } from "@/components/home/selected-work-showcase";
import { ProcessSection } from "@/components/home/process-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { BioSection } from "@/components/home/bio-section";
import { FinalCtaSection } from "@/components/home/final-cta-section";
import {
  getProjects,
  getProcessTracks,
  getSiteSettings,
  getJobApplicationVariant,
} from "@/lib/content";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ jd?: string }>;
}) {
  const { jd } = await searchParams;
  const [projects, processTracks, siteSettings, jdVariant] = await Promise.all([
    getProjects(),
    getProcessTracks(),
    getSiteSettings(),
    jd ? getJobApplicationVariant(jd) : Promise.resolve(undefined),
  ]);
  const { profile, siteMetrics, about, contact, hobbies } = siteSettings;

  return (
    <div>
      <LandingSection id="hero" className="pb-16 pt-10 sm:pb-20 sm:pt-14">
        <Hero profile={profile} jdVariant={jdVariant} />
      </LandingSection>

      <LandingSection id="stats" background="surface" className="py-14 sm:py-16">
        <StatsStrip metrics={siteMetrics} />
        <VisitorMetrics />
      </LandingSection>

      <LandingSection id="philosophy">
        <PhilosophySection paragraph={about.design.paragraphs[0]} />
      </LandingSection>

      <LandingSection id="capabilities" background="tint">
        <SectionHeading eyebrow="What I bring" title="Six disciplines, one system underneath" />
        <CapabilityGrid />
      </LandingSection>

      <LandingSection id="work">
        <SectionHeading
          eyebrow="Selected work"
          title="Three real systems, three different industries"
        />
        <SelectedWorkShowcase projects={projects} />
      </LandingSection>

      <LandingSection id="process" background="surface">
        <SectionHeading
          eyebrow="How it happens"
          title="A process built for a 12-page build, not a single screen"
        />
        <ProcessSection tracks={processTracks} />
      </LandingSection>

      <LandingSection id="testimonials">
        <TestimonialsSection projects={projects} />
      </LandingSection>

      <LandingSection id="about" background="tint">
        <BioSection profile={profile} paragraph={about.general.paragraphs[1]} hobbies={hobbies} />
      </LandingSection>

      <LandingSection id="contact" background="surface">
        <FinalCtaSection contact={contact} />
      </LandingSection>
    </div>
  );
}
