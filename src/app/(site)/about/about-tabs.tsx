"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { SiteSettings } from "@/lib/types";

export function AboutTabs({ about }: { about: SiteSettings["about"] }) {
  return (
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
