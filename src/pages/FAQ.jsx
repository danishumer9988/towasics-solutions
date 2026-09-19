import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import { API_BASE_URL } from '../config'

// Fallback initial categories matching backend model structure
const mockCategories = [
  {
    _id: 'mock-1',
    category: 'Expense tracking',
    faqs: [
      {
        question: 'Looking for answers? Find everything you need below.',
        answer: 'Browse our range of solutions and clear answers, built to support your unique goals. From quick insights to thorough guidance, we make complex topics simple, helping you get the answers you need effortlessly.'
      },
      {
        question: 'All your answers await you below—take a look',
        answer: 'Discover comprehensive resources and guides designed to address your common queries and help you navigate our platforms smoothly.'
      },
      {
        question: 'Find all the information you need in the sections below.',
        answer: 'Learn more about how our tools can simplify your daily operations, track metrics, and keep your business records organized.'
      },
      {
        question: "Discover the information you're seeking right here.",
        answer: 'Get detailed steps, troubleshooting tips, and best practices from our support team to optimize your overall experience.'
      }
    ]
  },
  {
    _id: 'mock-2',
    category: 'Income Analytics',
    faqs: [
      {
        question: 'How does Income Analytics work?',
        answer: 'Income Analytics visualizes your revenue streams and provides reports to help analyze financial performance over time.'
      }
    ]
  },
  {
    _id: 'mock-3',
    category: 'Budget management',
    faqs: [
      {
        question: 'What tools are available for Budget management?',
        answer: 'We offer planning sheets, limits alerts, and automated tracking to keep your expenses aligned with your set budgets.'
      }
    ]
  },
  {
    _id: 'mock-4',
    category: 'Wealth management',
    faqs: [
      {
        question: 'Can I integrate external accounts for Wealth management?',
        answer: 'Yes, our dashboard supports connecting multiple portfolios for unified wealth tracking.'
      }
    ]
  }
]

// Helper function to return SVG category icon based on category title
const getCategoryIcon = (categoryName = '') => {
  const name = categoryName.toLowerCase()
  if (name.includes('expense') || name.includes('general') || name.includes('info')) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    )
  }
  if (name.includes('income') || name.includes('analytic') || name.includes('data')) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )
  }
  if (name.includes('budget') || name.includes('pricing') || name.includes('plan')) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <line x1="16" y1="21" x2="16" y2="7" />
        <line x1="12" y1="17" x2="8" y2="17" />
      </svg>
    )
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  )
}

