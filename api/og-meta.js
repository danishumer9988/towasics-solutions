// api/og-meta.js
// Vercel Edge Function — injects per-route OG/Twitter tags into the static
// index.html for social-media crawlers. Regular browsers are passed through
// to the normal Vite SPA build.

import {
  getMetadataForPath,
  buildOgImageUrl,
  withSuffix,
  SITE_URL,
} from '../src/lib/seo/metadata.js'

export const config = {
  runtime: 'edge',
  matcher:
    '/((?!api|assets|favicon|robots\\.txt|sitemap\\.xml|_next|static).*)',
}

const CRAWLER_UA = [
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'telegrambot',
  'whatsapp',
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
]

function isCrawler(request) {
  const ua = (request.headers.get('user-agent') || '').toLowerCase()
  return CRAWLER_UA.some((bot) => ua.includes(bot))
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export default async function handler(request) {
  // 1. Regular browsers → serve the normal index.html unchanged
  if (!isCrawler(request)) {
    return fetch(request)
  }

  // 2. Load the built index.html
  const url = new URL(request.url)
  const indexResponse = await fetch(new URL('/index.html', url.origin))
  let html = await indexResponse.text()

  // 3. Resolve metadata for this route
  const pathname =
    url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '')
  const { title, description } = getMetadataForPath(pathname)
  const fullTitle = withSuffix(title)
  const canonical = `${SITE_URL}${pathname === '/' ? '' : pathname}`
  const ogImage = buildOgImageUrl({ title, description, url: canonical })

  // 4. Build the full meta block
  const meta = `
    <title>${escapeHtml(fullTitle)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Towasic Solutions" />
    <meta property="og:title" content="${escapeHtml(fullTitle)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:image" content="${escapeHtml(ogImage)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(ogImage)}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@towasicsolution" />
    <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(ogImage)}" />
  `.trim()

  // 5. Replace the placeholder injected into index.html
  html = html.replace('<!-- META_INJECTION_POINT -->', meta)

  // 6. Remove the static <title> so we don't emit two of them
  html = html.replace(/<title>[^<]*<\/title>/i, '')

  // 7. Serve the rewritten HTML with short CDN caching
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control':
        'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
    },
  })
}