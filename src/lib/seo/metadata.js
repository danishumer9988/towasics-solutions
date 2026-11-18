const SITE_URL = 'https://towasicsolutions.com'
const SITE_NAME = 'Towasic Solutions'

const STATIC_ROUTES = {
  '/': {
    title: 'Towasic Solutions | Web Scraping, AI Agents & Automation Bots, and Super Intelligence Solutions Company',
    description: 'Towasic Solutions combines data scraping, intelligent automation, and super intelligence to build AI systems that work smarter. 235+ projects delivered. Trusted by 50+ clients worldwide.',
  },
  '/aboutus': {
    title: 'About Towasic Solutions | Web Scraping, AI Automation Agents & IoT Solutions Experts Company',
    description: 'Meet the team behind Towasic Solutions. We specialize in web scraping, intelligent automation, LLM bots, data enrichment, and custom IoT solutions with 235+ projects delivered worldwide.',
  },
  '/contactus': {
    title: 'Contact Towasic Solutions | Discuss Your Custom Software Project',
    description: "Have a project in mind? Contact Towasic Solutions for web scraping, LLM bots, intelligent automation, data enrichment and IoT solutions. Let's discuss your requirements.",
  },
  '/industries': {
    title: 'Industries We Serve | Web Scraping, AI Agents & Automation Bots | Towasic Solutions',
    description: 'Explore how Towasic Solutions helps businesses across e-commerce, finance, healthcare, real estate, logistics, and other industries with web scraping and intelligent automation.',
  },
  '/howworks': {
    title: 'Our Process | Web Scraping & AI Automation Solutions | Towasic Solutions',
    description: 'Discover how Towasic Solutions turns your requirements into reliable web scraping, LLM bot, and AI automation solutions through a clear, step-by-step development process.',
  },
  '/faq': {
    title: 'FAQs | Web Scraping & Intelligent Automation | Towasic Solutions',
    description: 'Find answers to common questions about web scraping, automation bots, Custom Intelligent solutions, data enrichment, project delivery, pricing, and compliance.',
  },
  '/blog': {
    title: 'Blogs | Web Scraping, AI Automation Agents | Towasic Solutions',
    description: 'Explore web scraping tutorials, AI and LLM developments, automation guides, data enrichment techniques, and practical insights from Towasic Solutions.',
  },
  '/portfolio': {
    title: 'Our Portfolio | Web Scraping, AI Automation Agents & IoT Solutions | Towasic Solutions',
    description: 'Explore the portfolio of Towasic Solutions — web scraping, intelligent automation, LLM bots, and custom software projects delivered for clients worldwide.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Towasic Solutions',
    description: 'Learn how Towasic Solutions collects, uses, stores, and protects personal information when you visit our website or use our services.',
  },
  '/terms-of-service': {
    title: 'Terms of Service | Towasic Solutions',
    description: 'Read the Terms of Service governing your use of the Towasic Solutions website, web scraping services, automation solutions, and related offerings.',
  },
}

function humanizeSlug(slug) {
  return decodeURIComponent(slug).replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function withSuffix(title) {
  if (!title) return SITE_NAME
  const trimmed = String(title).trim()
  if (!trimmed) return SITE_NAME
  if (/\bTowasic Solutions\b/i.test(trimmed)) return trimmed
  return `${trimmed} | ${SITE_NAME}`
}

export function getMetadataForPath(path, overrides = {}) {
  let cleanPath = String(path || '/').split('?')[0].split('#')[0]
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1)
  }

  if (STATIC_ROUTES[cleanPath]) {
    return {
      title: overrides.title || STATIC_ROUTES[cleanPath].title,
      description: overrides.description || STATIC_ROUTES[cleanPath].description,
    }
  }

  const serviceMatch = cleanPath.match(/^\/services\/([^/]+)$/)
  if (serviceMatch) {
    const serviceName = humanizeSlug(serviceMatch[1])
    return {
      title: overrides.title || `${serviceName} | Towasic Solutions`,
      description: overrides.description || `Explore Towasic Solutions' ${serviceName} services — scalable, reliable, and tailored to your business.`,
    }
  }

  const blogMatch = cleanPath.match(/^\/blogs\/([^/]+)$/)
  if (blogMatch) {
    const slugTitle = humanizeSlug(blogMatch[1])
    return {
      title: overrides.title || `${slugTitle} | Towasic Solutions Blog`,
      description: overrides.description || 'Read the latest article from Towasic Solutions on web scraping, automation, and super intelligence.',
    }
  }

  return {
    title: overrides.title || STATIC_ROUTES['/'].title,
    description: overrides.description || STATIC_ROUTES['/'].description,
  }
}

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