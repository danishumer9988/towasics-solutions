import { useEffect, useState } from 'react'

const CONSENT_KEY = 'cookie_consent_v1'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY)
    if (saved) return
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
              Cookies &amp; Privacy at Trizic Solutions
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Trizic Solutions uses cookies and similar technologies to keep our
              website running smoothly and to understand how visitors use it.
              This may include collecting basic technical details such as your
              IP address, browser type, and the pages you view. The information
              helps us improve performance, measure traffic, and deliver a better
              browsing experience. You are free to accept or decline — either way,
              you can continue using our site without any restrictions.
            </p>
          </div>

          {/* ---------- Buttons ---------- */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 lg:w-[200px] lg:shrink-0">
            <button
              type="button"
              onClick={handleDecline}
              className="w-full py-3 rounded-xl font-semibold text-sm border-2 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-[#0a85a7] hover:bg-[#097390] transition"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}