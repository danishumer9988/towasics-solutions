import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const CONSENT_KEY = 'cookie_consent_v1'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY)
    if (saved) return
    const t = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(t)
  }, [])

  /* Hide immediately if consent is accepted/declined elsewhere (e.g. form checkbox) */
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
    localStorage.setItem(CONSENT_KEY, decision)

    // Notify anything listening (analytics, etc.)
    window.dispatchEvent(
      new CustomEvent('towasic:consent-changed', { detail: { consent: decision } })
    )

    setVisible(false)

    // Immediately re-track the current page with the chosen consent.
    // Always send — the backend decides what to store:
    //   accepted → full Visitor record
    //   declined → SecurityLog only
    import('../lib/analytics').then((m) => {
      m.setConsent?.(decision)
      m.trackPageView?.()
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
              Towasic Solutions LLC uses cookies and similar tracking technologies to ensure proper functioning and security, improve your browsing experience, analyze traffic, and understand how visitors interact.
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