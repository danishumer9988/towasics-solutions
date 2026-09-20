import { ANALYTICS_URL } from '../config'

const VKEY = 'an_vid'
const SKEY = 'an_sid'
const STS  = 'an_sid_ts'
const TTL  = 30 * 60 * 1000 // 30 min session window
const DISABLED = !ANALYTICS_URL || typeof window === 'undefined'

const uuid = () =>
  (crypto?.randomUUID?.()) ||
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

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
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([json], { type: 'application/json' }))
      return
    }
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
      keepalive: true,
    }).catch(() => {})
  } catch { /* noop */ }
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

let bound = false
export const initClickTracking = () => {
  if (DISABLED || bound) return
  bound = true

  document.addEventListener('click', (e) => {
    const el = e.target.closest('a, button, [data-track]')
    if (!el) return
    const href = el.getAttribute?.('href') || ''
    if (href.startsWith('javascript:')) return

    trackEvent('click', {
      element: el.tagName.toLowerCase(),
      text: (el.innerText || el.textContent || '').trim().slice(0, 80),
      destination: href,
    })
  }, { capture: true })
}