import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'edge',
}

// 🛑 REPLACE THIS WITH YOUR BASE64 LOGO
const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = (searchParams.get('title') || 'Towasic Solutions').substring(0, 90)
    const description = (searchParams.get('description') || 'Data Scraping & SI Automation').substring(0, 100)

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
            padding: '60px',
            fontFamily: 'sans-serif',
          }}
        >
          <img
            src={LOGO_BASE64}
            width={180}
            height={180}
            style={{ objectFit: 'contain', marginBottom: '40px', borderRadius: '20px' }}
          />
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
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.85)',
              textAlign: 'center',
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
    console.error(e)
    return new Response('Failed to generate image', { status: 500 })
  }
}