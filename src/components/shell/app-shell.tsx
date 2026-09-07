"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { BackgroundPattern as BackgroundPatternT, Project, SiteSettings } from "@/lib/types";
import type { SearchIndex } from "@/lib/search-index";
import { Sidebar } from "./sidebar";
import { BackButton } from "./back-button";
import { FloatingUtilityBar } from "./floating-utility-bar";
import { MobileHeader } from "./mobile-header";
import { PageTransition } from "./page-transition";
import { BottomTabBar } from "./bottom-tab-bar";
import { CommandPalette } from "./command-palette";
import { BackgroundPattern } from "./background-pattern";
import { PrivacyBanner } from "./privacy-banner";
import { RocketTrailCanvas } from "./rocket-trail-canvas";
import { ChatWidget } from "@/components/chat/chat-widget";
import { ContactFormProvider } from "@/components/contact/contact-form-context";
import { ContactFormModal } from "@/components/contact/contact-form-modal";

export function AppShell({
  siteSettings,
  projects,
  backgroundPatterns,
  searchIndex,
  children,
}: {
  siteSettings: SiteSettings;
  projects: Project[];
  backgroundPatterns: BackgroundPatternT[];
  searchIndex: SearchIndex;
  children: ReactNode;
}) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    fetch("/api/visit", { method: "POST" }).catch(() => {
      // Anonymous ping only — a failed request has no effect on the visitor.
    });
  }, []);

  return (
    <ContactFormProvider>
      <div className="flex min-h-screen">
        <BackgroundPattern patterns={backgroundPatterns} />
        <RocketTrailCanvas />
        <Sidebar profile={siteSettings.profile} profileMedia={siteSettings.profileMedia} />
        <BackButton
          showLabel
          className="fixed left-[5.5rem] top-4 z-30 hidden bg-surface/95 shadow-[0_4px_16px_rgb(35_25_15_/_0.08)] backdrop-blur lg:flex"
        />
        <FloatingUtilityBar projects={projects} siteSettings={siteSettings} searchIndex={searchIndex} />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileHeader />
          <main className="flex-1 pb-24 lg:pb-0">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
        <BottomTabBar contact={siteSettings.contact} />
        <CommandPalette
          projects={projects}
          searchIndex={searchIndex}
          open={paletteOpen}
          onOpenChange={setPaletteOpen}
        />
        <PrivacyBanner />
        <ChatWidget siteSettings={siteSettings} projects={projects} />
        <ContactFormModal />
      </div>
    </ContactFormProvider>
  );
}
