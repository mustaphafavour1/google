import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/shell/page-container";
import { ProjectBlocks } from "@/components/blocks/block-renderer";
import { ProcessTabs } from "@/components/process/process-tabs";
import { ProjectCard } from "@/components/cards/project-card";
import { getProjectBySlug, getProjects, getProcessTracks, getSiteSettings } from "@/lib/content";
import { buildChatModes } from "@/lib/chatbot-content";
import { CaseStudyToc } from "./case-study-toc";
import { CaseStudyMiniMetrics } from "./case-study-mini-metrics";
import { AutoScrollControl } from "./auto-scroll-control";
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
  const previous = projects[(currentIndex - 1 + projects.length) % projects.length];
  const next = projects[(currentIndex + 1) % projects.length];
  const moreCaseStudies = [previous, next].filter(
    (p, i, arr) => p.slug !== slug && arr.findIndex((x) => x.slug === p.slug) === i,
  );

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

          {moreCaseStudies.length > 0 && (
            <div className="mt-12 border-t border-hairline pt-6">
              <p className="type-label mb-3">More case studies</p>
              <div className="grid grid-cols-2 gap-3">
                {moreCaseStudies.map((p) => (
                  <div key={p.slug} className="h-40 sm:h-[180px]">
                    <ProjectCard project={p} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="sticky top-[calc(var(--header-h)+1.5rem)] hidden h-max max-h-[calc(100vh-var(--header-h)-3rem)] w-52 shrink-0 flex-col gap-6 overflow-y-auto xl:flex">
          <CaseStudyToc items={tocItems} />
          <CaseStudyMiniMetrics project={project} />
          <AutoScrollControl />
          <FaveAiMini mode="designer" config={faveAiConfig} fallbackEmail={siteSettings.contact.email} />
        </aside>
      </div>
    </PageContainer>
  );
}
