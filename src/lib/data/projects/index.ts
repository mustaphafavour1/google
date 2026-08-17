import type { Project } from "@/lib/types";
import { caretrace } from "./caretrace";
import { corridor } from "./corridor";
import { switchboard } from "./switchboard";

export const projects: Project[] = [caretrace, corridor, switchboard];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export { caretrace, corridor, switchboard };
