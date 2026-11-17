import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'edge',
}

// 🛑 REPLACE THIS WITH YOUR ACTUAL BASE64 STRING
// (It must start with data:image/png;base64,...)
// Example placeholder 1x1 pixel:
const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

function truncate(text, max) {
  if (!text) return ''
  const str = String(text).trim()
  return str.length <= max ? str : str.slice(0, max - 1).trimEnd() + '…'
}

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url)

    const title = truncate(searchParams.get('title') || 'Towasic Solutions', 90)
    const description = truncate(searchParams.get('description') || 'Data Scraping & SI Automation', 100)

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a85a7',
            padding: '60px', // 60px safe margin
            fontFamily: 'sans-serif',
          }}
        >
          {/* Logo at the top */}
          <img
            src={LOGO_BASE64}
            width={180}
            height={180}
            style={{
              objectFit: 'contain',
              marginBottom: '40px',
              borderRadius: '20px'
            }}
          />

          {/* Title (Max 2 lines) */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.2,
              marginBottom: '20px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </div>

          {/* Short Tagline */}
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.85)',
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        format: 'png',
      }
    )
  } catch (e) {
    console.error('[og-image] Render failed:', e)
    // Fail-safe: Return a valid image even if the logo base64 is broken
    return new ImageResponse(
      (
        <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a85a7', color: 'white', fontSize: 72, fontWeight: 'bold' }}>
          Towasic Solutions
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }
}