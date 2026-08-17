"use client";

import type { LucideIcon } from "lucide-react";
import { GraduationCap, MapPin, Rocket, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/shell/page-container";
import { PageHeader } from "@/components/shell/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { about } from "@/lib/data/site";

const quickFacts: { icon: LucideIcon; label: string; value: string }[] = [
  { icon: MapPin, label: "Based in", value: "Lagos, Nigeria" },
  { icon: GraduationCap, label: "Background", value: "Mechatronics Engineering" },
  { icon: Rocket, label: "Founder", value: "FlutterBytes" },
  { icon: Sparkles, label: "Experience", value: "7 years" },
];

export default function AboutPage() {
  return (
    <PageContainer>
      <PageHeader
        title="About"
        subtitle="A bit about how I think as a designer, and a bit about everything else."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <Tabs defaultValue="design">
          <TabsList>
            <TabsTrigger value="design">Design-related</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="mt-6">
            <AboutSection heading={about.design.heading} paragraphs={about.design.paragraphs} />
          </TabsContent>
          <TabsContent value="general" className="mt-6">
            <AboutSection heading={about.general.heading} paragraphs={about.general.paragraphs} />
          </TabsContent>
        </Tabs>

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
                  <p className="text-[13px] font-medium text-ink-strong">{fact.value}</p>
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </PageContainer>
  );
}

function AboutSection({ heading, paragraphs }: { heading: string; paragraphs: string[] }) {
  return (
    <div>
      <h3 className="type-subheading mb-3">{heading}</h3>
      <div className="max-w-2xl space-y-3">
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="type-body">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
