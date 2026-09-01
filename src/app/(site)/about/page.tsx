import type { LucideIcon } from "lucide-react";
import { GraduationCap, MapPin, Rocket, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/shell/page-container";
import { PageHeader } from "@/components/shell/page-header";
import { DoodleCircle } from "@/components/doodles/doodle-circle";
import { getSiteSettings } from "@/lib/content";
import { AboutTabs } from "./about-tabs";

const quickFacts: { icon: LucideIcon; label: string; value: string }[] = [
  { icon: MapPin, label: "Based in", value: "Lagos, Nigeria" },
  { icon: GraduationCap, label: "Background", value: "Mechatronics Engineering" },
  { icon: Rocket, label: "Founder", value: "Stampdx" },
  { icon: Sparkles, label: "Experience", value: "7 years" },
];

export default async function AboutPage() {
  const { about } = await getSiteSettings();

  return (
    <PageContainer>
      <PageHeader
        title="About"
        subtitle="A bit about how I think as a designer, and a bit about everything else."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <AboutTabs about={about} />

        <aside className="card h-fit p-5">
          <h3 className="type-subheading mb-4">Quick facts</h3>
          <ul className="flex flex-col gap-4">
            {quickFacts.map((fact) => (
              <li key={fact.label} className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-tint text-primary-tint-text">
                  <fact.icon size={15} />
                </span>
                <span>
                  <p className="type-label">{fact.label}</p>
                  <p className="relative inline-block text-[13px] font-medium text-ink-strong">
                    {fact.value}
                    {fact.label === "Experience" && (
                      <DoodleCircle className="pointer-events-none absolute -inset-x-2.5 -inset-y-1.5 text-highlight-teal" />
                    )}
                  </p>
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </PageContainer>
  );
}
