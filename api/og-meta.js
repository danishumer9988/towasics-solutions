// api/og-image.js
import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'nodejs20.x',
}

const SITE_URL = 'https://towasicsolutions.com'
const BRAND_PRIMARY = '#0a85a7'
const BRAND_DARK = '#086B87'
const BRAND_LIGHT = '#44D9E7'

function truncate(text, max) {
  if (!text) return ''
  const str = String(text).trim()
  return str.length <= max ? str : str.slice(0, max - 1).trimEnd() + '…'
}

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url)

    const title = truncate(searchParams.get('title') || 'Towasic Solutions', 90)
    const description = truncate(searchParams.get('description') || '', 180)
    const pageUrl = truncate(searchParams.get('url') || SITE_URL, 80)

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
            fontFamily: 'Inter, sans-serif',
            position: 'relative',
          }}
        >
          {/* Accent bar */}
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

          {/* LEFT: Favicon (Fetches directly from your site) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 320,
              height: 320,
              background: '#ffffff',
              borderRadius: 24,
              padding: 24,
              marginRight: 64,
              flexShrink: 0,
            }}
          >
            <img
              src={`${SITE_URL}/assets/favicon.png`} // 🔥 CHANGED TO FAVICON
              alt="Towasic Solutions Logo"
              width={240} // Made slightly larger since favicons usually have built-in padding
              height={240}
              style={{ objectFit: 'contain', borderRadius: 16 }}
            />
          </div>

          {/* RIGHT: Content */}
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
        format: 'jpeg', // 🔥 Keeps it under the 300KB limit
        quality: 80,
      }
    )
  } catch (err) {
    console.error('[og-image] Render failed:', err)
    return new Response('Failed to generate image', { status: 500 })
  }
}