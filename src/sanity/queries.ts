export const projectFields = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  oneLiner,
  "industry": industry->name,
  "coverImage": coverImage.asset->url + "?auto=format",
  "coverGifUrl": coverGif.asset->url,
  tags,
  projectType,
  year,
  role,
  techStack,
  "links": links[]{ label, url },
  scale,
  valueImpact,
  accent,
  processDisciplines,
  complexity,
  recency,
  cardSize,
  showOnPortfolio,
  blocks[]{
    ...,
    _type == "imageGallery" => {
      images[]{
        "src": image.asset->url + "?auto=format",
        caption,
        aspect
      }
    },
    _type == "fullBleedImage" => {
      "image": image.asset->url + "?auto=format",
      caption,
      aspect
    },
    _type == "imageGrid" => {
      items[]{
        "image": image.asset->url + "?auto=format",
        caption,
        span
      }
    }
  }
`;

export const allProjectsQuery = /* groq */ `
  *[_type == "project" && showOnPortfolio != false] | order(year desc) { ${projectFields} }
`;

export const projectBySlugQuery = /* groq */ `
  *[_type == "project" && slug.current == $slug && showOnPortfolio != false][0] { ${projectFields} }
`;

/**
 * Server-only — FaveAI's knowledge base. Deliberately separate from
 * projectFields: aiContext is internal reference material, never meant to
 * reach a client bundle, so it's kept out of the query every public page
 * uses and only fetched here, by the chat API route.
 */
export const allProjectsAiContextQuery = /* groq */ `
  *[_type == "project" && showOnPortfolio != false] | order(year desc) {
    name,
    "slug": slug.current,
    oneLiner,
    "industry": industry->name,
    year,
    tags,
    aiContext
  }
`;

export const allProjectSlugsQuery = /* groq */ `
  *[_type == "project" && showOnPortfolio != false]{ "slug": slug.current }
`;

export const allProcessTracksQuery = /* groq */ `
  *[_type == "processTrack"] | order((discipline == "Overall") desc, discipline asc) {
    _id,
    discipline,
    summary,
    phases
  }
`;

export const allSkillsQuery = /* groq */ `
  *[_type == "skill"] | order(category asc, group asc, name asc) {
    _id,
    name,
    category,
    group
  }
`;

export const allSkillGroupsQuery = /* groq */ `
  *[_type == "skillGroup"] | order(order asc) {
    _id,
    title,
    order,
    pills
  }
`;

export const allDesignSuperpowersQuery = /* groq */ `
  *[_type == "designSuperpower"] | order(order asc) {
    _id,
    title,
    subtitle,
    order
  }
`;

export const siteSettingsQuery = /* groq */ `
  *[_id == "siteSettings"][0]{
    profile,
    "featuredProjects": featuredProjects[@->showOnPortfolio != false]->{ ${projectFields} },
    "profileMedia": profileMedia[]{
      "image": image.asset->url + "?auto=format",
      "video": video.asset->url,
      caption
    },
    landing,
    siteMetrics,
    about,
    contact{
      email,
      "resumeUrl": resumeFile.asset->url,
      "resumeVariants": resumeVariants[]{ label, "url": file.asset->url },
      website,
      socials
    },
    "hobbies": hobbies[]{
      label,
      note,
      "image": image.asset->url + "?auto=format"
    },
    analyticsAggregate,
    dddSubtitle
  }
`;

/**
 * Server-only — the résumé download gate. Deliberately separate from
 * siteSettingsQuery: the password must never reach a client bundle, so it's
 * kept out of the query every public page uses and only fetched here, by
 * the resume-gate API route.
 */
export const portfolioPasswordQuery = /* groq */ `
  *[_id == "siteSettings"][0]{ "portfolioPassword": contact.portfolioPassword }
`;

export const jobApplicationVariantBySlugQuery = /* groq */ `
  *[_type == "jobApplicationVariant" && slug.current == $slug][0]{
    _id,
    companyName,
    "slug": slug.current,
    roleTitle,
    introNote,
    selectedProjects[]->{ ${projectFields} }
  }
`;

export const allJobApplicationSlugsQuery = /* groq */ `
  *[_type == "jobApplicationVariant"]{ "slug": slug.current }
`;

export const allBackgroundPatternsQuery = /* groq */ `
  *[_type == "backgroundPattern" && enabled == true]{
    _id,
    title,
    "svgUrl": svgFile.asset->url,
    enabled,
    global,
    pages,
    "projectSlugs": projects[]->slug.current
  }
`;

export const allProductsQuery = /* groq */ `
  *[_type == "product"] | order(_createdAt asc) {
    _id,
    name,
    "coverImage": coverImage.asset->url + "?auto=format",
    description,
    link
  }
`;

export const allBlogPostsQuery = /* groq */ `
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImage": coverImage.asset->url + "?auto=format",
    publishedAt,
    tags
  }
`;

export const blogPostBySlugQuery = /* groq */ `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImage": coverImage.asset->url + "?auto=format",
    publishedAt,
    tags,
    content[]{
      ...,
      _type == "image" => { "url": asset->url + "?auto=format" }
    }
  }
`;

export const allDddWeeksQuery = /* groq */ `
  *[_type == "dddWeek"] | order(week asc) {
    week,
    images[] {
      "key": _key,
      "image": image.asset->url + "?auto=format",
      caption,
      date
    }
  }
`;

export const allAiContextEntriesQuery = /* groq */ `
  *[_type == "aiContextEntry"] | order(_createdAt asc) { name, content }
`;

export const aiGuidelinesQuery = /* groq */ `
  *[_id == "aiGuidelines"][0]{ rules }
`;

export const allPortfolioArchiveQuery = /* groq */ `
  *[_type == "portfolioArchive"] | order(year desc) {
    _id,
    year,
    url,
    "image": image.asset->url + "?auto=format",
    description
  }
`;
