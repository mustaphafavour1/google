export const projectFields = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  oneLiner,
  industry,
  "coverImage": coverImage.asset->url,
  tags,
  projectType,
  year,
  role,
  techStack,
  scale,
  valueImpact,
  accent,
  blocks[]{
    ...,
    _type == "imageGallery" => {
      images[]{
        "src": image.asset->url,
        caption,
        aspect
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
