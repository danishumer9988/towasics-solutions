// src/lib/consent.js
export const CONSENT_KEY = 'cookie_consent_v1'

/**
 * Accepts cookies programmatically (used by form checkboxes).
 * Mirrors what the CookieConsent banner does on "Accept All".
 */
export function acceptConsent() {
  try {
    if (typeof window === 'undefined') return

    localStorage.setItem(CONSENT_KEY, 'accepted')

    window.dispatchEvent(
      new CustomEvent('towasic:consent-changed', {
        detail: { consent: 'accepted' },
      })
    )

    // Keep analytics in sync (same behaviour as the banner)
    import('./analytics')
      .then((m) => {
        m.setConsent?.('accepted')
        m.trackPageView?.()
      })
      .catch(() => {})
  } catch {
    /* ignore (private mode, etc.) */
  }
}