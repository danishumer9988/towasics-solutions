import { ImageResponse } from '@vercel/og'

const LOGO_URL = 'https://towasicsolutions.com/assets/logo.png'
const SITE_URL_FALLBACK = 'https://towasicsolutions.com'
const BRAND_COLOR = '#0a85a7'

function truncate(text, maxLength) {
  if (!text) return ''
  const value = String(text).trim()
  if (value.length <= maxLength) return value
  const sliced = value.slice(0, maxLength - 1)
  const lastSpace = sliced.lastIndexOf(' ')
  const clean =
    lastSpace > maxLength * 0.6 ? sliced.slice(0, lastSpace) : sliced
  return clean.trimEnd() + '…'
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(
      null,
      bytes.subarray(i, i + chunkSize)
    )
  }
  return Buffer.from(binary, 'binary').toString('base64')
}

async function fetchLogoDataUrl() {
  try {
    const res = await fetch(LOGO_URL, {
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) return null
    const buffer = await res.arrayBuffer()
    const contentType = res.headers.get('content-type') || 'image/png'
    return `data:${contentType};base64,${arrayBufferToBase64(buffer)}`
  } catch (error) {
    console.error('Logo fetch failed:', error)
    return null
  }
}

export default async function handler(req, res) {
  try {
    const title = truncate(
      req.query.title || 'Towasic Solutions',
      100
    )
    const description = truncate(
      req.query.description || '',
      150
    )
    const siteUrl = req.query.url || SITE_URL_FALLBACK

    const logoSrc = await fetchLogoDataUrl()

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            backgroundImage:
              'linear-gradient(135deg, #ffffff 0%, #e6f5f9 100%)',
            padding: '60px 70px',
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 30,
            }}
          >
            {logoSrc ? (
              <img
                src={logoSrc}
                height="80"
                style={{ height: 80, width: 'auto', objectFit: 'contain' }}
              />
            ) : (
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  color: BRAND_COLOR,
                  letterSpacing: '-0.02em',
                }}
              >
                Towasic Solutions
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: 50,
                fontWeight: 700,
                color: '#0a2540',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                marginBottom: 18,
              }}
            >
              {title}
            </div>
            {description ? (
              <div
                style={{
                  fontSize: 24,
                  color: '#475569',
                  lineHeight: 1.4,
                }}
              >
                {description}
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 22,
              color: BRAND_COLOR,
              fontWeight: 600,
              marginTop: 20,
            }}
          >
            {siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )

    const buffer = Buffer.from(await imageResponse.arrayBuffer())

    res.setHeader('Content-Type', 'image/png')
    res.setHeader(
      'Cache-Control',
      'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'
    )
    res.status(200).end(buffer)
  } catch (error) {
    console.error('OG image error:', error)
    res.status(500).end('Failed to generate OG image')
  }
}