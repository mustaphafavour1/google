import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageContainer } from "@/components/shell/page-container";
import { ProjectBlocks } from "@/components/blocks/block-renderer";
import { ProcessTabs } from "@/components/process/process-tabs";
import { Button } from "@/components/ui/button";
import { getProjectBySlug, getProjects, getProcessTracks } from "@/lib/content";
import { CaseStudyToc } from "./case-study-toc";
import type { ProjectBlock } from "@/lib/types";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.name} — Favour Mustapha`,
    description: project.oneLiner,
  };
}

function tocEntry(block: ProjectBlock): { id: string; label: string } | null {
  switch (block._type) {
    case "metricsRow":
      return { id: block._key, label: block.heading || "Scope at a glance" };
    case "richText":
      return { id: block._key, label: block.heading || "Overview" };
    case "sideBySideCards":
      return { id: block._key, label: block.heading || "Design focus" };
    case "imageGallery":
      return { id: block._key, label: block.heading || "Selected screens" };
    case "chart":
      return { id: block._key, label: block.heading || "By the numbers" };
    case "processTimeline":
      return { id: block._key, label: block.heading || "Process" };
    case "imageGrid":
      return { id: block._key, label: block.heading || "Screens" };
    case "video":
      return { id: block._key, label: block.heading || "Walkthrough" };
    case "textGrid":
      return { id: block._key, label: block.heading || "Highlights" };
    default:
      return null;
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, projects, processTracks] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
    getProcessTracks(),
  ]);
  if (!project) notFound();

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const next = projects[(currentIndex + 1) % projects.length];

  const tocItems = project.blocks.map(tocEntry).filter((entry) => entry !== null);
  const relevantTracks = processTracks.filter((track) =>
    project.processDisciplines?.includes(track.discipline),
  );
  if (relevantTracks.length > 0) {
    tocItems.push({ id: "case-study-process", label: "How I approached it" });
  }

  return (
    <PageContainer>
      <div className="flex gap-10">
        <div className="min-w-0 flex-1">
          <Link
            href="/projects"
            className="mb-6 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-soft transition-colors hover:text-ink-strong"
          >
            <ArrowLeft size={13} />
            All projects
          </Link>

          <ProjectBlocks blocks={project.blocks} project={project} />

          {relevantTracks.length > 0 && (
            <section id="case-study-process" className="mt-10 scroll-mt-24 border-t border-hairline pt-10">
              <h3 className="type-subheading mb-4">How I approached it</h3>
              <ProcessTabs processTracks={relevantTracks} />
            </section>
          )}

          {next && next.slug !== slug && (
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
              <div>
                <p className="type-label">Next case study</p>
                <p className="text-[15px] font-semibold text-ink-em">{next.name}</p>
              </div>
              <Button href={`/projects/${next.slug}`} variant="outline">
                Next
                <ArrowRight size={14} />
              </Button>
            </div>
          )}
        </div>

        <CaseStudyToc items={tocItems} />
      </div>
    </PageContainer>
  );
}
