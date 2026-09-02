import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageContainer } from "@/components/shell/page-container";
import { ProjectBlocks } from "@/components/blocks/block-renderer";
import { ProcessTabs } from "@/components/process/process-tabs";
import { Button } from "@/components/ui/button";
import { getProjectBySlug, getProjects, getProcessTracks, getSiteSettings } from "@/lib/content";
import { buildChatModes } from "@/lib/chatbot-content";
import { CaseStudyToc } from "./case-study-toc";
import { CaseStudyMiniMetrics } from "./case-study-mini-metrics";
import { FaveAiMini } from "./faveai-mini";
import { ProjectHeader } from "./project-header";
import { CaseStudyFooter } from "@/components/case-study/case-study-footer";
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

function buildTocItems(blocks: ProjectBlock[]): { id: string; label: string }[] {
  const items: { id: string; label: string }[] = [];
  const firstBreakIndex = blocks.findIndex((block) => block._type === "sectionBreak");

  if (blocks.length > 0 && firstBreakIndex !== 0) {
    items.push({ id: blocks[0]._key, label: "Overview" });
  }

  for (const block of blocks) {
    if (block._type === "sectionBreak") {
      items.push({ id: block._key, label: block.title });
    }
  }

  return items;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, projects, processTracks, siteSettings] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
    getProcessTracks(),
    getSiteSettings(),
  ]);
  if (!project) notFound();

  const faveAiConfig = buildChatModes(siteSettings, projects).designer;

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const next = projects[(currentIndex + 1) % projects.length];

  const tocItems = buildTocItems(project.blocks);
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

          <ProjectHeader project={project} />

          <ProjectBlocks blocks={project.blocks} project={project} />

          {relevantTracks.length > 0 && (
            <section id="case-study-process" className="mt-10 scroll-mt-24 border-t border-hairline pt-10">
              <h3 className="type-subheading mb-4">How I approached it</h3>
              <ProcessTabs processTracks={relevantTracks} />
            </section>
          )}

          <CaseStudyFooter slug={project.slug} projectName={project.name} />

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

        <aside className="sticky top-[calc(var(--header-h)+1.5rem)] hidden h-max max-h-[calc(100vh-var(--header-h)-3rem)] w-52 shrink-0 flex-col gap-6 overflow-y-auto xl:flex">
          <CaseStudyToc items={tocItems} />
          <CaseStudyMiniMetrics project={project} />
          <FaveAiMini mode="designer" config={faveAiConfig} fallbackEmail={siteSettings.contact.email} />
        </aside>
      </div>
    </PageContainer>
  );
}
