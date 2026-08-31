import type { Project } from "@/lib/types";

export const caretrace: Project = {
  _id: "project-caretrace",
  slug: "caretrace",
  name: "Caretrace",
  oneLiner:
    "Operations platform that keeps home-care agencies, caregivers, and patients in sync in real time.",
  industry: "Health-tech",
  tags: ["Health-tech", "Operations", "Scheduling", "Compliance"],
  projectType: "Dashboard",
  year: 2025,
  role: "Product design & front-end build",
  techStack: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Nivo", "Alan Sans"],
  scale: { pages: 12, entities: 7, roles: 4 },
  valueImpact: {
    label: "Annual billable visit revenue modeled in the scheduling & billing flow",
    amount: 9_600_000,
    estimated: true,
  },
  accent: { primary: "#0F9488", secondary: "#EC4899" },
  processDisciplines: ["UI/UX", "Web Development"],
  blocks: [
    {
      _type: "hero",
      _key: "caretrace-hero",
      eyebrow: "Health-tech · Home-care operations",
      heading: "Caretrace",
      body:
        "A day-to-day operations platform for home-care agencies — scheduling, visit verification, care plans, and billing in one system instead of five disconnected tools.",
    },
    {
      _type: "metricsRow",
      _key: "caretrace-metrics",
      heading: "Scope at a glance",
      metrics: [
        { label: "Pages designed", value: "12" },
        { label: "Core entities", value: "7" },
        { label: "Roles modeled", value: "4" },
        { label: "Year", value: "2025" },
      ],
    },
    {
      _type: "richText",
      _key: "caretrace-problem",
      heading: "The problem",
      format: "prose",
      paragraphs: [
        "Home-care agencies run a mobile workforce — caregivers visiting patients in their homes — but coordinate it with phone trees, paper timesheets, and spreadsheets. Missed visits, unverifiable hours, and billing disputes follow directly from that.",
        "Compliance made it harder before it made it easier: electronic visit verification became a requirement in many regions, but most agencies bolted on a separate EVV tool rather than folding verification into the workflow caregivers and schedulers already used.",
      ],
    },
    {
      _type: "sideBySideCards",
      _key: "caretrace-focus",
      heading: "Where the design focused",
      cards: [
        {
          title: "Scheduling that holds under change",
          body: "A visit calendar built around same-day reassignment — caregiver call-outs and patient reschedules are the norm, not the exception, so the UI treats them as first-class actions instead of edge cases.",
        },
        {
          title: "Verification without friction",
          body: "Visit check-in/check-out folds into the caregiver's existing flow instead of living in a separate app, so compliance data is captured as a side effect of doing the job, not an extra chore.",
        },
        {
          title: "Billing schedulers can trust",
          body: "Care plans, authorized hours, and logged visits reconcile automatically, so billing runs from data the scheduling team already believes — not a second, disconnected ledger.",
        },
      ],
    },
    {
      _type: "chart",
      _key: "caretrace-chart",
      heading: "Where the 7 core entities carry the workload",
      caption: "Screens referencing each entity across the 12-page build",
      chartType: "bar",
      data: [
        { label: "Visits", value: 9 },
        { label: "Caregivers", value: 7 },
        { label: "Patients", value: 6 },
        { label: "Care Plans", value: 5 },
        { label: "Agencies", value: 4 },
        { label: "Invoices", value: 4 },
        { label: "Care Notes", value: 3 },
      ],
    },
    {
      _type: "imageGallery",
      _key: "caretrace-gallery",
      heading: "Selected screens",
      images: [
        { caption: "Caregiver day view — visit list with live check-in state", aspect: "wide" },
        { caption: "Patient profile — care plan, authorized hours, visit history", aspect: "square" },
        { caption: "Scheduler board — drag-to-reassign same-day coverage", aspect: "wide" },
      ],
    },
    {
      _type: "quote",
      _key: "caretrace-quote",
      quote:
        "Caretrace is the first system where our schedulers, caregivers, and billing team are all looking at the same truth.",
      attribution: "Sample agency-ops feedback",
      role: "Illustrative — for case-study demonstration",
    },
  ],
};
