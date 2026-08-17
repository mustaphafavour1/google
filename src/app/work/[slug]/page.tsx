import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageContainer } from "@/components/shell/page-container";
import { ProjectBlocks } from "@/components/blocks/block-renderer";
import { Button } from "@/components/ui/button";
import { projects, getProjectBySlug } from "@/lib/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.name} — Favour Mustapha`,
    description: project.oneLiner,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const next = projects[(currentIndex + 1) % projects.length];

  return (
    <PageContainer>
      <Link
        href="/work"
        className="mb-6 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-soft transition-colors hover:text-ink-strong"
      >
        <ArrowLeft size={13} />
        All work
      </Link>

      <ProjectBlocks blocks={project.blocks} project={project} />

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
        <div>
          <p className="type-label">Next case study</p>
          <p className="text-[15px] font-semibold text-ink-em">{next.name}</p>
        </div>
        <Button href={`/work/${next.slug}`} variant="outline">
          Next
          <ArrowRight size={14} />
        </Button>
      </div>
    </PageContainer>
  );
}
