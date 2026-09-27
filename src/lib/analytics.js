import { ANALYTICS_URL } from '../config'

const VKEY = 'an_vid'
const SKEY = 'an_sid'
const STS  = 'an_sid_ts'
const TTL  = 30 * 60 * 1000
const DISABLED = !ANALYTICS_URL || typeof window === 'undefined'

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
    try {
      if (navigator.sendBeacon) navigator.sendBeacon(url, json)
    } catch { /* noop */ }
  }
}

const getClientGeo = () => {
  try {
    const coords = JSON.parse(localStorage.getItem('loc_coords_v1') || 'null')
    return coords || null
  } catch {
    return null
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
    clientGeo: window.__userGeo || getClientGeo() || null,
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

let bound = false
export const initClickTracking = () => {
  if (DISABLED || bound) return
  bound = true

  document.addEventListener('click', (e) => {
    let el = e.target
    if (!el || typeof el.closest !== 'function') el = el?.parentElement
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