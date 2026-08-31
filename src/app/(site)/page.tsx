import Link from "next/link";
import { ArrowUpRight, Download, Mail } from "lucide-react";
import { PageContainer } from "@/components/shell/page-container";
import { StatCard } from "@/components/cards/stat-card";
import { ProjectCard } from "@/components/cards/project-card";
import { PreviewPanel } from "@/components/cards/preview-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DoodleUnderline } from "@/components/doodles/doodle-underline";
import { DoodleStar } from "@/components/doodles/doodle-star";
import { getProjects, getProcessTracks, getSiteSettings, getSkills } from "@/lib/content";

export default async function HomePage() {
  const [projects, skills, processTracks, siteSettings] = await Promise.all([
    getProjects(),
    getSkills(),
    getProcessTracks(),
    getSiteSettings(),
  ]);
  const { profile, siteMetrics, about, contact } = siteSettings;

  const hasPlaceholderMetric = siteMetrics.some((m) => m.isPlaceholder);
  const featuredSkills = skills.slice(0, 10);

  return (
    <PageContainer offset={false}>
      <section className="pt-1">
        <p className="type-eyebrow">Welcome</p>
        <h1 className="type-display mt-2">
          Hi, I&rsquo;m {profile.firstName} —{" "}
          <span className="relative inline-block">
            {profile.title.toLowerCase()}
            <DoodleUnderline className="absolute -bottom-1.5 left-0 h-2.5 w-full text-primary-300" />
          </span>
          .
        </h1>
        <p className="type-body mt-3 max-w-xl">{profile.tagline}</p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <Button href="/contact">
            <Mail size={14} />
            Get in touch
          </Button>
          {contact.resumeUrl && (
            <Button variant="outline" asChild>
              <a href={contact.resumeUrl} download>
                <Download size={14} />
                Download resume
              </a>
            </Button>
          )}
        </div>
      </section>

      <section className="mt-9">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {siteMetrics.map((metric) => (
            <StatCard
              key={metric.key}
              label={metric.label}
              value={metric.value}
              isPlaceholder={metric.isPlaceholder}
            />
          ))}
        </div>
        {hasPlaceholderMetric && (
          <p className="type-meta mt-2">
            * Placeholder figures — update with your real numbers in Site settings.
          </p>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[19px] font-semibold tracking-tight text-ink-em">
            Selected projects
            <DoodleStar className="h-4 w-4 rotate-12 text-highlight-orange" />
          </h2>
          <Link
            href="/projects"
            className="flex items-center gap-1 text-[12.5px] font-medium text-primary-500 hover:text-primary-600"
          >
            View all projects
            <ArrowUpRight size={13} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        <PreviewPanel title="About" viewMoreHref="/about">
          <p className="type-body line-clamp-4 text-ink-muted">{about.general.paragraphs[0]}</p>
        </PreviewPanel>

        <PreviewPanel title="Skills" viewMoreHref="/skills">
          <div className="flex flex-wrap gap-1.5">
            {featuredSkills.map((skill) => (
              <Badge key={skill._id} variant="neutral">
                {skill.name}
              </Badge>
            ))}
          </div>
        </PreviewPanel>

        <PreviewPanel title="Process" viewMoreHref="/process">
          <ul className="flex flex-col gap-2">
            {processTracks.map((track) => (
              <li key={track._id} className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-medium text-ink-strong">{track.discipline}</span>
                <span className="type-meta shrink-0">{track.phases.length} phases</span>
              </li>
            ))}
          </ul>
        </PreviewPanel>
      </section>

      <section className="mt-10">
        <div className="card flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="type-subheading">Let&rsquo;s work together</h3>
            <p className="type-body mt-1 text-ink-muted">
              Open to new product design and front-end build work.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2.5">
            <Button variant="outline" asChild>
              <a href={`mailto:${contact.email}`}>
                <Mail size={14} />
                {contact.email}
              </a>
            </Button>
            <Button href="/contact">
              Contact page
              <ArrowUpRight size={14} />
            </Button>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
