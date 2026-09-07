import { skillCategories } from "@/lib/data/skills";
import type { BlogPost, DesignSuperpower, Product, Skill, SkillGroup } from "@/lib/types";

export type SearchEntry = {
  id: string;
  label: string;
  sublabel?: string;
  href: string;
  keywords: string[];
};

export type SearchIndex = {
  skills: SearchEntry[];
  superpowers: SearchEntry[];
  blogPosts: SearchEntry[];
  products: SearchEntry[];
};

/**
 * Individual `skill` docs don't have their own page to land on, and there
 * are too many of them to list one row per skill without drowning out
 * everything else — so this groups them (by category, and by the
 * process-page's skillGroup pills) into a handful of entries whose
 * keywords carry every skill/pill name, so a search for e.g. "Figma"
 * still surfaces a result even though "Figma" itself isn't a row.
 */
export function buildSkillEntries(skills: Skill[], skillGroups: SkillGroup[]): SearchEntry[] {
  const fromCategories = skillCategories
    .map((category): SearchEntry | null => {
      const items = skills.filter((s) => s.category === category);
      if (items.length === 0) return null;
      return {
        id: `skill-category-${category}`,
        label: category,
        sublabel: `${items.length} skill${items.length === 1 ? "" : "s"}`,
        href: "/process?tab=skills",
        keywords: items.map((s) => s.name),
      };
    })
    .filter((entry): entry is SearchEntry => entry !== null);

  const fromGroups = skillGroups.map((group) => ({
    id: `skill-group-${group._id}`,
    label: group.title,
    sublabel: group.pills.join(" · "),
    href: "/process?tab=skills",
    keywords: [...group.pills, "skills"],
  }));

  return [...fromCategories.map((entry) => ({ ...entry, keywords: [...entry.keywords, "skills"] })), ...fromGroups];
}

/**
 * Each entry's keywords carry the section name itself ("design
 * superpowers", "blog", "products") so that typing the section name — not
 * just a specific item's title — still surfaces a result. Without this, a
 * search for the exact phrase "design superpowers" would come back empty
 * even though the section is grouped under that exact heading, since cmdk
 * and the overlay's filter only match against item value/keywords, never
 * the group heading text.
 */
export function buildSuperpowerEntries(superpowers: DesignSuperpower[]): SearchEntry[] {
  return superpowers.map((power) => ({
    id: `superpower-${power._id}`,
    label: power.title,
    sublabel: power.subtitle,
    href: "/process?tab=superpowers",
    keywords: [power.subtitle, "design superpowers", "superpower"],
  }));
}

export function buildBlogEntries(posts: BlogPost[]): SearchEntry[] {
  return posts.map((post) => ({
    id: `blog-${post._id}`,
    label: post.title,
    sublabel: post.excerpt,
    href: `/blog/${post.slug}`,
    keywords: [...post.tags, "blog"],
  }));
}

export function buildProductEntries(products: Product[]): SearchEntry[] {
  return products.map((product) => ({
    id: `product-${product._id}`,
    label: product.name,
    sublabel: product.description,
    href: "/profile#products",
    keywords: ["products", "my products"],
  }));
}