export default function FAQ() {
  const [categories, setCategories] = useState([])
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [activeFaqIndex, setActiveFaqIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFAQs = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${API_BASE_URL}/categories`)
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setCategories(res.data)
          setActiveCategoryId(res.data[0]._id)
        } else {
          setCategories(mockCategories)
          setActiveCategoryId(mockCategories[0]._id)
        }
      } catch (err) {
        console.error('Error fetching categories from backend:', err)
        setCategories(mockCategories)
        setActiveCategoryId(mockCategories[0]._id)
      } finally {
        setLoading(false)
      }
    }
    fetchFAQs()
  }, [])

  const handleCategoryClick = (id) => {
    setActiveCategoryId(id)
    setActiveFaqIndex(0) // Default first question open when switching category
  }

  const handleFaqClick = (idx) => {
    setActiveFaqIndex(activeFaqIndex === idx ? null : idx)
  }

  const activeCategory = categories.find(cat => cat._id === activeCategoryId) || categories[0]

  return (
    <div className="min-h-screen bg-white font-inter">
      <Navbar />

      {/* Main Top Hero Banner */}
      <PageHeader
        title="FAQ"
        description={
          <>
            Find Answers To Common Questions About Our Data Scraping Services, Process, Delivery Formats, And Compliance Practices. If You Have A Question That's Not Covered Here, Feel Free To{' '}
            <Link to="/contactus" className="text-[#3EB5D6] underline hover:text-white transition font-bold">Let's Talk.</Link>
          </>
        }
        image="/assets/faqtitle-C_rvXKxK.png"
        imageAlt="FAQ Illustration"
        imageSize="large"
      />

      {/* Interactive Dynamic Category & Accordion FAQ Section */}
      <section className="py-20 bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section Badge & Heading */}
        <div className="mb-10 text-left">
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full uppercase tracking-wider inline-block mb-3">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#086B87] tracking-tight">
            Frequently asked <span className="text-[#3EB5D6]">questions</span>
          </h2>
          <p className="text-slate-500 font-medium text-sm md:text-base mt-2 max-w-xl">
            Our FAQ section provides quick answers to common questions, making it easy to find the information you need.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-semibold text-lg">
            Loading FAQs from server...
          </div>
        ) : (
          /* 2-Column Layout */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Category Sidebar (Dynamic Categories from Backend) */}
            <div className="md:col-span-4 space-y-3">
              {categories.map((cat) => {
                const isActive = activeCategoryId === cat._id
                return (
                  <button
                    key={cat._id}
                    onClick={() => handleCategoryClick(cat._id)}
                    className={`w-full flex items-center gap-3 text-left px-5 py-3.5 rounded-xl font-semibold transition duration-200 border ${
                      isActive
                        ? 'bg-[#3EB5D6] text-white border-[#3EB5D6] shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {getCategoryIcon(cat.category)}
                    </div>
                    <span className="text-sm md:text-base font-medium">{cat.category}</span>
                  </button>
                )
              })}
            </div>

            {/* Right Accordion Panel (Dynamic Questions & Answers for Active Category) */}
            <div className="md:col-span-8 space-y-4">
              {activeCategory && activeCategory.faqs && activeCategory.faqs.length > 0 ? (
                activeCategory.faqs.map((faq, idx) => {
                  const isOpen = activeFaqIndex === idx
                  return (
                    <div 
                      key={faq._id || idx} 
                      className={`rounded-2xl border transition duration-200 overflow-hidden ${
                        isOpen ? 'bg-[#F8FAFC] border-gray-200 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <button
                        onClick={() => handleFaqClick(idx)}
                        className="w-full flex justify-between items-center p-5 text-left font-semibold transition"
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-7 h-7 rounded-full bg-[#3EB5D6] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-base text-[#086B87] font-bold">{faq.question}</span>
                        </div>
                        
                        <div className="text-gray-400 ml-4 flex-shrink-0">
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5"
                            className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#3EB5D6]' : ''}`}
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-6 pt-1 text-slate-600 leading-relaxed font-normal text-sm pl-16">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 text-gray-500 italic">
                  No FAQs in this category yet.
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Built on Quality. Driven by Trust Section */}
      <section className="bg-white max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl md:text-4xl text-center font-bold text-[#086B87] mb-16 tracking-tight">
          Built on Quality. Driven by Trust.
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 max-w-5xl mx-auto">
          {/* Item 1 */}
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
           <svg xmlns="http://www.w3.org/2000/svg" width="62" height="77" viewBox="0 0 62 77" fill="none"><path d="M46.2689 52.9856L41.6567 51.7876C40.3663 51.4517 39.0888 52.249 38.822 53.5564L38 57.5668L51.4905 72.5242L52.56 63.4101L61.946 63.0948L46.5304 46C46.526 46.2242 46.5555 46.4552 46.6212 46.6855L47.9458 51.2625C48.3157 52.5449 47.5612 53.3193 46.2689 52.9856Z" fill="url(#paint0_linear_6050_173)"></path><path d="M19.1358 49.3062C18.9 47.9937 17.6435 47.1669 16.3423 47.4726L15.6734 47.6274L4.59161 66.7216L13.596 64.9494L16.7661 73.79L29.3101 52.1841L29.1733 52.0071C28.3549 50.9534 26.8577 50.8052 25.8476 51.6795L22.2427 54.7973C21.235 55.6707 20.2152 55.3106 19.98 53.998L19.1358 49.3062Z" fill="url(#paint1_linear_6050_173)"></path><path d="M25.9227 33.5191L30.9999 30.449L36.077 33.5595L34.7473 27.7425L39.22 23.8645L33.337 23.3393L30.9999 17.8455L28.6628 23.2989L22.7797 23.8241L27.2524 27.7425L25.9227 33.5191ZM30.9999 32.3508L25.1491 35.8927C24.9771 35.9778 24.8176 36.0123 24.6703 35.9961C24.5242 35.9789 24.3818 35.9283 24.2432 35.8442C24.1035 35.7581 23.9982 35.6363 23.9273 35.4791C23.8564 35.3218 23.8499 35.15 23.908 34.9636L25.465 28.3225L20.3153 23.8467C20.1702 23.7282 20.0746 23.5865 20.0284 23.4217C19.9822 23.2569 19.9924 23.0991 20.059 22.9483C20.1256 22.7975 20.2143 22.6736 20.325 22.5766C20.4367 22.4829 20.5871 22.4194 20.7763 22.386L27.5716 21.7913L30.2214 15.5025C30.2944 15.3248 30.3997 15.1966 30.5373 15.118C30.6748 15.0393 30.829 15 30.9999 15C31.1707 15 31.3254 15.0393 31.4641 15.118C31.6027 15.1966 31.7074 15.3248 31.7784 15.5025L34.4281 21.7913L41.2219 22.386C41.4121 22.4183 41.563 22.4824 41.6748 22.5783C41.7865 22.6731 41.8757 22.7964 41.9423 22.9483C42.0079 23.0991 42.0175 23.2569 41.9713 23.4217C41.9251 23.5865 41.8295 23.7282 41.6844 23.8467L36.5348 28.3225L38.0918 34.9636C38.1519 35.1478 38.146 35.3191 38.074 35.4775C38.002 35.6358 37.8962 35.7575 37.7565 35.8426C37.619 35.9288 37.4766 35.98 37.3294 35.9961C37.1832 36.0123 37.0242 35.9778 36.8523 35.8927L30.9999 32.3508Z" fill="#35D9E1"></path><circle cx="31" cy="26" r="23.35" stroke="#0D92B7" stroke-width="1.3"></circle><defs><linearGradient id="paint0_linear_6050_173" x1="49.973" y1="46" x2="49.973" y2="72.5242" gradientUnits="userSpaceOnUse"><stop stop-color="#0D92B7"></stop><stop offset="1" stop-color="#61F7FF"></stop></linearGradient><linearGradient id="paint1_linear_6050_173" x1="13.3859" y1="48.3627" x2="21.1107" y2="72.3934" gradientUnits="userSpaceOnUse"><stop stop-color="#0D92B7"></stop><stop offset="1" stop-color="#61F7FF"></stop></linearGradient></defs></svg>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold uppercase tracking-wide text-[#0A85A7]">5+ YEARS OF EXCELLENCE</h3>
              <p className="text-slate-600 font-medium text-sm md:text-base mt-1">Proven expertise, unmatched results</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="6" width="24" height="32" rx="3" stroke="#00B5D8" strokeWidth="2.5" fill="none"/>
                <line x1="16" y1="14" x2="28" y2="14" stroke="#00B5D8" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="16" y1="20" x2="28" y2="20" stroke="#00B5D8" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="30" cy="32" r="9" fill="white" stroke="#00B5D8" strokeWidth="2.5"/>
                <path d="M26 32L29 35L34 29" stroke="#00B5D8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold uppercase tracking-wide text-[#0A85A7]">235+ PROJECTS COMPLETED</h3>
              <p className="text-slate-600 font-medium text-sm md:text-base mt-1">Delivering project success no matter what</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="16" r="6" fill="#0D92B7"/>
                <path d="M14 32C14 26.5 18.5 24 24 24C29.5 24 34 26.5 34 32V34H14V32Z" fill="#0D92B7"/>
                <circle cx="13" cy="20" r="4.5" fill="#35D9E1"/>
                <path d="M5 33C5 28.5 8.5 26.5 13 26.5C14.8 26.5 16.5 27 17.8 27.8C16.7 29 16 30.4 16 32V34H5V33Z" fill="#35D9E1"/>
                <circle cx="35" cy="20" r="4.5" fill="#35D9E1"/>
                <path d="M43 33C43 28.5 39.5 26.5 35 26.5C33.2 26.5 31.5 27 30.2 27.8C31.3 29 32 30.4 32 32V34H43V33Z" fill="#35D9E1"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold uppercase tracking-wide text-[#0A85A7]">OVER 20 SPECIALISTS</h3>
              <p className="text-slate-600 font-medium text-sm md:text-base mt-1">The experts behind your next breakthrough</p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 6L27.5 9.5L32 8L33.5 12.5L38 14L37.5 18.5L41 21L39 25L41 29L37.5 31.5L38 36L33.5 37.5L32 42L27.5 40.5L24 44L20.5 40.5L16 42L14.5 37.5L10 36L10.5 31.5L7 29L9 25L7 21L10.5 18.5L10 14L14.5 12.5L16 8L20.5 9.5L24 6Z" stroke="#00B5D8" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                <text x="24" y="29" fill="#00B5D8" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">97%</text>
              </svg>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold uppercase tracking-wide text-[#0A85A7]">97% CLIENT SATISFACTION</h3>
              <p className="text-slate-600 font-medium text-sm md:text-base mt-1">Always going beyond what’s expected</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom FAQs Thinking Section (Full-Width Light Cyan Background) */}
      <section className="py-20 bg-[#E7F8FF]">
        <div className="max-w-4xl mx-auto px-4 text-center">
        
          
          <div className="my-8 flex justify-center">
            <img 
              src="/assets/faqse.png" 
              alt="FAQs Illustration" 
              className="w-full max-w-md object-contain" 
            />
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-[#086B87] max-w-3xl mx-auto leading-snug mt-8 mb-4">
            Still Have Questions? Visit Our Contact Us Page. We're Here To Help!
          </h3>

          <Link 
            to="/contactus" 
            className="inline-block text-[#3EB5D6] hover:text-[#096078] text-xl font-bold transition"
          >
            Let's Talk
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
