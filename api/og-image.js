
import { ImageResponse } from '@vercel/og';

const LOGO_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);

    const title = (
      searchParams.get('title') || 'Towasic Solutions'
    ).substring(0, 90);

    const description = (
      searchParams.get('description') || 'Data Scraping & SI Automation'
    ).substring(0, 100);

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#0a85a7',
            padding: '60px',
            fontFamily: 'sans-serif',
          }}
        >
          <img
            src={LOGO_BASE64}
            width={250}
            height={250}
            style={{
              objectFit: 'contain',
              borderRadius: '20px',
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              marginLeft: '55px',
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.2,
                marginBottom: '24px',
              }}
            >
              {title}
            </div>

            <div
              style={{
                fontSize: 28,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.5,
              }}
            >
              {description}
            </div>

            <div
              style={{
                fontSize: 22,
                color: '#ffffff',
                marginTop: '45px',
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
      }
    );
  } catch (error) {
    console.error('OG Image Generation Error:', error);

    return new Response('Failed to generate image', {
      status: 500,
    });
  }
}
