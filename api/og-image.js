// api/og-image.js
// Generates a 1200×630 Open Graph image for any page.
//
// Left side  → the actual Towasic Solutions logo from /assets/logo.png
// Right side → page title, page description, page URL
//
// This uses @vercel/og which renders JSX to PNG on the edge / serverless
// runtime — no headless browser required.

import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'nodejs20.x',
}

const SITE_URL = 'https://towasicsolutions.com'
const BRAND_PRIMARY = '#0a85a7'
const BRAND_DARK = '#086B87'
const BRAND_LIGHT = '#44D9E7'

/**
 * Load the Towasic Solutions logo once per invocation and return a data URI.
 * Returning null means "logo unavailable" — the caller renders a text-only
 * fallback so the share card is never broken.
 */
async function loadLogoDataUri() {
  try {
    // Prefer the production absolute URL so this works on both previews
    // and production deployments.
    const res = await fetch(`${SITE_URL}/assets/logo.png`, {
      // Let the CDN serve it fast
      cf: { cacheEverything: true, cacheTtl: 86400 },
    })
    if (!res.ok) return null
    const contentType = res.headers.get('content-type') || 'image/png'
    const arrayBuffer = await res.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    return `data:${contentType};base64,${base64}`
  } catch (err) {
    console.error('[og-image] Failed to load logo:', err)
    return null
  }
}

/** Truncate long text so it fits the card without an ellipsis running off-edge. */
function truncate(text, max) {
  if (!text) return ''
  const str = String(text).trim()
  return str.length <= max ? str : str.slice(0, max - 1).trimEnd() + '…'
}

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url)

    const title = truncate(
      searchParams.get('title') || 'Towasic Solutions',
      90
    )
    const description = truncate(searchParams.get('description') || '', 180)
    const pageUrl = truncate(searchParams.get('url') || SITE_URL, 80)

    const logoDataUri = await loadLogoDataUri()

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${BRAND_PRIMARY} 0%, ${BRAND_DARK} 100%)`,
            padding: '64px 80px',
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            position: 'relative',
          }}
        >
          {/* Decorative brand accent bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 8,
              background: `linear-gradient(90deg, ${BRAND_LIGHT} 0%, ${BRAND_PRIMARY} 100%)`,
            }}
          />

          {/* ---------- LEFT: Logo on white card ---------- */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 340,
              height: 340,
              background: '#ffffff',
              borderRadius: 32,
              padding: 32,
              boxShadow: '0 24px 60px -20px rgba(0,0,0,0.35)',
              marginRight: 64,
              flexShrink: 0,
            }}
          >
            {logoDataUri ? (
              <img
                src={logoDataUri}
                alt="Towasic Solutions"
                width={280}
                height={280}
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  color: BRAND_DARK,
                  textAlign: 'center',
                  lineHeight: 1.1,
                }}
              >
                Towasic
                <br />
                Solutions
              </div>
            )}
          </div>

          {/* ---------- RIGHT: Title + Description + URL ---------- */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              color: '#ffffff',
              minWidth: 0,
            }}
          >
            {/* Eyebrow */}
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: 4,
                textTransform: 'uppercase',
                color: BRAND_LIGHT,
                marginBottom: 24,
              }}
            >
              Towasic Solutions
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: title.length > 60 ? 42 : 52,
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: 24,
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              {title}
            </div>

            {/* Description */}
            {description && (
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 400,
                  lineHeight: 1.4,
                  color: 'rgba(255,255,255,0.85)',
                  marginBottom: 28,
                  display: 'flex',
                  flexWrap: 'wrap',
                }}
              >
                {description}
              </div>
            )}

            {/* URL pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 20,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: BRAND_LIGHT,
                }}
              />
              {pageUrl.replace(/^https?:\/\//, '')}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (err) {
    console.error('[og-image] Render failed:', err)
    // Last-resort fallback so a share never breaks
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: BRAND_PRIMARY,
            color: '#ffffff',
            fontSize: 64,
            fontWeight: 800,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Towasic Solutions
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }
}