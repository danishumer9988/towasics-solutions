import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config'

function SubscriptionWidget() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ text: '', type: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setStatus({ text: 'Please enter your email', type: 'error' })
      return
    }
    setLoading(true)
    setStatus({ text: '', type: '' })
    try {
      const res = await axios.post(`${API_BASE_URL}/subscriptions`, { email })
      if (res.status === 201) {
        setStatus({ text: 'Thank you for subscribing!', type: 'success' })
        setEmail('')
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setStatus({ text: 'This email is already subscribed', type: 'error' })
      } else {
        setStatus({ text: 'Failed to subscribe. Please try again.', type: 'error' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6">
      <h5 className="text-base font-bold text-white mb-3 leading-tight font-inter">
        Subscribe & Get<br />Update Repeatedly
      </h5>
      {status.text && (
        <div className={`mb-2 p-1.5 rounded text-xs ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {status.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 max-w-[210px]">
        <input
          type="email"
          placeholder=""
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-1.5 bg-transparent border border-white/80 rounded-full text-white text-sm focus:outline-none placeholder-white/50"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 bg-white text-[#1877F2] hover:bg-[#e0f9fb] font-bold text-sm rounded-full transition-colors shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Subscribing...' : 'Subscribe Now'}
        </button>
      </form>
    </div>
  )
}

const usefulLinks = [
  { name: 'About Us', href: '/aboutus' },
  { name: 'Industries', href: '/industries' },
  { name: 'How It Works', href: '/howworks' },
  { name: "Let's Talk", href: '/contactus' },
  { name: 'Blog', href: '/blog' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms Of Service', href: '/terms-of-service' },
]

const servicesList = [
  'Bulk Data Scraping',
  'Custom Scraping Software',
  'Web Automation Bots',
  'AI-Powered Bots',
  'Daily Data Feeds',
  'Third-Party API Integration',
  'Server Setup For Bots',
  'PowerBI Dashboard Design',
]

export default function Footer() {
  return (
    <footer 
      className="relative footer-container text-white pt-12 pb-5 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/tridentfooter-BUOVJnYf.png')" }}
    >
      {/* Background World Map Overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/containerbg.png')" }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: Brand / Info */}
          <div className="space-y-4">
            <img 
              src="/assets/logo.png" 
              alt="Towasic Solutions Logo" 
              className="h-20 w-auto object-contain mb-3 bg-white p-2 rounded-lg shadow-sm" 
            />
            <p className="text-[18px] text-white/90 leading-relaxed max-w-xs font-inter">
              Towasic Solutions - From web to insight. Providing cutting-edge data scraping and automation solutions.
            </p>
            
            {/* Email with white badge */}
            <div className="flex items-center gap-2.5 text-[18px] text-white pt-1">
              <span className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-[#1877F2] shrink-0 shadow-sm">
                <i className="fa-solid fa-envelope text-xs text-[#1877F2]"></i>
              </span>
              <a href="mailto:info@towasicsolutions.com" className="hover:text-[#44D9E7] hover:underline font-medium transition-colors">
                info@towasicsolutions.com
              </a>
            </div>

            {/* Social Icons with white badges and blue icons */}
            <div className="flex gap-2 pt-1">
              {[
                { icon: 'fa-facebook-f', href: 'https://www.facebook.com/profile.php?id=61593393021273', label: 'Facebook' },
                { icon: 'fa-x-twitter', href: 'https://x.com/towasicsolution', label: 'Twitter / X' },
                { icon: 'fa-youtube', href: 'http://www.youtube.com/@TowasicSolutions', label: 'YouTube' },
                { icon: 'fa-instagram', href: 'https://www.instagram.com/towasicsolutions/', label: 'Instagram' },
                { icon: 'fa-linkedin-in', href: '#', label: 'LinkedIn' }
              ].map((item, i) => (
                <a 
                  key={i} 
                  href={item.href} 
                  target={item.href !== '#' ? '_blank' : undefined}
                  rel={item.href !== '#' ? 'noopener noreferrer' : undefined}
                  aria-label={item.label}
                  className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-[#1877F2] hover:bg-[#44D9E7] transition-colors shadow-sm group"
                >
                  <i className={`fa-brands ${item.icon} text-sm text-[#1877F2] group-hover:text-[#086B87]`}></i>
                </a>
              ))}
            </div>

            {/* Payment Methods Image */}
            <div className="pt-2">
              <img 
                src="/assets/payments.png" 
                alt="Payment Methods" 
                className="w-56 h-auto object-contain" 
              />
            </div>
          </div>

          {/* Column 2: Useful Links & Subscribe */}
          <div>
            <h4 className="text-[20px] font-bold mb-3 text-white font-inter">Useful Links</h4>
            <ul className="space-y-2">
              {usefulLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="flex items-center text-[18px] text-white hover:text-[#44D9E7] transition-colors font-inter group">
                    <svg className="w-3.5 h-3.5 mr-2 text-white group-hover:text-[#44D9E7] shrink-0 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <SubscriptionWidget />
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="text-[20px] font-bold mb-3 text-white font-inter">Services</h4>
            <ul className="space-y-2">
              {servicesList.map(service => (
                <li key={service}>
                  <a href="#" className="flex items-center text-[18px] text-white hover:text-[#44D9E7] transition-colors font-inter group">
                    <svg className="w-3.5 h-3.5 mr-2 text-white group-hover:text-[#44D9E7] shrink-0 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Global Offices */}
          <div>
            <h4 className="text-[20px] font-bold mb-3 text-white font-inter">Global Offices</h4>
            <div className="space-y-3 text-[18px] font-inter">
              <div>
                <p className="font-bold text-white mb-1">Texas:</p>
                <div className="space-y-1.5 text-white/95">
                  <p className="flex items-center gap-2.5">
                    <span className="w-6 h-6 bg-white rounded-md flex items-center justify-center shrink-0 shadow-sm">
                      <i className="fa-solid fa-phone text-[#1877F2] text-[11px]"></i>
                    </span>
                    <span>+1 346 458 0154</span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="w-6 h-6 bg-white rounded-md flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <i className="fa-solid fa-location-dot text-[#1877F2] text-[11px]"></i>
                    </span>
                    <span>3139 W Holcombe Blvd<br />A61 Houston, TX 77025</span>
                  </p>
                </div>
              </div>

              <div>
                <p className="font-bold text-white mb-1">Doha:</p>
                <div className="space-y-1.5 text-white/95">
                  <p className="flex items-center gap-2.5">
                    <span className="w-6 h-6 bg-white rounded-md flex items-center justify-center shrink-0 shadow-sm">
                      <i className="fa-solid fa-phone text-[#1877F2] text-[11px]"></i>
                    </span>
                    <span>+974 668 47104</span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="w-6 h-6 bg-white rounded-md flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <i className="fa-solid fa-location-dot text-[#1877F2] text-[11px]"></i>
                    </span>
                    <span>23231 Area-31 St-857 Build.7<br />Doha, Qatar 00000</span>
                  </p>
                </div>
              </div>

              <div>
                <p className="font-bold text-white mb-1">Lahore:</p>
                <div className="space-y-1.5 text-white/95">
                  <p className="flex items-center gap-2.5">
                    <span className="w-6 h-6 bg-white rounded-md flex items-center justify-center shrink-0 shadow-sm">
                      <i className="fa-solid fa-phone text-[#1877F2] text-[11px]"></i>
                    </span>
                    <span>+92 334 7728229</span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="w-6 h-6 bg-white rounded-md flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <i className="fa-solid fa-location-dot text-[#1877F2] text-[11px]"></i>
                    </span>
                    <span>22D CANAL PARK GULBERG II<br />Lahore, Pakistan 54000</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/25 pt-4 text-center">
          <p className="text-[18px] font-medium text-white font-inter">
            Copyright © All Rights Reserved | 2025
          </p>
        </div>
      </div>
    </footer>
  )
}



