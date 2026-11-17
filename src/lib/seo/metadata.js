/**
 * Shared SEO metadata for Towasic Solutions.
 *
 * Imported by:
 *   - src/components/SEO.jsx   (client-side)
 *   - api/og-meta.js           (Edge Function – crawler HTML)
 *   - api/og-image.js          (OG image generator – fallback text)
 *
 * ⚠️ Every string below is copied verbatim from the corresponding page
 *    component. Do NOT paraphrase. If you change a page's <SEO> props,
 *    update this file in the same commit.
 */

const SITE_URL = 'https://towasicsolutions.com'
const SITE_NAME = 'Towasic Solutions'

/**
 * Static routes — key is the exact path, value is { title, description }.
 * These titles do NOT include the "| Towasic Solutions" suffix; that is
 * added by withSuffix() / SEO.jsx only when the title doesn't already
 * mention the brand.
 */
const STATIC_ROUTES = {
  // from src/pages/Home.jsx
  '/': {
    title:
      'Towasic Solutions | Web Scraping, Web Automation bots & Super Intelligence Solutions',
    description:
      'Towasic Solutions combines data scraping, intelligent automation, and super intelligence to build AI systems that work smarter. 235+ projects delivered. Trusted by 50+ clients worldwide.',
  },

  // from src/pages/AboutUs.jsx
  '/aboutus': {
    title:
      'About Towasic Solutions | Web Scraping | SI Automation & IoT Solutions Experts',
    description:
      'Meet the team behind Towasic Solutions. We specialize in web scraping, intelligent automation, LLM bots, data enrichment, and custom IoT solutions with 235+ projects delivered worldwide.',
  },

  // from src/pages/ContactUs.jsx
  '/contactus': {
    title: 'Contact Towasic Solutions | Discuss Your Automation Project',
    description:
      "Have a project in mind? Contact Towasic Solutions for web scraping, LLM bots, intelligent automation, data enrichment and IoT solutions. Let's discuss your requirements.",
  },

  // from src/pages/Industries.jsx
  '/industries': {
    title: 'Industries We Serve | Web Scraping & SI Automation Bots | Towasic',
    description:
      'Explore how Towasic Solutions helps businesses across e-commerce, finance, healthcare, real estate, logistics, and other industries with web scraping and intelligent automation.',
  },

  // from src/pages/HowItWorks.jsx
  '/howworks': {
    title: 'Our Process | Web Scraping & SI Automation Solutions | Towasic',
    description:
      'Discover how Towasic Solutions turns your requirements into reliable web scraping, LLM bot, and SI automation solutions through a clear, step-by-step development process.',
  },

  // from src/pages/FAQ.jsx
  '/faq': {
    title:
      'FAQs | Web Scraping & Super Intelligence Automation | Towasic Solutions',
    description:
      'Find answers to common questions about web scraping, automation bots, SI and LLM solutions, data enrichment, project delivery, pricing, and compliance.',
  },

  // from src/pages/Blog.jsx
  '/blog': {
    title:
      'Web Scraping, Super Intelligence Automation Blog | Towasic Solutions',
    description:
      'Explore web scraping tutorials, SI and LLM developments, automation guides, data enrichment techniques, and practical insights from Towasic Solutions.',
  },

  // ⚠️ TODO — these three pages haven't been inspected yet. Replace the
  // strings below with whatever the actual <SEO title=... description=...>
  // props in Portfolio.jsx / PrivacyPolicy.jsx / TermsOfService.jsx pass.
  '/portfolio': {
    title: 'Portfolio | Towasic Solutions',
    description:
      'Explore the portfolio of Towasic Solutions — web scraping, intelligent automation, LLM bots, and custom software projects delivered for clients worldwide.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Towasic Solutions',
    description:
      'Learn how Towasic Solutions collects, uses, stores, and protects personal information when you visit our website or use our services.',
  },
  '/terms-of-service': {
    title: 'Terms of Service | Towasic Solutions',
    description:
      'Read the Terms of Service governing your use of the Towasic Solutions website, web scraping services, automation solutions, and related offerings.',
  },
}

/** Title-case a slug: "web-scraping" → "Web Scraping" */
function humanizeSlug(slug) {
  return decodeURIComponent(slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Append "| Towasic Solutions" only if the title doesn't already contain
 * "Towasic Solutions". Also trims whitespace so Home.jsx's leading/trailing
 * spaces never leak into <title>.
 */
export function withSuffix(title) {
  if (!title) return SITE_NAME
  const trimmed = String(title).trim()
  if (!trimmed) return SITE_NAME
  if (/\bTowasic Solutions\b/i.test(trimmed)) return trimmed
  return `${trimmed} | ${SITE_NAME}`
}

/**
 * Resolve metadata for a path. Explicit `title` / `description` props
 * always win — this lets <SEO> keep working exactly as today while the
 * Edge Function (which passes no overrides) still gets sensible values.
 */
export function getMetadataForPath(path, overrides = {}) {
  let cleanPath = String(path || '/').split('?')[0].split('#')[0]
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1)
  }

  // 1. Exact static match
  if (STATIC_ROUTES[cleanPath]) {
    return {
      title: overrides.title || STATIC_ROUTES[cleanPath].title,
      description:
        overrides.description || STATIC_ROUTES[cleanPath].description,
    }
  }

  // 2. Service pages  /services/:serviceName
  const serviceMatch = cleanPath.match(/^\/services\/([^/]+)$/)
  if (serviceMatch) {
    const serviceName = humanizeSlug(serviceMatch[1])
    return {
      title: overrides.title || `${serviceName} | Towasic Solutions`,
      description:
        overrides.description ||
        `Explore Towasic Solutions' ${serviceName} services — scalable, reliable, and tailored to your business.`,
    }
  }

  // 3. Blog details  /blogs/:slug
  const blogMatch = cleanPath.match(/^\/blogs\/([^/]+)$/)
  if (blogMatch) {
    const slugTitle = humanizeSlug(blogMatch[1])
    return {
      title: overrides.title || `${slugTitle} | Towasic Solutions Blog`,
      description:
        overrides.description ||
        'Read the latest article from Towasic Solutions on web scraping, automation, and super intelligence.',
    }
  }

  // 4. Unknown route — fall back to homepage defaults
  return {
    title: overrides.title || STATIC_ROUTES['/'].title,
    description:
      overrides.description || STATIC_ROUTES['/'].description,
  }
}

/**
 * Build a fully-qualified OG-image URL. The generated PNG is served by
 * /api/og-image and rendered live from your actual Towasic Solutions logo.
 */
export function buildOgImageUrl({ title, description, url }) {
  const base = `${SITE_URL}/api/og-image`
  const params = new URLSearchParams({
    title: title || SITE_NAME,
    description: description || '',
    url: url || SITE_URL,
  })
  return `${base}?${params.toString()}`
}

export { SITE_URL, SITE_NAME, STATIC_ROUTES }