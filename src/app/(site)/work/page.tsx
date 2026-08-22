import { PageContainer } from "@/components/shell/page-container";
import { getProjects } from "@/lib/content";
import { WorkIndexClient } from "./work-index-client";

export default async function WorkIndexPage() {
  const projects = await getProjects();

  return (
    <PageContainer>
      <WorkIndexClient projects={projects} />
    </PageContainer>
  );
}
