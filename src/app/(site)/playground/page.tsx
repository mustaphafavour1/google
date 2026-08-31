import { Rocket } from "lucide-react";
import { SectionPreview } from "@/components/shell/section-preview";

export default function PlaygroundPage() {
  return (
    <SectionPreview
      icon={Rocket}
      title="Playground"
      description="Assemble a rocket, snap the pieces together, and unlock a resume drop — landing in Phase 4."
      eta="Coming in Phase 4"
    />
  );
}
