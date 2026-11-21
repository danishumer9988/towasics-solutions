// Builds and reads project share links.
// Example: /portfolio/amazon_price_scraper_64f1a2b3c4d5e6f7a8b9c0d1

export const PROJECT_ID_LENGTH = 24

export function slugifyTitle(title = '') {
  return String(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60)
}

export function buildProjectPath(project) {
  const name = slugifyTitle(project?.title)
  return name
    ? `/portfolio/${name}_${project._id}`
    : `/portfolio/${project._id}`
}

// Reads the id from the end of the link part.
// Works for both the new link and an old id-only link.
export function extractProjectId(value = '') {
  const match = String(value).match(/([a-f0-9]{24})$/i)
  return match ? match[1] : ''
}