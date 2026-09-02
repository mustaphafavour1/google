import type { Project } from "@/lib/types";
import { bulletItem } from "@/lib/data/portable-text";

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
  links: [],
  scale: [
    { value: "12", label: "Pages designed" },
    { value: "6", label: "Core entities" },
    { value: "4", label: "Roles modeled" },
  ],
  valueImpact: {
    label: "Annual AI infrastructure spend modeled under routing & cost controls",
    amount: 3_200_000,
    estimated: true,
  },
  accent: { primary: "#6366F1", secondary: "#8B5CF6" },
  processDisciplines: ["UI/UX", "Web Development"],
  showOnPortfolio: true,
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
      content: [
        bulletItem("Provider Catalog — every connected provider and model, with capability and pricing metadata"),
        bulletItem("Products & Routing — which product surfaces route to which provider, with fallback chains"),
        bulletItem("Access & Audit — who can change routing or spend limits, and a full change history"),
        bulletItem("Cost & Usage — spend and token usage broken down by provider, product, and team"),
        bulletItem("Uptime & Availability — live status per provider, so a routing decision can account for it"),
      ],
    },
    {
      _type: "chart",
      _key: "switchboard-chart",
      heading: "Modeled request mix by provider",
      caption: "Illustrative traffic split used to design the comparison and routing views",
      chartType: "pie",
      data: [
        { label: "Provider A", value: 42 },
        { label: "Provider B", value: 27 },
        { label: "Provider C", value: 18 },
        { label: "Provider D", value: 13 },
      ],
    },
    {
      _type: "fullBleedImage",
      _key: "switchboard-fullbleed",
      caption: "The Overview dashboard — spend, uptime, and routing health at a glance",
      aspect: "ultrawide",
    },
    {
      _type: "textGrid",
      _key: "switchboard-textgrid",
      heading: "Why the IA holds up under scale",
      columns: 2,
      items: [
        {
          title: "One console, one mental model",
          body: "Provider, product, and routing all reference the same underlying entities, so a team never has to reconcile numbers between screens.",
        },
        {
          title: "Built for the on-call path",
          body: "Uptime and routing health are one click from anywhere in the console — the screens most needed during an incident are the least buried.",
        },
        {
          title: "Spend limits as guardrails",
          body: "Budget controls attach to routing rules directly, so cost governance is part of the configuration, not a separate audit step.",
        },
        {
          title: "Designed to add a 5th provider",
          body: "The comparison and routing views were stress-tested against adding new providers without a layout change — this is infrastructure, not a one-off screen.",
        },
      ],
    },
    {
      _type: "imageGrid",
      _key: "switchboard-imagegrid",
      heading: "Comparison & routing screens",
      items: [
        { caption: "Provider Comparison — cost, latency, and capability side-by-side", span: 2 },
        { caption: "Routing rule builder — visual fallback chains" },
        { caption: "Spend limits attached to a routing rule" },
      ],
    },
    {
      _type: "video",
      _key: "switchboard-video",
      heading: "Routing rule builder — walkthrough",
      caption: "A 90-second walkthrough of setting a fallback chain with a spend guardrail.",
      duration: "1:32",
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
    {
      _type: "pipLinkPreview",
      _key: "switchboard-pip",
      title: "Switchboard — interactive prototype",
      description: "A clickable prototype of the routing rule builder and cost dashboard.",
      url: "https://headfavour.com/switchboard-prototype",
      linkLabel: "Open prototype",
    },
  ],
};
