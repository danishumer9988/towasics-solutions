import { useEffect, useState } from 'react'

const CONSENT_KEY = 'cookie_consent_v1'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY)
    if (saved) return // already chose — don't show again
    // Small delay so the page doesn't slam the popup immediately
    const t = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(t)
  }, [])

  const finish = (decision) => {
    localStorage.setItem(CONSENT_KEY, decision)
    setVisible(false)
  }

  const handleAccept = () => finish('accepted')
  const handleDecline = () => finish('declined')

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9997] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)] border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 p-6 sm:p-7 items-center">

          {/* ---------- Text ---------- */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2.5">
              Consent to Cookies &amp; Data Processing
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              On this website we use cookies and similar functions to process end
              device information and personal data (such as IP addresses or browser
              information). The processing is used for purposes such as to integrate
              content, external services and elements from third parties, statistical
              analysis, and measurement of site traffic. Depending on the function,
              data may be passed to third parties and processed by them.
            </p>
          </div>

          {/* ---------- Buttons ---------- */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 lg:w-[200px] lg:shrink-0">
            <button
              type="button"
              onClick={handleDecline}
              className="w-full py-3 rounded-xl font-semibold text-sm border-2 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Reject all
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-[#0a85a7] hover:bg-[#097390] transition"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}