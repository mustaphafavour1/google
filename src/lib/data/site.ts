export const profile = {
  name: "Favour Mustapha",
  firstName: "Favour",
  title: "Product Designer",
  location: "Lagos, Nigeria",
  tagline: "I design and build dashboards and product systems for fintech, health-tech, and B2B SaaS teams.",
  founderNote: "Founder, FlutterBytes",
};

/**
 * Metrics marked `isPlaceholder` are example values — swap them for the real
 * numbers directly in this file (or in the Sanity Studio, once wired up).
 * `yearsExperience` is the one confirmed figure.
 */
export const siteMetrics = [
  { key: "projects", label: "Projects delivered", value: "60+", isPlaceholder: true },
  { key: "years", label: "Years of experience", value: "7", isPlaceholder: false },
  { key: "countries", label: "Countries reached", value: "14+", isPlaceholder: true },
  { key: "brands", label: "Brands worked with", value: "25+", isPlaceholder: true },
];

export const about = {
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
      "I'm also the founder of FlutterBytes, where I take on product design and front-end build work end to end.",
    ],
  },
};

export const contact = {
  email: "mustaphafavour1@gmail.com",
  resumeHref: "/resume.pdf",
  website: { label: "headfavour.com", href: "https://headfavour.com" },
  socials: [
    { label: "LinkedIn", href: "#", placeholder: true },
    { label: "GitHub", href: "#", placeholder: true },
    { label: "Dribbble", href: "#", placeholder: true },
    { label: "X (Twitter)", href: "#", placeholder: true },
  ],
};
