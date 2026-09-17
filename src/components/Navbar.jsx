import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const services = [
  { name: 'Bulk Data Scraping', path: '/services/bulk-data-scrapping' },
  { name: 'Custom Web Scraping Software', path: '/services/custom-web-scraping' },
  { name: 'Web Automation Bots', path: '/services/web-automation' },
  { name: 'AI-Powered Bots', path: '/services/ai-powered-bots' },
  { name: 'Daily Data Feeds', path: '/services/daily-data' },
  { name: 'Third-Party API Integration', path: '/services/api-integration' },
  { name: 'Server Setup for Bots & Scripts', path: '/services/server-setup' },
  { name: 'PowerBI Dashboard Design', path: '/services/powerbi-design' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path
  const isServiceActive = services.some(s => location.pathname === s.path)

  const linkClass = (path) =>
    `transition nav-item-link ${isActive(path) ? 'text-[#0a85a7]' : 'text-black hover:text-[#0a85a7]'}`

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/assets/logo.png" alt="Towasic Solutions Logo" className="h-14 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation (Centered) */}
          <div className="hidden lg:flex items-center justify-center flex-1 space-x-8">
            <Link to="/" className={linkClass('/')}>Home</Link>
            <Link to="/aboutus" className={linkClass('/aboutus')}>About Us</Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className={`transition flex items-center gap-1 nav-item-link ${isServiceActive ? 'text-[#0a85a7]' : 'text-black hover:text-[#0a85a7]'}`}>
                Services +
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg py-2 w-72 border border-gray-100 z-50">
                  {services.map(service => (
                    <Link
                      key={service.path}
                      to={service.path}
                      className={`block px-4 py-2 transition font-semibold text-sm ${isActive(service.path) ? 'text-[#0a85a7] bg-brand-50' : 'text-black hover:bg-brand-50 hover:text-[#0a85a7]'}`}
                      onClick={() => setServicesOpen(false)}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/industries" className={linkClass('/industries')}>Industries</Link>
            <Link to="/howworks" className={linkClass('/howworks')}>How It Works</Link>
            <Link to="/blog" className={linkClass('/blog')}>Blog</Link>
            <Link to="/faq" className={linkClass('/faq')}>FAQs</Link>
          </div>

          {/* Let's Talk CTA (Right Side) */}
          <div className="hidden lg:block">
            <Link
              to="/contactus"
              className="bg-[#0a85a7] text-white px-6 py-2 rounded-lg hover:bg-[#097390] transition lets-talk-btn inline-block"
            >
              Let's Talk
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 max-h-[80vh] overflow-y-auto space-y-1">
            <Link to="/" className={`block px-3 py-2.5 rounded-lg text-base font-semibold transition-colors ${isActive('/') ? 'text-[#0a85a7] bg-brand-50' : 'text-black hover:bg-gray-50'}`} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/aboutus" className={`block px-3 py-2.5 rounded-lg text-base font-semibold transition-colors ${isActive('/aboutus') ? 'text-[#0a85a7] bg-brand-50' : 'text-black hover:bg-gray-50'}`} onClick={() => setMenuOpen(false)}>About Us</Link>
            <div>
              <button
                className="flex items-center justify-between px-3 py-2.5 text-black w-full text-left font-semibold text-base rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setServicesOpen(!servicesOpen)}
              >
                <span>Services</span>
                <span className="text-sm font-bold text-[#0a85a7]">{servicesOpen ? '−' : '+'}</span>
              </button>
              {servicesOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-gray-50 rounded-lg my-1">
                  {services.map(service => (
                    <Link
                      key={service.path}
                      to={service.path}
                      className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive(service.path) ? 'text-[#0a85a7] font-bold bg-white' : 'text-black hover:text-[#0a85a7]'}`}
                      onClick={() => { setMenuOpen(false); setServicesOpen(false) }}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/industries" className={`block px-3 py-2.5 rounded-lg text-base font-semibold transition-colors ${isActive('/industries') ? 'text-[#0a85a7] bg-brand-50' : 'text-black hover:bg-gray-50'}`} onClick={() => setMenuOpen(false)}>Industries</Link>
            <Link to="/howworks" className={`block px-3 py-2.5 rounded-lg text-base font-semibold transition-colors ${isActive('/howworks') ? 'text-[#0a85a7] bg-brand-50' : 'text-black hover:bg-gray-50'}`} onClick={() => setMenuOpen(false)}>How It Works</Link>
            <Link to="/blog" className={`block px-3 py-2.5 rounded-lg text-base font-semibold transition-colors ${isActive('/blog') ? 'text-[#0a85a7] bg-brand-50' : 'text-black hover:bg-gray-50'}`} onClick={() => setMenuOpen(false)}>Blog</Link>
            <Link to="/faq" className={`block px-3 py-2.5 rounded-lg text-base font-semibold transition-colors ${isActive('/faq') ? 'text-[#0a85a7] bg-brand-50' : 'text-black hover:bg-gray-50'}`} onClick={() => setMenuOpen(false)}>FAQs</Link>
            <div className="pt-2">
              <Link to="/contactus" className="block text-center w-full bg-[#0a85a7] text-white py-2.5 rounded-lg font-bold shadow-sm hover:bg-[#097390] transition-colors" onClick={() => setMenuOpen(false)}>
                Let's Talk
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
