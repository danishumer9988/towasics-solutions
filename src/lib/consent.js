// src/lib/consent.js
import { recordConsent } from './analytics'

export { CONSENT_KEY } from './analytics'

/**
 * Called when the user ticks the consent checkbox in a form.
 *
 * - never chose        -> becomes accepted
 * - declined before    -> becomes accepted (moves to the accepted table)
 * - already accepted   -> nothing happens
 *
 * recordConsent() does all of this and informs the server.
 */
export function acceptConsent() {
  try {
    recordConsent('accepted')
  } catch {
    /* ignore (private mode, etc.) */
  }
}