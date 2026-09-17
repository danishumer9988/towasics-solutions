import { useState } from 'react'
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

export default function ContactPageForm() {
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
    <section className="py-16 bg-[#EFFBFC] w-full font-inter">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Titles (Left Aligned) */}
        <div className="flex flex-col items-start text-left mb-10">
          <p className="text-[#3EB5D6] font-bold text-sm mb-1 tracking-wide">
            Let's Talk
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#086B87] mb-2 tracking-tight">
            Reach Out to Us
          </h2>
          <div className="text-sm sm:text-base text-slate-500 font-medium space-y-0.5">
            <p>We're here to help and would love to connect!</p>
            <p>Don't hesitate to reach out!</p>
          </div>
        </div>

        {/* 2-Column Split: Form (Left) & Office Cards (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-6 space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3EB5D6] transition"
              />
              
              <input
                type="email"
                name="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3EB5D6] transition"
              />

              <div className="relative">
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3EB5D6] appearance-none cursor-pointer pr-10"
                >
                  <option value="" disabled hidden>Select a services</option>
                  <option value="">Select a services</option>
                  <option>Bulk Data Scraping</option>
                  <option>Custom Web Scraping Software</option>
                  <option>Web Automation Bots</option>
                  <option>AI-Powered Bots</option>
                  <option>Daily Data Feeds</option>
                  <option>Third-Party API Integration</option>
                  <option>Others</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3EB5D6] appearance-none cursor-pointer pr-10"
                >
                  <option value="" disabled hidden>Select your estimated budget</option>
                  <option value="">Select your estimated budget</option>
                  <option>$0 - $500</option>
                  <option>$501 - $1000</option>
                  <option>$1001 - $5000</option>
                  <option>$5001 - $10000</option>
                  <option>$10000+</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Phone Field with Country Code */}
              <div className="flex border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#3EB5D6] transition">
                <div className="relative flex items-center border-r border-gray-200">
                  <select
                    value={formData.country.short}
                    onChange={handleCountryChange}
                    className="pl-3 pr-7 py-3 bg-transparent text-gray-700 text-sm font-semibold focus:outline-none cursor-pointer appearance-none"
                  >
                    {countries.map((c, i) => (
                      <option key={i} value={c.short}>{c.short}</option>
                    ))}
                  </select>
                  <div className="absolute right-2 pointer-events-none text-gray-400">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="flex-1 px-4 py-3 bg-transparent text-gray-800 text-sm font-medium focus:outline-none placeholder-gray-400"
                />
              </div>

              <textarea
                name="message"
                rows={4}
                placeholder="project brief"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3EB5D6] resize-none transition"
              />

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0a85a7] hover:bg-[#097390] text-white font-semibold text-sm rounded-lg transition shadow-md cursor-pointer"
              >
                Send message
              </button>
            </form>
          </div>

          {/* Right Column: 3 Office Location Cards (Matching Design Image) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Texas Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Texas:</h3>
              <div className="flex items-center gap-3.5 text-gray-900 font-medium text-[15px] sm:text-base">
                <div className="w-9 h-9 rounded-xl bg-[#EBF2FE] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#1D61E7]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.057 15.057 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.57 3.9c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.52c0-.55-.45-1-1-1z"/>
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">+1 346 458 0154</span>
              </div>
              <div className="flex items-start gap-3.5 text-gray-900 font-medium text-[15px] sm:text-base">
                <div className="w-9 h-9 rounded-xl bg-[#EBF2FE] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9.1c0 4.86 5.86 11.45 6.42 12.07.31.34.85.34 1.16 0 .56-.62 6.42-7.21 6.42-12.07C19 5.13 15.87 2 12 2z" fill="#1D61E7" />
                    <circle cx="12" cy="9" r="2.5" fill="white" />
                  </svg>
                </div>
                <div className="leading-snug text-gray-900 font-medium">
                  <div>3139 W Holcombe Blvd</div>
                  <div className="mt-0.5">A61 Houston, TX 77025</div>
                </div>
              </div>
            </div>

            {/* Doha Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Doha:</h3>
              <div className="flex items-center gap-3.5 text-gray-900 font-medium text-[15px] sm:text-base">
                <div className="w-9 h-9 rounded-xl bg-[#EBF2FE] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#1D61E7]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.057 15.057 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.57 3.9c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.52c0-.55-.45-1-1-1z"/>
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">+974 668 47104</span>
              </div>
              <div className="flex items-start gap-3.5 text-gray-900 font-medium text-[15px] sm:text-base">
                <div className="w-9 h-9 rounded-xl bg-[#EBF2FE] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9.1c0 4.86 5.86 11.45 6.42 12.07.31.34.85.34 1.16 0 .56-.62 6.42-7.21 6.42-12.07C19 5.13 15.87 2 12 2z" fill="#1D61E7" />
                    <circle cx="12" cy="9" r="2.5" fill="white" />
                  </svg>
                </div>
                <div className="leading-snug text-gray-900 font-medium">
                  <div>23231 Area-31 St-857 Build.7</div>
                  <div className="mt-0.5">Doha, Qatar 00000</div>
                </div>
              </div>
            </div>

            {/* Lahore Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Lahore:</h3>
              <div className="flex items-center gap-3.5 text-gray-900 font-medium text-[15px] sm:text-base">
                <div className="w-9 h-9 rounded-xl bg-[#EBF2FE] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#1D61E7]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.057 15.057 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.57 3.9c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.52c0-.55-.45-1-1-1z"/>
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">+92 334 7728229</span>
              </div>
              <div className="flex items-start gap-3.5 text-gray-900 font-medium text-[15px] sm:text-base">
                <div className="w-9 h-9 rounded-xl bg-[#EBF2FE] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9.1c0 4.86 5.86 11.45 6.42 12.07.31.34.85.34 1.16 0 .56-.62 6.42-7.21 6.42-12.07C19 5.13 15.87 2 12 2z" fill="#1D61E7" />
                    <circle cx="12" cy="9" r="2.5" fill="white" />
                  </svg>
                </div>
                <div className="leading-snug text-gray-900 font-medium">
                  <div>22D CANAL PARK GULBERG II</div>
                  <div className="mt-0.5">Lahore, Pakistan 54000a</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
