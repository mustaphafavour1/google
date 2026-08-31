import type { JobApplicationVariant } from "@/lib/types";
import { caretrace, corridor, switchboard } from "./projects";

export const jobApplications: JobApplicationVariant[] = [
  {
    _id: "jobapp-example",
    companyName: "Acme",
    slug: "acme",
    roleTitle: "Senior Product Designer",
    introNote:
      "I build dashboards and product systems the way Acme ships — fast, opinionated, and grounded in a real design system rather than one-off screens. These three case studies show that same discipline across fintech, health-tech, and enterprise tooling.",
    selectedProjects: [caretrace, corridor, switchboard],
  },
];

export function getJobApplicationBySlug(slug: string): JobApplicationVariant | undefined {
  return jobApplications.find((variant) => variant.slug === slug);
}
