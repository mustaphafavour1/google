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
  landing: {
    hero: {
      title: "Sort Your Design Needs; Achieve Your Goals",
      titleUnderText: "without compromising on quality, speed or range.",
      subtitle:
        "I bring a rare synergy of Design Experience, Creativity, AI-development, Strategy, Global Range and Business Acumen to help you achieve your business or personal goals.",
      ctaPrimaryLabel: "Let's discuss",
      ctaSecondaryLabel: "See some proofs",
    },
    journeyMilestones: [
      { year: "2019", text: "I learnt graphic design to fill an unpaid role." },
      { year: "2020", text: "I transited into adding product design to my arsenal." },
      { year: "2021", text: "Did mostly graphic design." },
      { year: "2022", text: "Took on more UI/UX roles and gigs." },
      { year: "2023", text: "Helped a startup raise seed fund." },
      { year: "2024", text: "Skilled up further in product design." },
      { year: "2025", text: "July: dived deep into AI-development; built my first webapp." },
      { year: "2026", text: "Now extremely fluent in AI development — improved quality of output." },
    ],
    workingTogetherItems: [
      {
        discipline: "UI/UX",
        description:
          "End to end product design/building for mobile apps, dashboards, software etc. could take so long and have various stages, but I always ensure to make it a beautiful experience for all parties involved.",
      },
      {
        discipline: "Web Development",
        description:
          "Taking a product from design file to a live, working build could easily turn into a long back-and-forth between design and engineering, but I keep it one smooth, handoff-free process from start to finish.",
      },
      {
        discipline: "Branding",
        description:
          "Building an identity, from positioning to every asset that carries it, could take so long and involve endless rounds of revisions, but I always ensure it stays a clear, enjoyable process for everyone involved.",
      },
      {
        discipline: "Campaigns & Marketing",
        description:
          "Shipping a campaign across every format on a tight deadline could easily get chaotic, but I always ensure it stays organised and enjoyable for everyone involved, right up to launch.",
      },
    ],
  },
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
