import type { Metadata } from "next";
import { Parkinsans, JetBrains_Mono, Caveat } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/shell/app-shell";
import { getSiteSettings } from "@/lib/content";
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

export const metadata: Metadata = {
  title: "Favour Mustapha — Product Designer",
  description:
    "Product designer working across fintech, health-tech, and B2B SaaS. Portfolio featuring Caretrace, Corridor, and Switchboard.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const siteSettings = await getSiteSettings();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${parkinsans.variable} ${jetbrainsMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AppShell siteSettings={siteSettings}>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
