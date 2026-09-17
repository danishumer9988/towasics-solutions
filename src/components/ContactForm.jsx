import { useState } from 'react'
import { motion } from 'framer-motion'
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

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
    try {
      const res = await axios.post(`${API_BASE_URL}/contact`, formData)
      if (res.status === 200 || res.status === 201) {
        alert('✅ Message sent successfully!')
        setFormData({
          name: '', email: '', service: '', budget: '',
          country: countries[0], phone: '', message: ''
        })
      }
    } catch (err) {
      console.error(err)
      alert('❌ Something went wrong, please try again.')
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
              <motion.input
                type="text"
                name="name"
                placeholder="your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:border-[#1aa4ac] transition-colors"
              />
              
              <motion.input
                type="email"
                name="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:border-[#1aa4ac] transition-colors"
              />

              <div className="relative">
                <motion.select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 text-base focus:outline-none focus:border-[#1aa4ac] appearance-none cursor-pointer pr-10"
                >
                  <option value="" disabled hidden>Select a services</option>
                  <option value="">Select a services</option>
                  <option>Bulk Data Scraping</option>
                  <option>Custom Web Scraping Software</option>
                  <option>Web Automation Bots</option>
                  <option>AI-Powered Bots</option>
                  <option>Daily Data Feeds</option>
                  <option>Third-Party API Integration</option>
                  <option>Server Setup for Bots & Scripts</option>
                  <option>PowerBI Dashboard Design</option>
                  <option>Others</option>
                </motion.select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <motion.select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 text-base focus:outline-none focus:border-[#1aa4ac] appearance-none cursor-pointer pr-10"
                >
                  <option value="" disabled hidden>Select your estimated budget</option>
                  <option value="">Select your estimated budget</option>
                  <option>$0 - $500</option>
                  <option>$501 - $1000</option>
                  <option>$1001 - $5000</option>
                  <option>$5001 - $10000</option>
                  <option>$10000+</option>
                </motion.select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="flex border border-gray-200 rounded-xl bg-white overflow-hidden focus-within:border-[#1aa4ac] transition-colors">
                <div className="relative flex items-center border-r border-gray-200">
                  <select
                    value={formData.country.short}
                    onChange={handleCountryChange}
                    className="pl-4 pr-8 py-3.5 bg-transparent text-gray-800 text-base font-medium focus:outline-none cursor-pointer appearance-none"
                  >
                    {countries.map((c, i) => (
                      <option key={i} value={c.short}>{c.short}</option>
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
                  className="flex-1 px-4 py-3.5 bg-transparent text-gray-800 text-base focus:outline-none placeholder-gray-400"
                />
              </div>

              <motion.textarea
                name="message"
                rows={4}
                placeholder="project brief"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:border-[#1aa4ac] resize-none transition-colors"
              />

              <motion.button
                type="submit"
                className="w-full py-4 bg-[#0a85a7] hover:bg-[#097390] text-white font-medium text-base rounded-xl cursor-pointer transition-colors shadow-sm mt-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Send message
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
