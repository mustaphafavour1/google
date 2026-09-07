import {
  getProjectsAiContext,
  getProcessTracks,
  getSiteSettings,
  getAiContext,
  getSkills,
  getSkillGroups,
  getDesignSuperpowers,
  getProducts,
  getBlogPosts,
} from "@/lib/content";
import type { ChatMode } from "@/lib/chatbot-content";

const MODE_INSTRUCTIONS: Record<ChatMode, string> = {
  recruiter:
    "The visitor is likely a recruiter or hiring manager. Lead with experience, availability, and fit for a role. Keep it concise and concrete — real numbers and real project names, not vague claims.",
  designer:
    "The visitor is likely another designer or a technical peer. Feel free to go deeper into process, tools, and design decisions — the reasoning behind choices, not just the outcome.",
  general:
    "The visitor could be anyone. Keep answers welcoming and clear, and steer toward the Projects or Contact page when it's the natural next step.",
};

const SITE_MAP = `## Site map
Use these paths whenever you point someone to a page — write them as a real
link, \`[label](/path)\`, so the visitor can click straight there instead of
having to go find it themselves.
- Home: /
- Projects (all case studies): /projects
- Gallery (every project + profile image in one grid): /gallery
- Process & Skills (how each discipline runs, the full skill set, design superpowers): /process
- Blog: /blog
- Daily Design Dose (a short design/tech post most days): /ddd
- Profile (bio, contact info, résumé, hobbies): /profile
- Résumé: a "Open Resume" button on the Profile page — link to [Profile](/profile#resume), never claim to attach or email the file yourself
- Products (things Favour has shipped): [Products](/profile#products)
- For Fun (a few small games): /playground
- Archive (older portfolio versions): /archive
- Contact: there's a "Let's discuss" button throughout the site that opens a popup to book a meeting or send a message directly — or email, see below`;

/**
 * The cached, mode-independent half of the system prompt — real site
 * content only, no invented facts. Kept as one function so every caller
 * (the full ChatWidget and the case-study mini widget) shares one cache
 * entry regardless of which mode the visitor picked.
 */
export async function buildFaveAiKnowledgeBase(): Promise<string> {
  const [siteSettings, projects, processTracks, aiContext, skills, skillGroups, superpowers, products, blogPosts] =
    await Promise.all([
      getSiteSettings(),
      getProjectsAiContext(),
      getProcessTracks(),
      getAiContext(),
      getSkills(),
      getSkillGroups(),
      getDesignSuperpowers(),
      getProducts(),
      getBlogPosts(),
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

  const skillsByCategory = new Map<string, string[]>();
  for (const skill of skills) {
    skillsByCategory.set(skill.category, [...(skillsByCategory.get(skill.category) ?? []), skill.name]);
  }
  const skillsSection = Array.from(skillsByCategory.entries())
    .map(([category, names]) => `${category}: ${names.join(", ")}`)
    .join("\n");
  const skillGroupsSection = skillGroups.map((g) => `${g.title}: ${g.pills.join(", ")}`).join("\n");

  const superpowersSection = superpowers.map((s) => `- ${s.title} — ${s.subtitle}`).join("\n");

  const productsSection = products.map((p) => `- ${p.name} — ${p.description}`).join("\n");

  const blogSection = blogPosts.map((b) => `- "${b.title}" — ${b.excerpt} ([read it](/blog/${b.slug}))`).join("\n");

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

## Skills
${skillsSection}
${skillGroupsSection}

## Design superpowers
${superpowersSection || "None listed yet."}

${
  products.length > 0
    ? `## Products\n${productsSection}\n`
    : ""
}
${
  blogPosts.length > 0
    ? `## Blog posts\n${blogSection}\n`
    : ""
}
${SITE_MAP}
${
  aiContext.entries.length > 0
    ? `\n## Additional context\n${aiContext.entries.map((e) => `### ${e.name}\n${e.content}`).join("\n\n")}\n`
    : ""
}
---
Style: be concise and direct. Answer exactly what was asked and nothing else — don't volunteer extra background, don't list unrelated projects or facts "just in case", and don't restate the question. 1-3 sentences for most answers; go longer only when the question explicitly asks for detail (e.g. "walk me through the process"). Plain text, no markdown headers or bold in your replies — the one exception is a page link, written as \`[label](/path)\`, whenever you're pointing someone to somewhere on the site (résumé, a specific project, Products, etc.) rather than just naming it. If something isn't covered above, say you don't have that detail rather than guessing, and suggest the visitor use the Contact / "Let's discuss" button for anything you can't answer.
${aiContext.guidelines ? `\nAdditional rules from Favour:\n${aiContext.guidelines}` : ""}`;
}

export function buildModeInstruction(mode: ChatMode): string {
  return MODE_INSTRUCTIONS[mode];
}
