import { useEffect } from 'react'
import {
  getMetadataForPath,
  buildOgImageUrl,
  withSuffix,
  SITE_URL,
  SITE_NAME,
} from '../lib/seo/metadata'

export default function SEO({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  noIndex = false,
  structuredData = null,
}) {
  const meta = getMetadataForPath(path, { title, description })
  const fullTitle = withSuffix(meta.title)
  const canonical = `${SITE_URL}${path.startsWith('/') ? path : '/' + path}`
  const finalDescription = meta.description || ''

  const STATIC_DEFAULTS = ['/assets/og-image.jpg', '/assets/og-image.png']
  const isStaticDefault = !image || STATIC_DEFAULTS.includes(image)

  const ogImageUrl = buildOgImageUrl({
    title: meta.title,
    description: meta.description,
    url: canonical,
  })

  const imageUrl = isStaticDefault ? ogImageUrl : image

  useEffect(() => {
    const setMeta = (attr, key, content) => {
      if (content === undefined || content === null || content === '') return
      let el = document.querySelector(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`)
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        document.head.appendChild(el)
      }
      el.setAttribute('href', href)
    }

    document.title = fullTitle
    setMeta('name', 'description', finalDescription)
    setMeta(
      'name',
      'robots',
      noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
    )
    setLink('canonical', canonical)

    setMeta('property', 'og:type', type)
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', finalDescription)
    setMeta('property', 'og:url', canonical)
    setMeta('property', 'og:image', imageUrl)
    setMeta('property', 'og:image:secure_url', imageUrl)
    setMeta('property', 'og:image:type', 'image/jpeg')
    setMeta('property', 'og:image:width', '1200')
    setMeta('property', 'og:image:height', '630')
    setMeta('property', 'og:image:alt', meta.title || SITE_NAME)

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
    noIndex,
    structuredData,
    meta.title,
  ])

  return null
}