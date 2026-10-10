import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ANALYTICS_URL } from '../config'

const CONSENT_KEY = 'cookie_consent_v1'
const VISITOR_KEY = 'tw_visitor_id'
const SESSION_KEY = 'tw_session_id'

/* ---------- small helpers ---------- */
const getVisitorId = () => localStorage.getItem(VISITOR_KEY) || ''
const getSessionId = () => sessionStorage.getItem(SESSION_KEY) || ''

/* Fire a track request that survives the tab being closed.
   Uses sendBeacon when available, falls back to fetch with keepalive. */
function sendBeaconTrack(payload) {
  const body = JSON.stringify({
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    ...payload,
  })

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      const ok = navigator.sendBeacon(`${ANALYTICS_URL}/track`, blob)
      if (ok) return
    }
  } catch (_) { /* fall through */ }

  try {
    fetch(`${ANALYTICS_URL}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {})
  } catch (_) { /* ignore */ }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  /* Show banner only if the user has never chosen */
  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY)
    if (saved === 'accepted' || saved === 'declined') return
    const t = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(t)
  }, [])

  /* Hide immediately if consent is set elsewhere (e.g. a form checkbox) */
  useEffect(() => {
    const onConsent = (e) => {
      const decision = e?.detail?.consent
      if (decision === 'accepted' || decision === 'declined') {
        setVisible(false)
      }
    }
    window.addEventListener('towasic:consent-changed', onConsent)
    return () => window.removeEventListener('towasic:consent-changed', onConsent)
  }, [])

  const finish = (decision) => {
    /* 1. Persist consent FIRST so any subsequent read (tracker, exit beacon,
          analytics module) picks up the new value immediately. */
    localStorage.setItem(CONSENT_KEY, decision)

    /* 2. Notify the rest of the app (analytics lib listens, etc.) */
    window.dispatchEvent(
      new CustomEvent('towasic:consent-changed', { detail: { consent: decision } })
    )

    setVisible(false)

    /* 3. Send a fresh track request with the chosen consent.
          This creates the Visitor row (accepted) or the SecurityLog row
          (declined) on the backend, right now — no waiting for a route change.
          Uses sendBeacon so it survives even if the user closes the tab. */
    sendBeaconTrack({
      type: 'pageview',
      consent: decision,
      path: window.location.pathname + window.location.search,
      title: document.title,
      url: window.location.href,
      referrer: document.referrer,
      screen:   { w: window.screen.width,  h: window.screen.height },
      viewport: { w: window.innerWidth,    h: window.innerHeight },
    })
  }

  const handleAccept = () => finish('accepted')
  const handleDecline = () => finish('declined')

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9997] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)] border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 p-6 sm:p-7 items-center">

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2.5">
              Cookies &amp; Privacy at Towasic Solutions
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed">
              Towasic Solutions LLC uses cookies and similar tracking technologies to
              ensure proper functioning and security, improve your browsing experience,
              analyze traffic, and understand how visitors interact.
            </p>

            <p className="text-sm text-gray-600 leading-relaxed mt-3">
              By clicking <strong>“Accept All,”</strong> you consent to the use of
              essential and non-essential cookies and similar tracking technologies. By
              clicking <strong>“Decline All,”</strong> you reject all non-essential
              cookies and tracking technologies, including analytics cookies, web
              beacons, and tracking pixels. Strictly necessary technologies will remain
              active to keep our website secure, functional, and to remember your
              preferences.
            </p>

            <p className="text-sm text-gray-600 leading-relaxed mt-3">
              You can delete cookies and site data at any time through your browser
              settings. For more information about the data we collect, please review
              our{' '}
              <Link
                to="/privacy-policy"
                className="font-semibold text-[#0a85a7] underline underline-offset-2 hover:text-[#097390] transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 lg:w-[200px] lg:shrink-0">
            <button
              type="button"
              onClick={handleDecline}
              className="w-full py-3 rounded-xl font-semibold text-sm border-2 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Decline All
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-[#0a85a7] hover:bg-[#097390] transition"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}