import { Archive as ArchiveIcon } from "lucide-react";
import { SectionPreview } from "@/components/shell/section-preview";

export default function ArchivePage() {
  return (
    <SectionPreview
      icon={ArchiveIcon}
      title="Archive"
      description="Past portfolio versions — year, live URL, a snapshot, and what changed — pulled from Sanity soon."
      eta="Coming in Phase 3"
    />
  );
}
