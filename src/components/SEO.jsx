import { useEffect } from 'react'

const SITE_URL = 'https://towasicsolutions.com'
const SITE_NAME = 'Towasic Solutions'
const DEFAULT_IMAGE = `${SITE_URL}/assets/og-image.jpg`
const DEFAULT_DESCRIPTION =
  'Towasic Solutions — data scraping, intelligent automation, and super intelligence solutions that help businesses work smarter.'

/**
 * Reusable SEO component — updates <head> tags on route change.
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex = false,
  structuredData = null,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const canonical = `${SITE_URL}${path.startsWith('/') ? path : '/' + path}`
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`
  const finalDescription = description || DEFAULT_DESCRIPTION

  useEffect(() => {
    /* ---------- helpers ---------- */
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

    /* ---------- primary ---------- */
    document.title = fullTitle
    setMeta('name', 'description', finalDescription)
    setMeta(
      'name',
      'robots',
      noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
    )
    setLink('canonical', canonical)

    /* ---------- Open Graph ---------- */
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', finalDescription)
    setMeta('property', 'og:url', canonical)
    setMeta('property', 'og:image', imageUrl)
    setMeta('property', 'og:image:width', '1200')
    setMeta('property', 'og:image:height', '630')
    setMeta('property', 'og:image:alt', title || SITE_NAME)

    /* ---------- Twitter / X ---------- */
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:site', '@towasicsolution')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', finalDescription)
    setMeta('name', 'twitter:image', imageUrl)

    /* ---------- page-specific JSON-LD ---------- */
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
  }, [fullTitle, finalDescription, canonical, imageUrl, type, noIndex, structuredData])

  return null
}