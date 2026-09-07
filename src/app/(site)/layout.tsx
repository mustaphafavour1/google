import type { Metadata } from "next";
import { Parkinsans, JetBrains_Mono, Caveat, Rancho } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/shell/app-shell";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import {
  getProjects,
  getSiteSettings,
  getBackgroundPatterns,
  getSkills,
  getSkillGroups,
  getDesignSuperpowers,
  getBlogPosts,
  getProducts,
} from "@/lib/content";
import { buildSkillEntries, buildSuperpowerEntries, buildBlogEntries, buildProductEntries } from "@/lib/search-index";
import type { ReactNode } from "react";
import "../globals.css";

const parkinsans = Parkinsans({
  variable: "--font-parkinsans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const rancho = Rancho({
  variable: "--font-rancho",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Favour Mustapha — Product Designer",
  description:
    "Product designer working across fintech, health-tech, and B2B SaaS. Portfolio featuring Caretrace, Corridor, and Switchboard.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [siteSettings, projects, backgroundPatterns, skills, skillGroups, superpowers, blogPosts, products] =
    await Promise.all([
      getSiteSettings(),
      getProjects(),
      getBackgroundPatterns(),
      getSkills(),
      getSkillGroups(),
      getDesignSuperpowers(),
      getBlogPosts(),
      getProducts(),
    ]);

  const searchIndex = {
    skills: buildSkillEntries(skills, skillGroups),
    superpowers: buildSuperpowerEntries(superpowers),
    blogPosts: buildBlogEntries(blogPosts),
    products: buildProductEntries(products),
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${parkinsans.variable} ${jetbrainsMono.variable} ${caveat.variable} ${rancho.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AnalyticsScripts />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <TooltipProvider delayDuration={200}>
            <AppShell
              siteSettings={siteSettings}
              projects={projects}
              backgroundPatterns={backgroundPatterns}
              searchIndex={searchIndex}
            >
              {children}
            </AppShell>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
