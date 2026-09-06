import { getProjectsAiContext, getProcessTracks, getSiteSettings, getAiContext } from "@/lib/content";
import type { ChatMode } from "@/lib/chatbot-content";

const MODE_INSTRUCTIONS: Record<ChatMode, string> = {
  recruiter:
    "The visitor is likely a recruiter or hiring manager. Lead with experience, availability, and fit for a role. Keep it concise and concrete — real numbers and real project names, not vague claims.",
  designer:
    "The visitor is likely another designer or a technical peer. Feel free to go deeper into process, tools, and design decisions — the reasoning behind choices, not just the outcome.",
  general:
    "The visitor could be anyone. Keep answers welcoming and clear, and steer toward the Projects or Contact page when it's the natural next step.",
};

/**
 * The cached, mode-independent half of the system prompt — real site
 * content only, no invented facts. Kept as one function so every caller
 * (the full ChatWidget and the case-study mini widget) shares one cache
 * entry regardless of which mode the visitor picked.
 */
export async function buildFaveAiKnowledgeBase(): Promise<string> {
  const [siteSettings, projects, processTracks, aiContext] = await Promise.all([
    getSiteSettings(),
    getProjectsAiContext(),
    getProcessTracks(),
    getAiContext(),
  ]);
  const { profile, about, contact } = siteSettings;

  const projectSections = projects
    .map((p) => {
      const lines = [
        `### ${p.name} (${p.year}, ${p.industry ?? "industry not set"})`,
        p.oneLiner,
        p.tags.length > 0 ? `Tags: ${p.tags.join(", ")}` : null,
        p.aiContext ? `\nDetail:\n${p.aiContext}` : null,
      ].filter(Boolean);
      return lines.join("\n");
    })
    .join("\n\n");

  const processSections = processTracks
    .map((t) => `### ${t.discipline}\n${t.summary}\nPhases: ${t.phases.map((ph) => ph.label).join(" → ")}`)
    .join("\n\n");

  return `You are FaveAI, a scripted-but-now-live assistant embedded in ${profile.name}'s portfolio site. You answer questions about ${profile.firstName} — their work, process, and background — using only the real information below. Never invent projects, numbers, or claims that aren't grounded in this context.

## Profile
${profile.name}, ${profile.title}, based in ${profile.location}.
${profile.tagline}
${profile.founderNote}

## How they think about design
${about.design.paragraphs.join("\n\n")}

## Beyond the work
${about.general.paragraphs.join("\n\n")}

## Contact
Email: ${contact.email}
${contact.socials.map((s) => `${s.label}: ${s.href}`).join("\n")}

## Projects
${projectSections}

## Process by discipline
${processSections}
${
  aiContext.entries.length > 0
    ? `\n## Additional context\n${aiContext.entries.map((e) => `### ${e.name}\n${e.content}`).join("\n\n")}\n`
    : ""
}
---
Style: be concise and direct. Answer exactly what was asked and nothing else — don't volunteer extra background, don't list unrelated projects or facts "just in case", and don't restate the question. 1-3 sentences for most answers; go longer only when the question explicitly asks for detail (e.g. "walk me through the process"). Plain text, no markdown headers in your replies. If something isn't covered above, say you don't have that detail rather than guessing, and suggest the visitor use the Contact page for anything you can't answer.
${aiContext.guidelines ? `\nAdditional rules from Favour:\n${aiContext.guidelines}` : ""}`;
}

export function buildModeInstruction(mode: ChatMode): string {
  return MODE_INSTRUCTIONS[mode];
}
