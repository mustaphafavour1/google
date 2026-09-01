"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

export function AboutTabs({ about }: { about: SiteSettings["about"] }) {
  const hasGeneral = about.general.paragraphs.length > 0;

  if (!hasGeneral) {
    return <AboutSection heading={about.design.heading} paragraphs={about.design.paragraphs} />;
  }

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
      <h3 className="type-subheading mb-4">{heading}</h3>
      <div className="flex flex-col rounded-2xl border border-hairline bg-surface-muted px-6 sm:px-8">
        {paragraphs.map((paragraph, i) => (
          <p
            key={i}
            className={cn(
              "type-body max-w-2xl py-6 first:pt-6 last:pb-6",
              i > 0 && "border-t border-hairline",
            )}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
