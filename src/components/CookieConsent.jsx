import { useEffect, useState } from 'react'

const CONSENT_KEY = 'loc_consent_v1'
const COORDS_KEY  = 'loc_coords_v1'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [requesting, setRequesting] = useState(false)

  // On mount — reapply saved consent
  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY)
    if (saved === 'granted') {
      try {
        const coords = JSON.parse(localStorage.getItem(COORDS_KEY) || 'null')
        if (coords) window.__userGeo = coords
      } catch { /* ignore */ }
      return
    }
    if (saved === 'declined') return

    const t = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  const finish = (decision) => {
    localStorage.setItem(CONSENT_KEY, decision)
    setVisible(false)
    setRequesting(false)
  }

  const handleAllow = () => {
    if (!navigator.geolocation) return finish('declined')
    setRequesting(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }
        localStorage.setItem(COORDS_KEY, JSON.stringify(coords))
        window.__userGeo = coords
        finish('granted')
      },
      () => finish('declined'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    )
  }

  const handleDecline = () => {
    window.__userGeo = null
    finish('declined')
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-[9997]">
      <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)] border border-gray-100 p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#EEFAFD] flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-location-dot text-[#0a85a7]"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Allow location access?</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              We can show you more relevant content with your precise location.
              If you decline, we'll use approximate location from your IP address.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDecline}
            disabled={requesting}
            className="flex-1 py-2 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={handleAllow}
            disabled={requesting}
            className="flex-1 py-2 rounded-lg text-xs font-semibold text-white bg-[#0a85a7] hover:bg-[#097390] transition disabled:opacity-50"
          >
            {requesting ? 'Getting…' : 'Allow'}
          </button>
        </div>
      </div>
    </div>
  )
}