import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { LandingSection } from "@/components/home/landing-section";
import { SectionHeading } from "@/components/home/section-heading";
import { StatsStrip } from "@/components/home/stats-strip";
import { VisitorMetrics } from "@/components/home/visitor-metrics";
import { SelectedWorkShowcase } from "@/components/home/selected-work-showcase";
import { AboutPreviewSection } from "@/components/home/about-preview-section";
import { SkillsPreviewSection } from "@/components/home/skills-preview-section";
import { ProcessSection } from "@/components/home/process-section";
import { DesignSystemSection } from "@/components/home/design-system-section";
import { FinalCtaSection } from "@/components/home/final-cta-section";
import { Button } from "@/components/ui/button";
import {
  getProjects,
  getSiteSettings,
  getJobApplicationVariant,
} from "@/lib/content";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ jd?: string }>;
}) {
  const { jd } = await searchParams;
  const [projects, siteSettings, jdVariant] = await Promise.all([
    getProjects(),
    getSiteSettings(),
    jd ? getJobApplicationVariant(jd) : Promise.resolve(undefined),
  ]);
  const { profile, featuredProjects, siteMetrics, contact } = siteSettings;
  const shippedProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 4);

  return (
    <div>
      <LandingSection id="hero" className="pb-16 pt-10 sm:pb-20 sm:pt-14">
        <Hero profile={profile} jdVariant={jdVariant} />
      </LandingSection>

      <LandingSection id="stats" background="surface" className="py-14 sm:py-16">
        <SectionHeading
          eyebrow="Live numbers"
          title="System Status"
          subtitle="Not projections. What you'd actually be getting."
        />
        <StatsStrip metrics={siteMetrics} />
        <VisitorMetrics />
        <div className="mt-8">
          <Button variant="outline" href="/profile#products">
            See the Products Behind These Numbers
            <ArrowRight size={14} />
          </Button>
        </div>
      </LandingSection>

      <LandingSection id="work">
        <SectionHeading
          eyebrow="Proof"
          title={{ bold: "Shipped,", soft: "Not Just Designed" }}
          subtitle="A few of the products taken from idea to real users, alone, with AI doing a lot of the execution. Picture this same speed and quality applied to what you're building next."
        />
        <p className="type-body -mt-6 mb-8 max-w-2xl text-ink-muted">
          Every project below is either live right now or was, with real people using it. No
          concept-only mockups here.
        </p>
        <SelectedWorkShowcase projects={shippedProjects} />
        <div className="mt-8">
          <Button variant="outline" href="/projects">
            View All Projects
            <ArrowRight size={14} />
          </Button>
        </div>
      </LandingSection>

      <LandingSection id="about" background="tint">
        <SectionHeading eyebrow="Why me" title="Why Companies Bring Me In" />
        <AboutPreviewSection />
      </LandingSection>

      <LandingSection id="skills">
        <SectionHeading eyebrow="Fit" title="Where I Can Plug In" />
        <SkillsPreviewSection />
      </LandingSection>

      <LandingSection id="process" background="surface">
        <SectionHeading eyebrow="Working together" title="How We'd Actually Work Together" />
        <ProcessSection />
      </LandingSection>

      <LandingSection id="design-system">
        <DesignSystemSection />
      </LandingSection>

      <LandingSection id="contact" background="surface">
        <FinalCtaSection contact={contact} />
      </LandingSection>
    </div>
  );
}
