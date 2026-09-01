export const projectFields = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  oneLiner,
  "industry": industry->name,
  "coverImage": coverImage.asset->url,
  "coverGifUrl": coverGif.asset->url,
  tags,
  projectType,
  year,
  role,
  techStack,
  scale,
  valueImpact,
  accent,
  processDisciplines,
  complexity,
  recency,
  blocks[]{
    ...,
    _type == "imageGallery" => {
      images[]{
        "src": image.asset->url,
        caption,
        aspect
      }
    },
    _type == "fullBleedImage" => {
      "image": image.asset->url,
      caption,
      aspect
    },
    _type == "imageGrid" => {
      items[]{
        "image": image.asset->url,
        caption,
        span
      }
    }
  }
`;

export const allProjectsQuery = /* groq */ `*[_type == "project"] | order(year desc) { ${projectFields} }`;

export const projectBySlugQuery = /* groq */ `
  *[_type == "project" && slug.current == $slug][0] { ${projectFields} }
`;

export const allProjectSlugsQuery = /* groq */ `*[_type == "project"]{ "slug": slug.current }`;

export const allProcessTracksQuery = /* groq */ `
  *[_type == "processTrack"] | order(discipline asc) {
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

export const siteSettingsQuery = /* groq */ `
  *[_id == "siteSettings"][0]{
    profile,
    siteMetrics,
    about,
    contact{
      email,
      "resumeUrl": resumeFile.asset->url,
      website,
      socials
    },
    hobbies,
    analyticsAggregate
  }
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

export const allPortfolioArchiveQuery = /* groq */ `
  *[_type == "portfolioArchive"] | order(year desc) {
    _id,
    year,
    url,
    "image": image.asset->url,
    description
  }
`;
