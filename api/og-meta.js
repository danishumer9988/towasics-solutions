import {
  getMetadataForPath,
  buildOgImageUrl,
  withSuffix,
  SITE_URL,
} from '../src/lib/seo/metadata.js'

export const config = {
  runtime: 'edge',
  matcher: '/((?!api|assets|favicon|robots\\.txt|sitemap\\.xml|_next|static).*)',
}

const CRAWLER_UA = [
  'facebookexternalhit', 'facebot', 'twitterbot', 'linkedinbot',
  'telegrambot', 'whatsapp', 'slackbot', 'discordbot', 'pinterest',
  'embedly', 'quora link preview', 'showyoubot', 'outbrain',
  'vkshare', 'w3c_validator', 'redditbot', 'applebot', 'googlebot',
  'bingbot', 'skypeuripreview', 'iframely', 'mastodon', 'google-inspectiontool'
]

function isCrawler(request) {
  const ua = (request.headers.get('user-agent') || '').toLowerCase()
  return CRAWLER_UA.some((bot) => ua.includes(bot.toLowerCase()))
}

function escapeHtml(str = '') {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

export default async function handler(request) {
  if (!isCrawler(request)) {
    return fetch(request)
  }

  const url = new URL(request.url)

  // Extract path passed from vercel.json (e.g. /contactus)
  let path = url.searchParams.get('path') || '/'
  // Clean up double slashes if vercel passed //contactus
  path = path.replace(/^\/\//, '/')
  if (path === '') path = '/'

  const indexResponse = await fetch(new URL('/index.html', url.origin))
  let html = await indexResponse.text()

  const { title, description } = getMetadataForPath(path)
  const fullTitle = withSuffix(title)
  const canonical = `${SITE_URL}${path === '/' ? '' : path}`

  // Full HTTPS URL for the dynamic image
  const ogImage = buildOgImageUrl({ title, description, url: canonical })

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

  html = html.replace('<!-- META_INJECTION_POINT -->', meta)
  html = html.replace(/<title>[^<]*<\/title>/i, '')

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
    },
  })
}