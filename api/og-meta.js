import {
  getMetadataForPath,
  buildOgImageUrl,
  withSuffix,
  SITE_URL,
  SITE_NAME,
  STATIC_ROUTES,
} from '../src/lib/seo/metadata.js'

import { servicesData } from '../src/data/servicesData.js'
import { extractProjectId } from '../src/lib/projectLink.js'

export const config = {
  runtime: 'edge',
}

const BLOG_API_BASE = 'https://towasicbackend.vercel.app/api'

const CRAWLER_UA = [
  'facebookexternalhit',
  'facebot',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'slackbot',
  'discordbot',
  'pinterest',
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'vkshare',
  'w3c_validator',
  'redditbot',
  'applebot',
  'skypeuripreview',
  'iframely',
  'mastodon',
]

function isCrawler(request) {
  const ua = (request.headers.get('user-agent') || '').toLowerCase()
  return CRAWLER_UA.some((name) => ua.includes(name))
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function stripHtml(value = '') {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizePath(rawPath = '/') {
  let path = String(rawPath || '/').trim()

  try {
    path = decodeURIComponent(path)
  } catch {
    // Preserve original path.
  }

  if (!path.startsWith('/')) {
    path = `/${path}`
  }

  path = path.split('?')[0].split('#')[0]

  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1)
  }

  return path || '/'
}

function absoluteImageUrl(image) {
  if (!image) return null

  try {
    const url = new URL(image, SITE_URL)

    if (url.protocol !== 'https:') return null

    return url.toString()
  } catch {
    return null
  }
}

function removeExistingSeoTags(html) {
  let output = html.replace(
    /<title\b[^>]*>[\s\S]*?<\/title>/gi,
    ''
  )

  output = output.replace(/<meta\b[^>]*>/gi, (tag) => {
    const name = tag.match(
      /\bname\s*=\s*["']([^"']+)["']/i
    )?.[1]?.toLowerCase()

    const property = tag.match(
      /\bproperty\s*=\s*["']([^"']+)["']/i
    )?.[1]?.toLowerCase()

    if (
      name === 'description' ||
      name === 'robots' ||
      name?.startsWith('twitter:')
    ) {
      return ''
    }

    if (property?.startsWith('og:')) {
      return ''
    }

    return tag
  })

  output = output.replace(
    /<link\b(?=[^>]*\brel\s*=\s*["']canonical["'])[^>]*>/gi,
    ''
  )

  return output
}

async function getBlogMetadata(slug) {
  try {
    const response = await fetch(
      `${BLOG_API_BASE}/blogs/${encodeURIComponent(slug)}`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'TowasicSolutions-OG/2.0',
        },
        signal: AbortSignal.timeout(5000),
      }
    )

    if (!response.ok) return null

    const blog = await response.json()

    if (!blog || blog.isPublished === false || !blog.title) {
      return null
    }

    const description = stripHtml(
      blog.description || blog.content || ''
    ).slice(0, 300)

    return {
      title: blog.title,
      description:
        description ||
        'Read the latest articles from Towasic Solutions.',
      image: absoluteImageUrl(blog.featuredImage),
      type: 'article',
    }
  } catch (error) {
    console.error('OG blog metadata error:', error)
    return null
  }
}

function getServiceMetadata(slug) {
  const normalizedSlug = slug.trim().toLowerCase()

  const service =
    servicesData[normalizedSlug] ||
    Object.entries(servicesData).find(
      ([key, value]) =>
        key.toLowerCase() === normalizedSlug ||
        value.slug?.toLowerCase() === normalizedSlug
    )?.[1]

  if (!service) return null

  const title = stripHtml(
    service.seo?.title || service.title || ''
  )

  const description = stripHtml(
    service.seo?.description ||
    service.section1?.description ||
    ''
  ).slice(0, 300)

  if (!title || !description) return null

  return {
    title,
    description,
    image: null,
    type: 'website',
  }
}

async function getProjectMetadata(id) {
  try {
    const response = await fetch(
      `${BLOG_API_BASE}/projects/${encodeURIComponent(id)}`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'TowasicSolutions-OG/2.0',
        },
        signal: AbortSignal.timeout(5000),
      }
    )
    if (!response.ok) return null

    const project = await response.json()
    if (!project || project.isActive === false || !project.title) {
      return null
    }

    const firstBlock = project.descriptions?.[0]?.content || ''
    const description = stripHtml(project.description || firstBlock).slice(0, 200)

    return {
      title: project.title,
      description:
        description || 'See this project delivered by Towasic Solutions.',
      image: null, // always use the shared site og-image.jpg
      type: 'website',
    }
  } catch (error) {
    console.error('OG project metadata error:', error)
    return null
  }
}

