import type { Metadata } from "next";
import { PageContainer } from "@/components/shell/page-container";
import { getProjects } from "@/lib/content";
import { ProjectsIndexClient } from "./projects-index-client";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsIndexPage() {
  const projects = await getProjects();

  return (
    <PageContainer>
      <ProjectsIndexClient projects={projects} />
    </PageContainer>
  );
}
