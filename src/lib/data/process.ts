import type { ProcessTrack } from "@/lib/types";

export const processTracks: ProcessTrack[] = [
  {
    _id: "process-overall",
    discipline: "Overall",
    summary: "Each type of design project has slightly different processes but overall, this is what they all look like.",
    phases: [
      { label: "Understand", description: "A discovery call comes first — I map the problem, research the context, and align on what the project is truly about before anything is designed." },
      { label: "Define", description: "I sharpen the brief into a clear proposal: deliverables, timeline, budget, and success criteria — all documented so we're fully aligned before work begins." },
      { label: "Explore", description: "I explore multiple directions quickly — concepts, user flows, wireframes — then share them early to get your perspective and course-correct if needed." },
      { label: "Refine", description: "The strongest direction moves forward. I blend business considerations and technical realities with design thinking, asking questions until the work is as strong as it can be." },
      { label: "Progress", description: "I share regular updates — what's done, what's in progress, what's next — so you're never left wondering and we stay aligned throughout." },
      { label: "Deliver", description: "Once you've confirmed the work is complete and satisfactory, I package everything needed for handoff — and stay available in case anything else comes up." },
    ],
  },
  {
    _id: "process-ai-workflow",
    discipline: "AI-workflow",
    summary: "Placeholder — Favour will refine this. How AI actually sits inside the process above, not bolted onto it.",
    phases: [
      { label: "Scope with AI in mind", description: "Placeholder — Favour will refine this. Decide upfront what's a good fit for AI-assisted drafting versus what needs a human hand from the start." },
      { label: "Draft fast", description: "Placeholder — Favour will refine this. Use AI to get a first pass of screens, copy, or code in front of everyone quickly, so the real conversation starts sooner." },
      { label: "Review & direct", description: "Placeholder — Favour will refine this. Every AI-drafted output gets a real design review — taste, judgment, and edits are still mine, not the model's." },
      { label: "Iterate in the loop", description: "Placeholder — Favour will refine this. Fold AI back into revisions rather than starting over, so speed compounds instead of resetting each round." },
      { label: "Ship with the same bar", description: "Placeholder — Favour will refine this. The output is held to the same quality bar as fully hand-built work before it ships — AI-assisted is never a lower standard." },
    ],
  },
  {
    _id: "process-ui-ux",
    discipline: "UI/UX",
    summary:
      "From framing the problem to a validated, build-ready UI — the track behind every dashboard and product screen in this portfolio.",
    phases: [
      { label: "Discovery & framing", description: "Understand the domain, the users, and the constraint that actually matters before opening a design tool." },
      { label: "Structure & flows", description: "Information architecture and wireframes — get the shape of the product right while it's still cheap to change." },
      { label: "Visual design system", description: "Tokens, type scale, and components — a system, not a set of one-off screens." },
      { label: "Prototyping & validation", description: "Interactive prototypes to pressure-test flows before a line of production code is written." },
      { label: "Handoff & QA", description: "Redlines, states, and edge cases documented well enough that build fidelity isn't a guessing game." },
    ],
  },
  {
    _id: "process-web-development",
    discipline: "Web Development",
    summary:
      "Design and build stay in the same hands — the front end is where the design system gets tested against real content and real devices.",
    phases: [
      { label: "Technical scoping", description: "Pick the stack and data shape (often Sanity-forward) before writing components, so content and code don't fight later." },
      { label: "Design-system build", description: "Tokens and primitives get built first — colour ramps, type scale, spacing — so every page composes from the same parts." },
      { label: "Page implementation", description: "Pages are assembled from the system, not styled individually, which is what keeps a 12-page build coherent." },
      { label: "Performance & QA", description: "Responsive pass, empty/loading states, and a pass for the details that only show up on a real device." },
      { label: "Launch & handover", description: "Ship it, and leave the codebase in a state a future maintainer — including future-me — can actually work in." },
    ],
  },
  {
    _id: "process-branding",
    discipline: "Branding",
    summary: "Identity work that has to survive contact with a real product, not just a brand deck.",
    phases: [
      { label: "Positioning & strategy", description: "What the brand needs to say, to whom, and what it's deliberately not trying to be." },
      { label: "Visual identity system", description: "Mark, colour, and type decisions made together, so the identity holds up outside the first mockup it was designed in." },
      { label: "Guidelines", description: "A usage system clear enough that the brand stays consistent once other hands are applying it." },
      { label: "Rollout assets", description: "The identity translated into the actual surfaces it has to live on — product UI, deck, social, print." },
    ],
  },
  {
    _id: "process-campaigns-marketing",
    discipline: "Campaigns & Marketing",
    summary: "Campaign work treated as a design problem with a deadline and a measurable goal.",
    phases: [
      { label: "Brief & audience framing", description: "Agree on the goal and the audience before a single asset gets designed." },
      { label: "Concept & messaging", description: "One clear idea, developed enough to survive being executed across formats." },
      { label: "Asset production", description: "The concept produced across every format the campaign actually needs — not just the hero visual." },
      { label: "Launch & optimization", description: "Ship, watch what's working, and adjust the assets that aren't." },
    ],
  },
];
