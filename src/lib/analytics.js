/* ============================================================
   Analytics tracking (client-side)

   Rules
   - accepted : every pageview + click is sent (full tracking)
   - declined : only pageviews are sent (backend keeps 5 fields)
   - unknown  : NOTHING is sent while the user is on the site.
                One 'exit' signal is sent when the tab is closed.
   - accepted is final: it is never changed back to declined.

   Everything that changes consent (banner, forms) must go
   through recordConsent() so there is only one code path.
   ============================================================ */

import { ANALYTICS_URL } from '../config'

const VISITOR_KEY = 'tw_visitor_id'
const SESSION_KEY = 'tw_session_id'
export const CONSENT_KEY = 'cookie_consent_v1'

/* Time this visit started (used for start time of declined / unknown) */
const PAGE_START = Date.now()

/* ---------- safe storage (private mode can throw) ---------- */
const memory = {}

function readLocal(key) {
  try { return localStorage.getItem(key) } catch (_) { return memory[key] || null }
}
function writeLocal(key, value) {
  try { localStorage.setItem(key, value) } catch (_) { memory[key] = value }
}
function readSession(key) {
  try { return sessionStorage.getItem(key) } catch (_) { return memory['s:' + key] || null }
}
function writeSession(key, value) {
  try { sessionStorage.setItem(key, value) } catch (_) { memory['s:' + key] = value }
}

/* ---------- id helpers ---------- */
const uid = (prefix) =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`

export function getVisitorId() {
  let id = readLocal(VISITOR_KEY)
  if (!id) {
    id = uid('v')
    writeLocal(VISITOR_KEY, id)
  }
  return id
}

export function getSessionId() {
  let id = readSession(SESSION_KEY)
  if (!id) {
    id = uid('s')
    writeSession(SESSION_KEY, id)
  }
  return id
}

export function getConsent() {
  const v = readLocal(CONSENT_KEY)
  if (v === 'accepted' || v === 'declined') return v
  return 'unknown'
}

/* ---------- core sender ---------- */
async function send(payload) {
  /* always create the ids, even if we do not send anything */
  const visitorId = getVisitorId()
  const sessionId = getSessionId()
  const consent = getConsent()

  /* unknown: stay silent until the tab closes */
  if (consent === 'unknown') return
  /* declined: only pageviews matter (5 fields on the server) */
  if (consent === 'declined' && payload.type !== 'pageview') return

  try {
    await fetch(`${ANALYTICS_URL}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        sessionId,
        consent,
        startedAt: PAGE_START,
        ...payload,
      }),
      keepalive: true,
    })
  } catch (_) {
    /* silent: never break the app for analytics */
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

/* ============================================================
   CONSENT (single entry point: banner + forms)
   - accepted is final, it can never be replaced
   - declined -> accepted is allowed (e.g. user ticks a form box)
   - sends the new choice to the server immediately
   ============================================================ */
export function recordConsent(decision) {
  if (decision !== 'accepted' && decision !== 'declined') return false

  const current = getConsent()
  if (current === 'accepted') return false      // accepted never changes
  if (current === decision) return false        // nothing to do

  writeLocal(CONSENT_KEY, decision)

  /* lets the banner hide itself */
  window.dispatchEvent(
    new CustomEvent('towasic:consent-changed', { detail: { consent: decision } })
  )

  /* tell the server right now */
  trackPageView()
  return true
}

/* kept for older imports */
export function setConsent(value) {
  recordConsent(value)
}

/* ---------- click tracking ---------- */
let clickInitialized = false

export function initClickTracking() {
  if (clickInitialized) return
  clickInitialized = true

  document.addEventListener('click', (e) => {
    const el = e.target.closest('a, button, [role="button"]')
    if (!el) return

    const tag  = el.tagName.toLowerCase()
    const text = (el.innerText || el.textContent || '').trim().slice(0, 60)
    const dest = el.getAttribute('href') || el.dataset?.href || ''
    const path = window.location.pathname

    trackClick({ path, element: tag.toUpperCase(), text, destination: dest })
  }, { capture: true })
}

/* ============================================================
   EXIT TRACKING
   Only 'pagehide' (the tab / page is really going away).
   NOT visibilitychange or beforeunload: those also fire when
   the user switches tabs or refreshes, which created the fake
   "unknown" rows.

   Sent only while consent is still unknown. Uses a text/plain
   beacon so the browser never needs a CORS preflight.
   ============================================================ */
let exitInitialized = false
let exitFired = false

function sendExitSignal() {
  const body = JSON.stringify({
    type:      'exit',
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    consent:   'unknown',
    path:      window.location.pathname,
    startedAt: PAGE_START,
  })
  const url = `${ANALYTICS_URL}/track`

  try {
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon(url, new Blob([body], { type: 'text/plain' }))
      if (ok) return
    }
  } catch (_) { /* fall through */ }

  try {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body,
      keepalive: true,
    }).catch(() => {})
  } catch (_) { /* ignore */ }
}

export function initExitTracking() {
  if (exitInitialized) return
  exitInitialized = true

  window.addEventListener('pagehide', () => {
    if (exitFired) return
    if (getConsent() !== 'unknown') return
    exitFired = true
    sendExitSignal()
  })

  /* page restored from the back/forward cache: allow a new exit */
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) exitFired = false
  })
}