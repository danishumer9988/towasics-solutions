import { ANALYTICS_URL } from '../config'

const VKEY = 'an_vid'
const SKEY = 'an_sid'
const STS  = 'an_sid_ts'
const TTL  = 30 * 60 * 1000 // 30 min session window
const DISABLED = !ANALYTICS_URL || typeof window === 'undefined'

/* Short 16-char ID instead of 36-char UUID → saves ~40 bytes per row × 4 collections */
const uuid = () =>
  (crypto?.randomUUID?.().replace(/-/g, '').slice(0, 16)) ||
  'xxxxxxxxxxxxxxxx'.replace(/x/g, () => ((Math.random() * 16) | 0).toString(16))

const visitorId = () => {
  let v = localStorage.getItem(VKEY)
  if (!v) { v = uuid(); localStorage.setItem(VKEY, v) }
  return v
}

const sessionId = () => {
  const now = Date.now()
  const last = Number(sessionStorage.getItem(STS) || 0)
  let s = sessionStorage.getItem(SKEY)
  if (!s || now - last > TTL) {
    s = uuid()
    sessionStorage.setItem(SKEY, s)
  }
  sessionStorage.setItem(STS, String(now))
  return s
}

/* ------------------------------------------------------------
   Reliable cross-origin post:
   - fetch + keepalive (survives unload, unlike sendBeacon w/ JSON)
   - falls back to text/plain beacon only if fetch throws
   ------------------------------------------------------------ */
const post = (body) => {
  if (DISABLED) return
  const url = `${ANALYTICS_URL}/track`
  const json = JSON.stringify(body)

  try {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
      keepalive: true,
      mode: 'cors',
      credentials: 'omit',
    }).catch(() => {})
  } catch {
    // Last-ditch: fire-and-forget beacon (some very old browsers)
    try {
      if (navigator.sendBeacon) navigator.sendBeacon(url, json)
    } catch { /* noop */ }
  }
}

export const trackPageView = () => {
  post({
    type: 'pageview',
    visitorId: visitorId(),
    sessionId: sessionId(),
    url: window.location.href,
    path: window.location.pathname,
    title: document.title,
    referrer: document.referrer || '',
    screen:   { w: window.screen.width, h: window.screen.height },
    viewport: { w: window.innerWidth,   h: window.innerHeight },
  })
}

export const trackEvent = (type, data = {}) => {
  post({
    type,
    visitorId: visitorId(),
    sessionId: sessionId(),
    path: window.location.pathname,
    url: window.location.href,
    ...data,
  })
}

/* ------------------------------------------------------------
   Click tracking — bound once, capture-phase, robust to
   text-node targets, React Links, and dynamically added elements
   ------------------------------------------------------------ */
let bound = false
export const initClickTracking = () => {
  if (DISABLED || bound) return
  bound = true

  document.addEventListener('click', (e) => {
    // Walk up from whatever was clicked until we hit a trackable node
    let el = e.target
    if (!el || typeof el.closest !== 'function') {
      el = el?.parentElement
    }
    const target = el?.closest?.('a, button, [data-track]')
    if (!target) return

    const href = target.getAttribute?.('href') || ''
    if (href.startsWith('javascript:')) return

    const text = (target.innerText || target.textContent || '').trim().slice(0, 60)

    trackEvent('click', {
      element: target.tagName.toLowerCase(),
      text,
      destination: href,
    })
  }, { capture: true })
}