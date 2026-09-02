import { ArrowUpRight, Download, Globe, Mail } from "lucide-react";
import { PageContainer } from "@/components/shell/page-container";
import { initials } from "@/components/shell/logo";
import { ResumeGateButton } from "@/components/resume/resume-gate-button";
import { ThumbnailImage } from "@/components/ui/thumbnail-image";
import { getSiteSettings } from "@/lib/content";
import { AboutTabs } from "./about-tabs";
import { ProfileMediaRail } from "./profile-media-rail";

export default async function ProfilePage() {
  const siteSettings = await getSiteSettings();
  const { profile, contact, hobbies, about, profileMedia } = siteSettings;

  return (
    <PageContainer>
      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="min-w-0 flex-1 lg:max-w-2xl">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-tint text-[20px] font-semibold text-primary-tint-text">
              {initials(profile.name)}
            </span>
            <div>
              <h1 className="type-display">{profile.name}</h1>
              <p className="type-body mt-1 text-ink-muted">
                {profile.title} · {profile.location}
              </p>
            </div>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2">
            <div className="card p-6">
              <p className="type-eyebrow mb-4">Contact</p>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2.5 text-[14px] font-medium text-ink-strong transition-colors hover:text-primary-500"
              >
                <Mail size={16} className="shrink-0 text-ink-soft" />
                {contact.email}
              </a>
              <a
                href={contact.website.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center gap-2.5 text-[14px] font-medium text-ink-strong transition-colors hover:text-primary-500"
              >
                <Globe size={16} className="shrink-0 text-ink-soft" />
                {contact.website.label}
              </a>

              <div className="mt-5 flex flex-wrap gap-2.5 border-t border-hairline pt-5">
                {contact.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[12.5px] font-medium text-ink-strong transition-colors hover:bg-surface-muted"
                  >
                    {social.label}
                    <ArrowUpRight size={12} />
                  </a>
                ))}
              </div>
            </div>

            <div className="card flex flex-col justify-between p-6">
              <div>
                <p className="type-eyebrow mb-2">Resume</p>
                <p className="type-body text-ink-muted">
                  The full story — roles, projects, and the shape of 7 years in product design.
                </p>
              </div>
              {contact.resumeUrl ? (
                <ResumeGateButton className="mt-5 inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-primary-500 text-[13px] font-medium text-white transition-colors hover:bg-primary-600">
                  <Download size={14} />
                  Download resume
                </ResumeGateButton>
              ) : (
                <p className="type-meta mt-5">Not uploaded yet — check back soon.</p>
              )}
            </div>
          </div>

          <section className="mt-9">
            <p className="type-eyebrow mb-4">Outside the design system</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {hobbies.map((hobby) => (
                <div key={hobby.label} className="card flex items-start gap-3.5 p-5">
                  {hobby.image && (
                    <ThumbnailImage src={hobby.image} alt={hobby.label} className="h-14 w-14" />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-handwriting text-[22px] leading-none text-primary-500">
                      {hobby.label}
                    </h3>
                    {hobby.note && <p className="type-body mt-2 text-ink-muted">{hobby.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="about" className="mt-9 scroll-mt-24 border-t border-hairline pt-9">
            <p className="type-eyebrow mb-4">About</p>
            <AboutTabs about={about} />
          </section>
        </div>

        <aside className="w-full shrink-0 lg:w-[26rem]">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <ProfileMediaRail items={profileMedia} />
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
