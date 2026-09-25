import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { API_BASE_URL } from '../config'

const countries = [
  { name: 'United States', short: 'US', code: '+1' },
  { name: 'Afghanistan', short: 'AF', code: '+93' },
  { name: 'Albania', short: 'AL', code: '+355' },
  { name: 'Algeria', short: 'DZ', code: '+213' },
  { name: 'Argentina', short: 'AR', code: '+54' },
  { name: 'Australia', short: 'AU', code: '+61' },
  { name: 'Austria', short: 'AT', code: '+43' },
  { name: 'Bangladesh', short: 'BD', code: '+880' },
  { name: 'Belgium', short: 'BE', code: '+32' },
  { name: 'Brazil', short: 'BR', code: '+55' },
  { name: 'Canada', short: 'CA', code: '+1' },
  { name: 'China', short: 'CN', code: '+86' },
  { name: 'Egypt', short: 'EG', code: '+20' },
  { name: 'France', short: 'FR', code: '+33' },
  { name: 'Germany', short: 'DE', code: '+49' },
  { name: 'India', short: 'IN', code: '+91' },
  { name: 'Indonesia', short: 'ID', code: '+62' },
  { name: 'Italy', short: 'IT', code: '+39' },
  { name: 'Japan', short: 'JP', code: '+81' },
  { name: 'Mexico', short: 'MX', code: '+52' },
  { name: 'Netherlands', short: 'NL', code: '+31' },
  { name: 'Pakistan', short: 'PK', code: '+92' },
  { name: 'Qatar', short: 'QA', code: '+974' },
  { name: 'Saudi Arabia', short: 'SA', code: '+966' },
  { name: 'Spain', short: 'ES', code: '+34' },
  { name: 'United Arab Emirates', short: 'AE', code: '+971' },
  { name: 'United Kingdom', short: 'GB', code: '+44' },
]

const services = [
  'Bulk Data Scraping',
  'Custom Web Scraping Software',
  'Web Automation Bots',
  'AI-Powered Bots',
  'Daily Data Feeds',
  'Third-Party API Integration',
  'Server Setup for Bots & Scripts',
  'PowerBI Dashboard Design',
  'Others',
]

const budgets = [
  '$0 - $500',
  '$501 - $1000',
  '$1001 - $5000',
  '$5001 - $10000',
  '$10000+',
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const selectClass =
  'w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 text-base focus:outline-none focus:border-[#1aa4ac] appearance-none cursor-pointer pr-10'

const ChevronIcon = () => (
  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>
)

/* ------------------------------ Toast ------------------------------ */
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(onClose, 3500)
    return () => clearTimeout(timer)
  }, [toast, onClose])

  const isSuccess = toast?.type === 'success'

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.95 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-6 right-6 z-[9999]"
        >
          <div
            className={`flex items-start gap-3 min-w-[300px] max-w-sm px-5 py-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)] border bg-white ${
              isSuccess ? 'border-emerald-100' : 'border-red-100'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                isSuccess ? 'bg-emerald-50' : 'bg-red-50'
              }`}
            >
              {isSuccess ? (
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>

            <div className="flex-1 pt-0.5">
              <p className={`text-sm font-bold ${isSuccess ? 'text-emerald-600' : 'text-red-600'}`}>
                {isSuccess ? 'Message Sent' : 'Something Went Wrong'}
              </p>
              <p className="text-sm text-gray-500 mt-0.5 leading-snug">{toast.message}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-gray-300 hover:text-gray-500 transition-colors cursor-pointer -mr-1 -mt-0.5"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* --------------------------- Main Component --------------------------- */
export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    budget: '',
    country: countries[0],
    phone: '',
    message: ''
  })

  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCountryChange = (e) => {
    const country = countries.find(c => c.short === e.target.value || c.code === e.target.value)
    if (country) {
      setFormData({ ...formData, country })
    }
  }

  const handlePhoneChange = (e) => {
    setFormData({ ...formData, phone: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    setSubmitting(true)
    try {
      const res = await axios.post(`${API_BASE_URL}/contact`, formData)
      if (res.status === 200 || res.status === 201) {
        setToast({ type: 'success', message: 'Thanks for reaching out! We will get back to you shortly.' })
        setFormData({
          name: '', email: '', service: '', budget: '',
          country: countries[0], phone: '', message: ''
        })
      }
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: 'Please try again in a moment.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.section
      className="py-20 bg-[#EEFAFD] w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={itemVariants}>
            <div className="flex flex-col items-start text-left mb-6 max-w-lg mx-auto">
              <motion.p className="text-[#3EB5D6] font-bold text-sm mb-1 tracking-wide" variants={itemVariants}>
                Let's Talk
              </motion.p>
              <motion.h2 className="text-3xl sm:text-4xl font-extrabold text-[#086B87] mb-2 tracking-tight font-inter" variants={itemVariants}>
                Reach Out to Us
              </motion.h2>
              <motion.div className="text-sm sm:text-base text-slate-500 font-medium space-y-0.5" variants={itemVariants}>
                <p>We're here to help and would love to connect!</p>
                <p>Don't hesitate to reach out!</p>
              </motion.div>
            </div>

            <motion.form className="space-y-4 max-w-lg mx-auto" variants={containerVariants} onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:border-[#1aa4ac] transition-colors"
              />

              <input
                type="email"
                name="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:border-[#1aa4ac] transition-colors"
              />

              {/* Services */}
              <div className="relative">
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className={selectClass}
                >
                  <option value="" disabled>Select a service</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
                <ChevronIcon />
              </div>

              {/* Budget */}
              <div className="relative">
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  className={selectClass}
                >
                  <option value="" disabled>Select your estimated budget</option>
                  {budgets.map((budget) => (
                    <option key={budget} value={budget}>
                      {budget}
                    </option>
                  ))}
                </select>
                <ChevronIcon />
              </div>

              {/* Phone */}
              <div className="flex border border-gray-200 rounded-xl bg-white overflow-hidden focus-within:border-[#1aa4ac] transition-colors">
                <div className="relative flex items-center border-r border-gray-200">
                  <select
                    value={formData.country.short}
                    onChange={handleCountryChange}
                    className="pl-4 pr-8 py-3.5 bg-transparent text-gray-800 text-base font-medium focus:outline-none cursor-pointer appearance-none"
                  >
                    {countries.map((c) => (
                      <option key={c.short} value={c.short}>
                        {c.short}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 pointer-events-none text-gray-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="(555) 000-0000"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  required
                  className="flex-1 px-4 py-3.5 bg-transparent text-gray-800 text-base focus:outline-none placeholder-gray-400"
                />
              </div>

              <textarea
                name="message"
                rows={4}
                placeholder="project brief"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:border-[#1aa4ac] resize-none transition-colors"
              />

              <motion.button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#0a85a7] text-white font-medium text-base rounded-xl cursor-pointer transition-colors shadow-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.1 }}
              >
                {submitting ? 'Sending...' : 'Send message'}
              </motion.button>
            </motion.form>
          </motion.div>

          <motion.div className="flex justify-center" variants={itemVariants}>
            <motion.div className="relative" whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}>
              <motion.img
                src="/assets/contactus.png"
                alt="contactus"
                className="w-full h-auto object-contain max-w-lg mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}