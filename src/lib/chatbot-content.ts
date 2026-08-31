import type { Project, SiteSettings } from "@/lib/types";

export type ChatMode = "recruiter" | "designer" | "general";

export type QuickQuestion = {
  question: string;
  answer: string;
  keywords?: string[];
};

export type ChatModeConfig = {
  label: string;
  greeting: string;
  quickQuestions: QuickQuestion[];
};

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "do", "does",
  "did", "what", "when", "where", "who", "how", "why", "can", "could",
  "would", "should", "i", "you", "your", "me", "my", "of", "for", "to",
  "in", "on", "at", "and", "or", "with", "about", "favour", "s",
]);

function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

export function buildChatModes(
  siteSettings: SiteSettings,
  projects: Project[],
): Record<ChatMode, ChatModeConfig> {
  const { profile, siteMetrics, about, contact } = siteSettings;
  const years = siteMetrics.find((m) => m.key === "years")?.value ?? "several";
  const industries = Array.from(new Set(projects.map((p) => p.industry))).join(", ");
  const tools = Array.from(new Set(projects.flatMap((p) => p.techStack))).slice(0, 6).join(", ");
  const featured = projects[0];

  return {
    recruiter: {
      label: "Recruiter",
      greeting: `Hi, I'm FaveAI. Ask me about ${profile.firstName}'s experience, availability, or fit for a role.`,
      quickQuestions: [
        {
          question: "What's Favour's experience?",
          answer: `${profile.firstName} has ${years} years of experience as a ${profile.title.toLowerCase()}, working across ${industries}. ${profile.founderNote}`,
          keywords: ["experience", "background", "years"],
        },
        {
          question: "Is Favour open to new roles?",
          answer: `Yes — ${profile.firstName} is actively open to new product design and front-end build roles. Fastest way in: ${contact.email}, or the Contact page.`,
          keywords: ["available", "open", "hiring", "role", "job"],
        },
        {
          question: "What industries has Favour worked in?",
          answer: `Mostly ${industries}. The case studies on the Projects page break each one down in detail.`,
          keywords: ["industry", "industries", "sector", "domain"],
        },
        {
          question: "Can I see a resume?",
          answer: contact.resumeUrl
            ? `Sure — there's a Download résumé button in the closing section of the homepage, or grab it directly.`
            : `A resume link isn't set up yet — the fastest path is emailing ${contact.email} directly.`,
          keywords: ["resume", "cv"],
        },
      ],
    },
    designer: {
      label: "Designer",
      greeting: `Hey, I'm FaveAI. Ask me about ${profile.firstName}'s process, tools, or design philosophy.`,
      quickQuestions: [
        {
          question: "What's Favour's design process?",
          answer: about.design.paragraphs[0] ?? "Systems before screens — tokens, then components, then pages.",
          keywords: ["process", "philosophy", "approach", "think"],
        },
        {
          question: "What tools does Favour use?",
          answer: `Across recent projects: ${tools}. The Skills page has the full breakdown by category.`,
          keywords: ["tools", "stack", "software", "figma"],
        },
        {
          question: "What's a project you're proud of?",
          answer: featured
            ? `${featured.name} — ${featured.oneLiner} Worth a look on the Projects page.`
            : "Check the Projects page for the full case study lineup.",
          keywords: ["project", "proud", "favorite", "favourite", "best"],
        },
        {
          question: "How does Favour handle design systems?",
          answer: "Tokens before components, components before pages — it's slower on day one and much faster by page twelve. More on the About page.",
          keywords: ["system", "systems", "tokens", "components"],
        },
      ],
    },
    general: {
      label: "General",
      greeting: `Hi, I'm FaveAI! Ask me anything about ${profile.firstName} or this portfolio.`,
      quickQuestions: [
        {
          question: "Who is Favour?",
          answer: `${profile.firstName} is a ${profile.title.toLowerCase()} based in ${profile.location}. ${profile.tagline}`,
          keywords: ["who", "favour"],
        },
        {
          question: "How do I get in touch?",
          answer: `Email works best: ${contact.email}. There's also a Contact page with a few more ways to reach out.`,
          keywords: ["contact", "reach", "email", "touch"],
        },
        {
          question: "What is this site built with?",
          answer: "Next.js, Tailwind CSS, Framer Motion, and Sanity CMS — Favour built this portfolio dashboard himself.",
          keywords: ["built", "stack", "tech", "technology", "code"],
        },
        {
          question: "Where is Favour based?",
          answer: `${profile.location}, working with teams worldwide.`,
          keywords: ["based", "location", "where", "live"],
        },
      ],
    },
  };
}

export function findBestAnswer(input: string, quickQuestions: QuickQuestion[]): string | null {
  const inputWords = new Set(normalizeWords(input));
  if (inputWords.size === 0) return null;

  let best: { score: number; answer: string } | null = null;
  for (const qq of quickQuestions) {
    const candidateWords = new Set([...normalizeWords(qq.question), ...(qq.keywords ?? [])]);
    let overlap = 0;
    for (const word of inputWords) {
      if (candidateWords.has(word)) overlap += 1;
    }
    const score = overlap / inputWords.size;
    if (score > 0 && (!best || score > best.score)) {
      best = { score, answer: qq.answer };
    }
  }

  return best && best.score >= 0.34 ? best.answer : null;
}
