import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function WhatsAppButton() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    projectDetails: '',
    budget: 'Under $500'
  })

  // Pre-fill project details based on current URL path
  useEffect(() => {
    const path = location.pathname
    if (path.includes('bulk-data-scrapping')) {
      setFormData(prev => ({ ...prev, projectDetails: 'I am interested in your Bulk Data Scraping services.' }))
    } else if (path.includes('custom-web-scraping')) {
      setFormData(prev => ({ ...prev, projectDetails: 'I am interested in custom-built Web Scraping software.' }))
    } else if (path.includes('web-automation')) {
      setFormData(prev => ({ ...prev, projectDetails: 'I am interested in Web Automation Bots.' }))
    } else if (path.includes('ai-powered-bots')) {
      setFormData(prev => ({ ...prev, projectDetails: 'I am interested in AI Powered Bots.' }))
    } else if (path.includes('daily-data')) {
      setFormData(prev => ({ ...prev, projectDetails: 'I am interested in Daily Data Feeds.' }))
    } else if (path.includes('api-integration')) {
      setFormData(prev => ({ ...prev, projectDetails: 'I am interested in Third-Party API Integration.' }))
    } else if (path.includes('server-setup')) {
      setFormData(prev => ({ ...prev, projectDetails: 'I am interested in Server Setup for bots & scripts.' }))
    } else if (path.includes('powerbi-design')) {
      setFormData(prev => ({ ...prev, projectDetails: 'I am interested in Power BI Dashboard Design.' }))
    } else {
      setFormData(prev => ({ ...prev, projectDetails: '' }))
    }
  }, [location.pathname])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Construct formatting WhatsApp message text
    const textMessage = `Hello Towasic Solutions, I would like to get a quote.
Name: ${formData.name}
Phone: ${formData.phone}
Project Details: ${formData.projectDetails}
Budget: ${formData.budget}`

    const encodedText = encodeURIComponent(textMessage)
    const whatsappPhone = '97466847104'
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    // Close the modal
    setIsOpen(false)

    if (isMobile) {
      window.location.href = `whatsapp://send?phone=${whatsappPhone}&text=${encodedText}`
    } else {
      window.open(`https://wa.me/${whatsappPhone}?text=${encodedText}`, '_blank')
    }
  }

  return (
    <>
      {/* Floating Sticky WhatsApp Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 hover:scale-110 transition shadow-2xl focus:outline-none rounded-full"
        aria-label="Contact us on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="64px" height="64px" fillRule="evenodd" clipRule="evenodd">
          <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"/>
          <path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"/>
          <path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"/>
          <path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"/>
          <path fill="#fff" fillRule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clipRule="evenodd"/>
        </svg>
      </button>

      {/* WhatsApp Lead Form Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-gray-150 text-left">
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition text-2xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold text-brand-850 mb-2">Connect on WhatsApp</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Provide your details below to instantly start a conversation with our developers on WhatsApp.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Your Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-600 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. +1 555-0199"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-600 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Project Details</label>
                <textarea 
                  name="projectDetails"
                  value={formData.projectDetails}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Briefly describe what you need to scrape or automate..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-600 text-gray-800 resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Estimated Budget</label>
                <select 
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-600 text-gray-800 bg-white"
                >
                  <option value="Under $500">Under $500</option>
                  <option value="$500 - $1500">$500 - $1,500</option>
                  <option value="$1500 - $5000">$1,500 - $5,000</option>
                  <option value="Over $5000">Over $5,000</option>
                </select>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full unified-button"
                >
                  Start Chat on WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
