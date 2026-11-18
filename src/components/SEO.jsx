import { useEffect } from 'react'
import {
  getMetadataForPath,
  buildOgImageUrl,
  withSuffix,
  SITE_URL,
  SITE_NAME,
  STATIC_ROUTES,
} from '../lib/seo/metadata'

function normalizePath(path = '/') {
  let value = String(path || '/').split('?')[0].split('#')[0]
  if (!value.startsWith('/')) value = `/${value}`
  if (value.length > 1 && value.endsWith('/')) value = value.slice(0, -1)
  return value || '/'
}

export default function SEO({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  noIndex = false,
  structuredData = null,
}) {
  const normalizedPath = normalizePath(path)
  const isStaticMetadataRoute = Object.prototype.hasOwnProperty.call(STATIC_ROUTES, normalizedPath)

  // Static public pages always use metadata.js as the source of truth.
  // Dynamic blog/service detail pages may supply their fetched database data.
  const meta = isStaticMetadataRoute
    ? getMetadataForPath(normalizedPath)
    : getMetadataForPath(normalizedPath, { title, description })

  const fullTitle = withSuffix(meta.title)
  const canonical = `${SITE_URL}${normalizedPath === '/' ? '' : normalizedPath}`
  const finalDescription = meta.description || ''
  const staticDefaultImages = ['/assets/og-image.jpg', '/assets/og-image.png']
  const isStaticDefault = !image || staticDefaultImages.includes(image)

  const generatedOgImage = buildOgImageUrl({
    title: meta.title,
    description: finalDescription,
    url: canonical,
  })

  let imageUrl = isStaticDefault ? generatedOgImage : image
  if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
    imageUrl = new URL(imageUrl, SITE_URL).toString()
  }

  const isAdminPath =
    normalizedPath.startsWith('/admin') ||
    normalizedPath.startsWith('/dashboard') ||
    normalizedPath.startsWith('/auth') ||
    normalizedPath.startsWith('/subscriptions') ||
    normalizedPath.startsWith('/addfaq')

  const shouldNoIndex = noIndex || isAdminPath

  useEffect(() => {
    const setMeta = (attribute, key, content) => {
      if (content === undefined || content === null || content === '') return
      const selector = `meta[${attribute}="${key}"]`
      let element = document.head.querySelector(selector)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, key)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    const setLink = (rel, href) => {
      let element = document.head.querySelector(`link[rel="${rel}"]`)
      if (!element) {
        element = document.createElement('link')
        element.setAttribute('rel', rel)
        document.head.appendChild(element)
      }
      element.setAttribute('href', href)
    }

    document.title = fullTitle
    setMeta('name', 'description', finalDescription)
    setMeta(
      'name',
      'robots',
      shouldNoIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
    )
    setLink('canonical', canonical)

    setMeta('property', 'og:type', type)
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', finalDescription)
    setMeta('property', 'og:url', canonical)
    setMeta('property', 'og:image', imageUrl)
    setMeta('property', 'og:image:secure_url', imageUrl)
    setMeta('property', 'og:image:type', 'image/png')
    setMeta('property', 'og:image:width', '1200')
    setMeta('property', 'og:image:height', '630')
    setMeta('property', 'og:image:alt', `${fullTitle} — ${SITE_NAME}`)

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:site', '@towasicsolution')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', finalDescription)
    setMeta('name', 'twitter:image', imageUrl)

    let script = document.getElementById('seo-jsonld-page')
    if (structuredData) {
      if (!script) {
        script = document.createElement('script')
        script.id = 'seo-jsonld-page'
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(structuredData)
    } else if (script) {
      script.remove()
    }
  }, [
    fullTitle,
    finalDescription,
    canonical,
    imageUrl,
    type,
    shouldNoIndex,
    structuredData,
  ])

  return null
}
