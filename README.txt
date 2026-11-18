TOWASIC SOLUTIONS - OPEN GRAPH PATCH

Replace these files in the existing project with the matching files in this patch:

1. api/og-meta.js
2. api/og-image.js
3. index.html
4. src/components/SEO.jsx
5. vercel.json

IMPORTANT:
- Do NOT replace or edit src/lib/seo/metadata.js. It is intentionally unchanged.
- The OG image code attempts to load the real logo from:
  /assets/logo.png
  This is the same path already referenced by the site's Organization schema.
- The uploaded project archive did not include the public/assets folder, so verify that
  public/assets/logo.png exists in the real project. If your logo has another filename,
  update only the logo URL in api/og-image.js to its actual public path.
- Individual blog crawler metadata is fetched from the existing backend URL found in
  src/config.js: https://towasicbackend.vercel.app/api
- Run npm run build before deployment, then test each shared URL with crawler user agents.
