import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import ConsentCheckbox from './ConsentCheckbox'
import { acceptConsent } from '../lib/consent'

/* ============================================================
   Free Estimate Popup — Towasic original design
   - Auto-opens after 60s on public pages (once per session)
   - Single-column stacked layout (heading top, form below)
   - 2,000-word limit on the project description
   - Posts to POST /estimates
   ============================================================ */

const SHOW_AFTER_MS = 20 * 1000
const SESSION_KEY   = 'tw_estimate_popup_v1'
const MAX_WORDS     = 2000

const countWords = (str) =>
  (str || '').trim().split(/\s+/).filter(Boolean).length

export default function EstimatePopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [consented, setConsented] = useState(false)

  /* ---------- Auto-open timer (once per session) ---------- */
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(SESSION_KEY) === 'true') return

    const t = setTimeout(() => {
      setIsOpen(true)
      sessionStorage.setItem(SESSION_KEY, 'true')
    }, SHOW_AFTER_MS)

    return () => clearTimeout(t)
  }, [])

  /* ---------- Trigger entrance animation after mount ---------- */
  useEffect(() => {
    if (!isOpen) return
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [isOpen])

  /* ---------- Escape + body scroll lock ---------- */
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') close() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  const close = () => {
    setMounted(false)
    setTimeout(() => {
      setIsOpen(false)
      setStatus({ type: '', message: '' })
    }, 180)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'message' && countWords(value) > MAX_WORDS) return
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', message: '' })

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all fields.' })
      return
    }

    if (!consented) {
      setStatus({ type: 'error', message: 'Please accept the Privacy Policy to continue.' })
      return
    }

    // Accept cookies if the user ticked the consent box
    acceptConsent()

    setSubmitting(true)
    try {
      await axios.post(`${API_BASE_URL}/estimates`, {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      })

      setStatus({
        type: 'success',
        message: "Thanks! We'll get back to you within 48 hours.",
      })
      setForm({ name: '', email: '', message: '' })
      setConsented(false)
      setTimeout(() => close(), 2200)
    } catch (err) {
      console.error(err)
      setStatus({
        type: 'error',
        message: 'Something went wrong. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  const wordCount = countWords(form.message)
  const nearLimit = wordCount >= MAX_WORDS * 0.9

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6
        transition-opacity duration-200
        ${mounted ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: 'rgba(8, 30, 38, 0.55)', backdropFilter: 'blur(6px)' }}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Request a free ballpark figure"
    >
      {/* ---------- Card ---------- */}
      <div
        className={`relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden
          transition-all duration-300 ease-out
          ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}
        style={{
          boxShadow: '0 24px 60px -20px rgba(8, 107, 135, 0.35), 0 0 0 1px rgba(10, 133, 167, 0.06)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---------- Top accent bar ---------- */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#0a85a7] via-[#1AA7AD] to-[#44D9E7]" />

        {/* ---------- Close ---------- */}
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center rounded-full
            text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {/* ---------- Body ---------- */}
        <div className="px-8 sm:px-12 pt-10 pb-9">
          {/* ---------- Header: icon + heading + bullet ---------- */}
          <div className="mb-8">
            <div className="flex items-start gap-5 mb-6">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0a85a7] to-[#086B87] flex items-center justify-center shadow-lg shadow-[#0a85a7]/25">
                  <i className="fa-solid fa-calculator text-white text-2xl"></i>
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#44D9E7] border-2 border-white" />
              </div>

              <div className="flex-1 min-w-0 pt-1">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#086B87] leading-tight font-inter">
                  Would you like a Free Ballpark Figure for your project?
                </h2>
              </div>
            </div>

            {/* ---------- Bullet point ---------- */}
            <ul className="ml-1 space-y-2 font-inter">
              <li className="flex items-center gap-2.5 text-sm sm:text-base text-gray-600">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#0a85a7]" />
                Get it in 48 hours.
              </li>
            </ul>
          </div>

          {/* ---------- Form ---------- */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                icon="fa-user"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
              />
              <Field
                icon="fa-envelope"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
              />
            </div>

            <div className="relative">
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                placeholder="Describe your project, summary, objectives, and timeline…"
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm sm:text-base text-gray-800 placeholder-gray-400
                  focus:outline-none focus:border-[#0a85a7] focus:ring-4 focus:ring-[#0a85a7]/10
                  transition resize-none font-inter"
              />
              <span
                className={`absolute bottom-3 right-4 text-[11px] font-inter tabular-nums transition-colors ${
                  nearLimit ? 'text-amber-500' : 'text-gray-400'
                }`}
              >
                {wordCount.toLocaleString()} / {MAX_WORDS.toLocaleString()} words
              </span>
            </div>

            {/* ---------- Consent ---------- */}
            <ConsentCheckbox checked={consented} onChange={setConsented} />

            {/* ---------- Status ---------- */}
            {status.message && (
              <div
                className={`flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm font-medium font-inter
                  ${status.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-red-50 text-red-600 border border-red-100'}`}
              >
                <i className={`fa-solid ${status.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} mt-0.5`}></i>
                <span>{status.message}</span>
              </div>
            )}

            {/* ---------- CTA ---------- */}
            <button
              type="submit"
              disabled={submitting}
              className="group w-full py-4 rounded-xl font-semibold text-sm sm:text-base text-white font-inter
                bg-[#0a85a7] hover:bg-[#097390]
                shadow-md shadow-[#0a85a7]/25 hover:shadow-lg hover:shadow-[#0a85a7]/30
                transition-all
                disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
                inline-flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Sending…
                </>
              ) : (
                <>
                  Send Request
                  <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-0.5"></i>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Small sub-components ---------------- */

function Field({ icon, name, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="relative">
      <i className={`fa-solid ${icon} absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none`}></i>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-sm sm:text-base text-gray-800 placeholder-gray-400
          focus:outline-none focus:border-[#0a85a7] focus:ring-4 focus:ring-[#0a85a7]/10
          transition font-inter"
      />
    </div>
  )
}