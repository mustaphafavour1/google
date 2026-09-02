import { PageContainer } from "@/components/shell/page-container";
import { PageHeader } from "@/components/shell/page-header";
import { getProjects, getSiteSettings } from "@/lib/content";
import { buildGalleryItems } from "@/lib/gallery";
import { GalleryGrid } from "./gallery-grid";

export default async function GalleryPage() {
  const [projects, siteSettings] = await Promise.all([getProjects(), getSiteSettings()]);
  const items = buildGalleryItems(projects, siteSettings.profileMedia);

  return (
    <PageContainer>
      <PageHeader
        title="Gallery"
        subtitle="Every screen, shot, and clip across the work — and a few personal moments too."
      />
      <GalleryGrid items={items} />
    </PageContainer>
  );
}
