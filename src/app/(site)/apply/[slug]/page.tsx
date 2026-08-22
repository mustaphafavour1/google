import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Download, Mail, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/shell/page-container";
import { ProjectCard } from "@/components/cards/project-card";
import { Button } from "@/components/ui/button";
import { getJobApplicationVariant, getSiteSettings } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const variant = await getJobApplicationVariant(slug);
  if (!variant) return {};
  return {
    title: `For ${variant.companyName} — Favour Mustapha`,
    description: `A portfolio selection put together for ${variant.companyName}.`,
    robots: { index: false, follow: false },
  };
}

export default async function JobApplicationVariantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [variant, siteSettings] = await Promise.all([
    getJobApplicationVariant(slug),
    getSiteSettings(),
  ]);
  if (!variant) notFound();

  const { companyName, roleTitle, introNote, selectedProjects } = variant;
  const { contact } = siteSettings;

  return (
    <PageContainer offset={false}>
      <section className="pt-1">
        <p className="type-eyebrow">Tailored for {companyName}</p>
        <h1 className="type-display mt-2">How&rsquo;s {companyName} today?</h1>
        <p className="type-body mt-3 max-w-xl">
          {roleTitle
            ? `I put together a few things worth seeing for the ${roleTitle} role.`
            : "I put together a few things I think would be useful for your team."}
        </p>
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

      {introNote && (
        <section className="mt-9">
          <div className="card p-6 sm:p-8">
            <div className="mb-3 flex items-center gap-2 text-primary-500">
              <Sparkles size={16} />
              <h2 className="text-[15px] font-semibold text-ink-em">
                Unique contributions I can bring to {companyName}
              </h2>
            </div>
            <p className="type-body max-w-2xl text-ink-strong">{introNote}</p>
          </div>
        </section>
      )}

      <section className="mt-9">
        <h2 className="mb-4 text-[19px] font-semibold tracking-tight text-ink-em">
          Projects most relevant to {companyName}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {selectedProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="card flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="type-subheading">Let&rsquo;s talk</h3>
            <p className="type-body mt-1 text-ink-muted">
              Happy to walk {companyName} through any of this in more detail.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2.5">
            <Button variant="outline" asChild>
              <a href={`mailto:${contact.email}`}>
                <Mail size={14} />
                {contact.email}
              </a>
            </Button>
            <Button href="/work">Full portfolio</Button>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
