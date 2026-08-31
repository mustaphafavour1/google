"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { Project, SiteSettings } from "@/lib/types";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { LandingNavbar } from "./landing-navbar";
import { MobileHeader } from "./mobile-header";
import { BottomTabBar } from "./bottom-tab-bar";
import { CommandPalette } from "./command-palette";
import { BackgroundPattern } from "./background-pattern";
import { PrivacyBanner } from "./privacy-banner";
import { RocketTrailCanvas } from "./rocket-trail-canvas";
import { ChatWidget } from "@/components/chat/chat-widget";

export function AppShell({
  siteSettings,
  projects,
  children,
}: {
  siteSettings: SiteSettings;
  projects: Project[];
  children: ReactNode;
}) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const pathname = usePathname();
  const isOverview = pathname === "/";

  useEffect(() => {
    fetch("/api/visit", { method: "POST" }).catch(() => {
      // Anonymous ping only — a failed request has no effect on the visitor.
    });
  }, []);

  return (
    <div className="flex min-h-screen">
      <BackgroundPattern />
      <RocketTrailCanvas />
      <Sidebar profile={siteSettings.profile} />
      <div className="flex min-w-0 flex-1 flex-col">
        {isOverview ? (
          <LandingNavbar resumeUrl={siteSettings.contact.resumeUrl} />
        ) : (
          <TopBar resumeUrl={siteSettings.contact.resumeUrl} onOpenPalette={() => setPaletteOpen(true)} />
        )}
        <MobileHeader />
        <main className="flex-1 pb-24 lg:pb-0">{children}</main>
      </div>
      <BottomTabBar contact={siteSettings.contact} />
      <CommandPalette projects={projects} open={paletteOpen} onOpenChange={setPaletteOpen} />
      <PrivacyBanner />
      <ChatWidget siteSettings={siteSettings} projects={projects} />
    </div>
  );
}
