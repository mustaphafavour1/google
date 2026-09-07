import { redirect } from "next/navigation";

export default function SkillsPage() {
  redirect("/process?tab=skills");
}
