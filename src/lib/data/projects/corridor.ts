import type { Project } from "@/lib/types";

export const corridor: Project = {
  _id: "project-corridor",
  slug: "corridor",
  name: "Corridor",
  oneLiner: "Payout orchestration for cross-border money movement — one routing layer over many rails.",
  industry: "Fintech",
  tags: ["Fintech", "Payments", "Cross-border", "Compliance"],
  projectType: "Dashboard",
  year: 2025,
  role: "Product design · design system",
  techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Apache ECharts", "shadcn/ui", "Parkinsans"],
  links: [],
  scale: [
    { value: "12", label: "Pages designed" },
    { value: "6", label: "Core entities" },
    { value: "4", label: "Roles modeled" },
  ],
  valueImpact: {
    label: "Annual cross-border payout volume modeled across corridors",
    amount: 42_000_000,
    estimated: true,
  },
  accent: { primary: "#5C6B47", secondary: "#C08A6E" },
  processDisciplines: ["UI/UX", "Web Development"],
  showOnPortfolio: true,
  blocks: [
    {
      _type: "hero",
      _key: "corridor-hero",
      eyebrow: "Fintech · Cross-border payments",
      heading: "Corridor",
      body:
        "A payout orchestration console for moving money across borders — one place to route, monitor, and reconcile payouts across a growing stack of banking and payment rails.",
    },
    {
      _type: "richText",
      _key: "corridor-problem",
      heading: "The problem",
      format: "prose",
      paragraphs: [
        "Paying people across borders means stitching together bank rails, card networks, and local payout partners that all fail differently, settle on different timelines, and price FX differently. Finance and ops teams end up managing that complexity by hand, in spreadsheets, per corridor.",
        "The console needed to make routing decisions legible — why a payout took the path it did, what it cost, and where it's stuck — without requiring the person watching it to understand the underlying rail topology.",
      ],
    },
    {
      _type: "metricsRow",
      _key: "corridor-metrics",
      heading: "Scope at a glance",
      metrics: [
        { label: "Pages designed", value: "12" },
        { label: "Core entities", value: "6" },
        { label: "Roles modeled", value: "4" },
        { label: "Year", value: "2025" },
      ],
    },
    {
      _type: "chart",
      _key: "corridor-chart",
      heading: "Modeled payout volume by month",
      caption: "Illustrative volume curve used to pressure-test the dashboard's density at scale",
      chartType: "line",
      data: [
        { label: "Jan", value: 2.1 },
        { label: "Feb", value: 2.4 },
        { label: "Mar", value: 2.6 },
        { label: "Apr", value: 2.9 },
        { label: "May", value: 3.1 },
        { label: "Jun", value: 3.4 },
        { label: "Jul", value: 3.3 },
        { label: "Aug", value: 3.7 },
        { label: "Sep", value: 3.9 },
        { label: "Oct", value: 4.1 },
        { label: "Nov", value: 4.4 },
        { label: "Dec", value: 4.8 },
      ],
    },
    {
      _type: "sideBySideCards",
      _key: "corridor-focus",
      heading: "Design decisions that carried the console",
      cards: [
        {
          title: "Routing shown as a path, not a table row",
          body: "Each payout's rail path renders as a small visual route — origin, intermediary, destination — so a stuck payout is obvious at a glance instead of buried in status text.",
        },
        {
          title: "FX and fees stated, never implied",
          body: "Every amount shows source currency, destination currency, the rate applied, and the fee stack broken out — because in cross-border payments, the number that matters is never just the headline amount.",
        },
        {
          title: "One dark-first surface",
          body: "Built dark-first rather than adapting a light dashboard, since this console runs on an ops floor for long stretches — the dirty-green / rose-gold palette and Parkinsans type were chosen for that context specifically.",
        },
      ],
    },
    {
      _type: "processTimeline",
      _key: "corridor-process",
      heading: "How the design rolled out",
      phases: [
        {
          label: "Rail & corridor audit",
          description: "Mapped the existing rails, partners, and manual reconciliation habits before designing anything, so the console modeled how payouts actually move today.",
        },
        {
          label: "Routing visualization",
          description: "Prototyped the path-based payout view first, since legible routing was the hardest and highest-value problem in the console.",
        },
        {
          label: "Compliance & audit surfaces",
          description: "Layered in compliance case review and audit trails once the core routing and monitoring flows were validated.",
        },
        {
          label: "Dark-first visual system",
          description: "Built the full dirty-green / rose-gold surface and component set last, once the information architecture was settled.",
        },
      ],
    },
    {
      _type: "quote",
      _key: "corridor-quote",
      quote: "You can finally see why a payout took the route it took — that used to take three people and a support ticket.",
      attribution: "Sample ops-team feedback",
      role: "Illustrative — for case-study demonstration",
    },
  ],
};