function isKnownStaticPath(path) {
  return Object.prototype.hasOwnProperty.call(
    STATIC_ROUTES,
    path
  )
}

export default async function handler(request) {
  const requestUrl = new URL(request.url)

  const path = normalizePath(
    requestUrl.searchParams.get('path') || '/'
  )

  if (!isCrawler(request)) {
    return Response.redirect(
      new URL(path, SITE_URL),
      302
    )
  }

  // Fetch the original React HTML shell.
  let html

  try {
    const indexResponse = await fetch(
      new URL('/index.html', requestUrl.origin)
    )

    if (!indexResponse.ok) {
      throw new Error(
        `index.html returned ${indexResponse.status}`
      )
    }

    html = await indexResponse.text()
  } catch (error) {
    console.error('OG HTML shell error:', error)

    return new Response('Unable to load website HTML', {
      status: 500,
    })
  }

  // Resolve metadata.
  let metadata = getMetadataForPath(path)
  let ogType = 'website'
  let isNotFound = false

  const blogMatch = path.match(/^\/blogs\/([^/]+)$/)
  const serviceMatch = path.match(/^\/services\/([^/]+)$/)
  const portfolioMatch = path.match(/^\/portfolio\/([^/]+)$/)

  if (blogMatch) {
    const blogMetadata = await getBlogMetadata(blogMatch[1])

    if (blogMetadata) {
      metadata = blogMetadata
      ogType = blogMetadata.type
    } else {
      isNotFound = true

      metadata = {
        title: 'Blog Not Found | Towasic Solutions',
        description: 'The requested article could not be found.',
      }
    }
  } else if (serviceMatch) {
    const serviceMetadata = getServiceMetadata(serviceMatch[1])

    if (serviceMetadata) {
      metadata = serviceMetadata
    } else {
      isNotFound = true

      metadata = {
        title: 'Service Not Found | Towasic Solutions',
        description: 'The requested service page could not be found.',
      }
    }
  } else if (portfolioMatch) {
    // Support both new readable links and old id-only links.
    const projectId = extractProjectId(portfolioMatch[1])
    const projectMetadata = projectId
      ? await getProjectMetadata(projectId)
      : null

    if (projectMetadata) {
      metadata = projectMetadata
    } else {
      isNotFound = true

      metadata = {
        title: 'Project Not Found | Towasic Solutions',
        description: 'The requested project could not be found.',
      }
    }
  } else if (!isKnownStaticPath(path)) {
    isNotFound = true

    metadata = {
      title: 'Page Not Found | Towasic Solutions',
      description: 'The page you are looking for could not be found.',
    }
  }

  // Prepare SEO values.
  const title = metadata.title || SITE_NAME
  const description = stripHtml(metadata.description || '')
  const fullTitle = withSuffix(title)

  const canonical =
    `${SITE_URL.replace(/\/$/, '')}${path === '/' ? '' : path}`

  const robots = isNotFound
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large'

  // Prefer the blog's featured image.
  // Otherwise use the shared static OG image.
  const actualImage = absoluteImageUrl(metadata.image)

  const ogImage =
    actualImage ||
    buildOgImageUrl({
      title: fullTitle,
      description,
      url: canonical,
    })

  // Only declare JPEG metadata for the static fallback image.
  const imageMetadata = actualImage
    ? ''
    : `
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    `

  // Generate the final metadata.
  const meta = `
    <title>${escapeHtml(fullTitle)}</title>

    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="${robots}" />

    <link rel="canonical" href="${escapeHtml(canonical)}" />

    <meta property="og:type" content="${escapeHtml(ogType)}" />
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta property="og:title" content="${escapeHtml(fullTitle)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />

    <meta property="og:image" content="${escapeHtml(ogImage)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(ogImage)}" />
    <meta property="og:image:alt" content="${escapeHtml(fullTitle)}" />

    ${imageMetadata}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@towasicsolution" />
    <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(ogImage)}" />
  `.trim()

  // Replace existing metadata to prevent duplicates.
  html = removeExistingSeoTags(html)

  if (html.includes('<!-- META_INJECTION_POINT -->')) {
    html = html.replace(
      '<!-- META_INJECTION_POINT -->',
      meta
    )
  } else if (html.includes('</head>')) {
    html = html.replace(
      '</head>',
      `${meta}\n</head>`
    )
  } else {
    return new Response('HTML head section not found', {
      status: 500,
    })
  }

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control':
        'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
      'X-Robots-Tag': robots,
      'Vary': 'User-Agent',
    },
  })
}