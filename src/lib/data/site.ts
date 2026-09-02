import type { SiteSettings } from "@/lib/types";

/**
 * Fallback used until Site settings is populated in Sanity (see
 * src/sanity/schemaTypes/documents/siteSettings.ts). Metrics marked
 * `isPlaceholder` are example values — safe defaults, not facts.
 */
export const siteSettingsFallback: SiteSettings = {
  profile: {
    name: "Favour Mustapha",
    firstName: "Favour",
    title: "Product Designer",
    location: "Lagos, Nigeria",
    tagline:
      "I design and build dashboards and product systems for fintech, health-tech, and B2B SaaS teams.",
    founderNote: "Founder, Stampdx",
    brandTextRotation: [
      "Favour M.",
      "Welcome here",
      "How can I help?",
      "Let's Build something Amazing",
      "Let's get in touch",
      "Try the fun Section",
    ],
  },
  featuredProjects: [],
  profileMedia: [],
  siteMetrics: [
    { key: "projects", label: "Projects delivered", value: "60+", isPlaceholder: true },
    { key: "years", label: "Years of experience", value: "7", isPlaceholder: false },
    { key: "countries", label: "Countries reached", value: "14+", isPlaceholder: true },
    { key: "brands", label: "Brands worked with", value: "25+", isPlaceholder: true },
  ],
  about: {
    design: {
      heading: "How I think about design",
      paragraphs: [
        "I care more about hierarchy than decoration. Most of what makes an interface feel calm and trustworthy comes from type size, weight, and a disciplined grey scale — not from colour. Colour earns its place for brand moments and status, and nowhere else.",
        "I come at product design from an engineering background, which shows up as a bias for systems over one-off screens: tokens before components, components before pages. It's slower on day one and much faster by page twelve.",
        "The three case studies in this portfolio (Caretrace, Corridor, Switchboard) are all built on that same underlying discipline — different brand, different industry, same taste governing hierarchy, spacing, and restraint.",
      ],
    },
    general: {
      heading: "Outside the design system",
      paragraphs: [
        "I'm based in Lagos, Nigeria. My background is in Mechatronics Engineering, which is a slightly unconventional route into product design — but it's exactly why I default to thinking in systems, tolerances, and edge cases rather than starting from a blank canvas.",
        "Over the past 7 years I've worked across fintech, B2B SaaS, health-tech, and brand design — moving between dense operational tooling and the visual identity work that sits in front of it.",
        "I'm also the founder of Stampdx.",
      ],
    },
  },
  contact: {
    email: "mustaphafavour1@gmail.com",
    resumeUrl: "/resume.pdf",
    website: { label: "headfavour.com", href: "https://headfavour.com" },
    socials: [
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "Dribbble", href: "#" },
      { label: "X (Twitter)", href: "#" },
    ],
  },
  hobbies: [
    { label: "Building small tools", note: "Side projects under Stampdx, usually solving my own annoyance." },
    { label: "Reading sci-fi", note: "Anything that treats systems and infrastructure as characters." },
    { label: "Table Tennis", note: "Weekend pickup games — a decent counterweight to a screen-heavy week." },
    { label: "Tinkering with hardware", note: "A leftover habit from Mechatronics Engineering." },
  ],
  analyticsAggregate: {
    projectTypeBreakdown: [
      { type: "Dashboards", count: 14 },
      { type: "Apps", count: 11 },
      { type: "Websites", count: 16 },
      { type: "Branding", count: 12 },
      { type: "Campaigns", count: 9 },
    ],
    projectsOverTime: [
      { year: "2019", count: 4 },
      { year: "2020", count: 6 },
      { year: "2021", count: 7 },
      { year: "2022", count: 9 },
      { year: "2023", count: 10 },
      { year: "2024", count: 11 },
      { year: "2025", count: 9 },
      { year: "2026", count: 6 },
    ],
  },
};
