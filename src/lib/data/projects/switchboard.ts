import type { Project } from "@/lib/types";

export const switchboard: Project = {
  _id: "project-switchboard",
  slug: "switchboard",
  name: "Switchboard",
  oneLiner:
    "A control plane for teams running multiple AI providers — compare, route, and govern spend from one console.",
  industry: "Enterprise / AI tooling",
  tags: ["AI tooling", "Enterprise", "Developer tools", "FinOps"],
  projectType: "Dashboard",
  year: 2026,
  role: "Product design & front-end build",
  techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Space Grotesk", "Inter", "Nivo"],
  scale: { pages: 12, entities: 6, roles: 4 },
  valueImpact: {
    label: "Annual AI infrastructure spend modeled under routing & cost controls",
    amount: 3_200_000,
    estimated: true,
  },
  accent: { primary: "#6366F1", secondary: "#8B5CF6" },
  blocks: [
    {
      _type: "hero",
      _key: "switchboard-hero",
      eyebrow: "Enterprise · AI provider management",
      heading: "Switchboard",
      body:
        "A console for engineering teams juggling multiple AI providers — compare models, set routing and fallback rules, and keep cost and access under control from one place.",
    },
    {
      _type: "metricsRow",
      _key: "switchboard-metrics",
      heading: "Scope at a glance",
      metrics: [
        { label: "Pages designed", value: "12" },
        { label: "Core entities", value: "6" },
        { label: "Roles modeled", value: "4" },
        { label: "Year", value: "2026" },
      ],
    },
    {
      _type: "sideBySideCards",
      _key: "switchboard-focus",
      heading: "Where the design focused",
      cards: [
        {
          title: "Comparison as the anchor screen",
          body: "Provider Comparison sits at the center of the IA — cost, latency, and capability side-by-side — because that's the decision the console exists to support.",
        },
        {
          title: "Routing rules as configuration, not code",
          body: "Fallback and routing logic is built as a visual rule builder, so a lead developer can change provider priority without a deploy.",
        },
        {
          title: "Cost as a first-class surface",
          body: "Usage and spend get their own analytics view rather than living as a buried tab, since runaway AI cost is the failure mode this console exists to prevent.",
        },
      ],
    },
    {
      _type: "richText",
      _key: "switchboard-coverage",
      heading: "What the console covers",
      format: "bullets",
      bullets: [
        "Provider Catalog — every connected provider and model, with capability and pricing metadata",
        "Products & Routing — which product surfaces route to which provider, with fallback chains",
        "Access & Audit — who can change routing or spend limits, and a full change history",
        "Cost & Usage — spend and token usage broken down by provider, product, and team",
        "Uptime & Availability — live status per provider, so a routing decision can account for it",
      ],
    },
    {
      _type: "chart",
      _key: "switchboard-chart",
      heading: "Modeled request mix by provider",
      caption: "Illustrative traffic split used to design the comparison and routing views",
      chartType: "pie",
      data: [
        { id: "Provider A", label: "Provider A", value: 42 },
        { id: "Provider B", label: "Provider B", value: 27 },
        { id: "Provider C", label: "Provider C", value: 18 },
        { id: "Provider D", label: "Provider D", value: 13 },
      ],
    },
    {
      _type: "imageGallery",
      _key: "switchboard-gallery",
      heading: "Selected screens",
      images: [
        { caption: "Overview dashboard — spend, uptime, and routing health at a glance", aspect: "wide" },
        { caption: "Provider Comparison — cost, latency, and capability side-by-side", aspect: "square" },
        { caption: "Routing rule builder — visual fallback chains", aspect: "wide" },
      ],
    },
    {
      _type: "quote",
      _key: "switchboard-quote",
      quote: "We stopped finding out about a provider outage from our own customers.",
      attribution: "Sample engineering-team feedback",
      role: "Illustrative — for case-study demonstration",
    },
  ],
};
