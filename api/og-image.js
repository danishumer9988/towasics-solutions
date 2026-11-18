
export default function handler(req, res) {
  try {
    const host = req.headers.host || 'towasicsolutions.com';
    const imageUrl = `https://${host}/assets/og-image.png`;

    res.setHeader(
      'Cache-Control',
      'public, max-age=3600, s-maxage=86400'
    );

    res.setHeader('Location', imageUrl);
    res.statusCode = 302;
    res.end();
  } catch (error) {
    console.error('OG Image Error:', error);

    res.statusCode = 500;
    res.end('Failed to load OG image');
  }
}
