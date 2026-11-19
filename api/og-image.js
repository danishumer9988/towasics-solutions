
export default function handler(req, res) {
  try {
    const imageUrl = 'https://towasicsolutions.com/assets/logo.png'

    res.setHeader(
      'Cache-Control',
      'public, max-age=3600, s-maxage=86400'
    )

    res.setHeader('Location', imageUrl)
    res.statusCode = 302
    res.end()
  } catch (error) {
    console.error('OG Image Error:', error)
    res.statusCode = 500
    res.end('Failed to load OG image')
  }
}
