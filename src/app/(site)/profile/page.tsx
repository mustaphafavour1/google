import { User } from "lucide-react";
import { SectionPreview } from "@/components/shell/section-preview";

export default function ProfilePage() {
  return (
    <SectionPreview
      icon={User}
      title="Profile"
      description="Contacts, resume download, and hobbies — the Profile Hub is coming in Phase 4. In the meantime, About and Contact are still live."
      eta="Coming in Phase 4"
    />
  );
}
