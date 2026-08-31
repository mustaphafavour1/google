import { Images } from "lucide-react";
import { SectionPreview } from "@/components/shell/section-preview";

export default function GalleryPage() {
  return (
    <SectionPreview
      icon={Images}
      title="Gallery"
      description="A visual wall of screens and moments across every project — landing here soon."
      eta="Coming later this build"
    />
  );
}
