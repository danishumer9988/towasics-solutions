/* ============================================================
   Analytics tracking (client-side)
   - Reads consent from localStorage (set by CookieConsent)
   - Sends consent with every /track request
   ============================================================ */

import { ANALYTICS_URL } from '../config'

const VISITOR_KEY = 'tw_visitor_id'
const SESSION_KEY = 'tw_session_id'
const CONSENT_KEY = 'cookie_consent_v1'

/* ---------- id helpers ---------- */
const uid = (prefix) =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`

function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY)
  if (!id) {
    id = uid('v')
    localStorage.setItem(VISITOR_KEY, id)
  }
  return id
}

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id = uid('s')
    sessionStorage.setItem(SESSION_KEY, id)
  }
  return id
}

function getConsent() {
  const v = localStorage.getItem(CONSENT_KEY)
  if (v === 'accepted' || v === 'declined') return v
  return 'unknown'
}

/* ---------- core sender ---------- */
async function send(payload) {
  try {
    await fetch(`${ANALYTICS_URL}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: getVisitorId(),
        sessionId: getSessionId(),
        consent:   getConsent(),
        ...payload,
      }),
      keepalive: true,
    })
  } catch (_) {
    /* silent — never break the app for analytics */
  }
}

/* ---------- public API ---------- */
export function trackPageView() {
  const path = window.location.pathname + window.location.search
  send({
    type: 'pageview',
    url: window.location.href,
    path,
    title: document.title,
    referrer: document.referrer,
    screen:   { w: window.screen.width,  h: window.screen.height },
    viewport: { w: window.innerWidth,    h: window.innerHeight },
  })
}

export function trackClick(data) {
  send({ type: 'click', ...data })
}

/* Called by CookieConsent when the user picks an option */
export function setConsent(value) {
  localStorage.setItem(CONSENT_KEY, value)
}

/* ---------- click tracking ---------- */
let clickInitialized = false

export function initClickTracking() {
  if (clickInitialized) return
  clickInitialized = true

  document.addEventListener('click', (e) => {
    const el = e.target.closest('a, button, [role="button"]')
    if (!el) return

    const tag     = el.tagName.toLowerCase()
    const text    = (el.innerText || el.textContent || '').trim().slice(0, 60)
    const dest    = el.getAttribute('href') || el.dataset?.href || ''
    const path    = window.location.pathname

    trackClick({ path, element: tag.toUpperCase(), text, destination: dest })
  }, { capture: true })
}