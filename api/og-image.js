import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'edge',
}

async function getLogoDataUrl(requestUrl) {
  try {
    // This is the logo path already referenced by the site's Organization schema.
    const logoUrl = new URL('/assets/logo.png', requestUrl.origin)
    const response = await fetch(logoUrl)
    if (!response.ok) return null

    const contentType = response.headers.get('content-type') || 'image/png'
    if (!contentType.startsWith('image/')) return null

    const bytes = new Uint8Array(await response.arrayBuffer())
    // btoa is available in the Vercel Edge Runtime.
    let binary = ''
    for (let i = 0; i < bytes.length; i += 1) {
      binary += String.fromCharCode(bytes[i])
    }
    return `data:${contentType};base64,${btoa(binary)}`
  } catch (error) {
    console.error('Unable to load Towasic logo for OG image:', error)
    return null
  }
}

export default async function handler(request) {
  try {
    const requestUrl = new URL(request.url)
    const title = (requestUrl.searchParams.get('title') || 'Towasic Solutions').slice(0, 110)
    const description = (
      requestUrl.searchParams.get('description') ||
      'Web scraping, intelligent automation and technology solutions.'
    ).slice(0, 190)

    const logoDataUrl = await getLogoDataUrl(requestUrl)

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '58px',
            background: 'linear-gradient(135deg, #063b58 0%, #087d9b 58%, #0a85a7 100%)',
            color: '#ffffff',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <div
            style={{
              width: 245,
              height: 245,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ffffff',
              borderRadius: 28,
              padding: 24,
            }}
          >
            {logoDataUrl ? (
              <img
                src={logoDataUrl}
                width={197}
                height={197}
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  fontSize: 32,
                  fontWeight: 800,
                  color: '#086b87',
                  textAlign: 'center',
                }}
              >
                TOWASIC
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              marginLeft: 48,
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 3,
                color: '#b8f5ff',
                marginBottom: 20,
              }}
            >
              TOWASIC SOLUTIONS
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 49,
                fontWeight: 800,
                lineHeight: 1.12,
                marginBottom: 22,
                overflow: 'hidden',
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 25,
                fontWeight: 400,
                lineHeight: 1.35,
                color: '#e5faff',
              }}
            >
              {description}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 19,
                fontWeight: 600,
                marginTop: 30,
                color: '#ffffff',
              }}
            >
              towasicsolutions.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
      }
    )
  } catch (error) {
    console.error('OG Image Generation Error:', error)
    return new Response('Failed to generate OG image', { status: 500 })
  }
}
