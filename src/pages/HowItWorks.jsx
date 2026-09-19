import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <PageHeader
        title="How It Works?"
        description="Our streamlined data scraping process is designed to provide you with clean, structured data that’s ready for analysis. From consultation to delivery, we make sure each step is tailored to meet your unique requirements."
        image="/assets/workimage.png"
        imageAlt="How It Works"
      />

      {/* How We Work Intro */}
      <div className="text-center max-w-7xl mx-auto my-12 px-4">
        <h2 className="text-3xl font-bold text-[#086B87]" style={{ color: "#086B87" }}>How We Work</h2>
        <div className="flex justify-center mt-4">
          <p className="text-gray-600 text-lg leading-relaxed max-w-4xl">
            At Towasic Solutions, we deliver top-tier web scraping and automation solutions by adhering to Agile methodology. Here’s an overview of our collaborative and efficient process:
          </p>
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="max-w-7xl mx-auto px-4 mb-12 flex justify-center">
        <img src="/assets/herowork.png" alt="Development Workflow" className="max-w-full rounded-2xl" />
      </div>

      {/* Web Scraping Split Section */}
      <div className="w-full bg-[#EEFCFD] my-12 overflow-hidden">
        <div className="w-full flex flex-col md:flex-row items-stretch min-h-[380px] md:min-h-[460px]">
          {/* Left Column - Robot Coding Image (Full Height) */}
          <div className="w-full md:w-5/12 flex">
            <img 
              src="/assets/robothowitworks.png" 
              alt="AI Robot Web Scraping" 
              className="w-full h-full object-cover object-center min-h-[350px]" 
            />
          </div>

          {/* Right Column - Web Scraping Diagram (Full Height Cyan Block) */}
          <div className="w-full md:w-7/12 bg-[#EEFCFD] p-6 md:p-12 flex items-center justify-center text-center">
            <img 
              src="/assets/right.png" 
              alt="Web Scraping Workflow" 
              className="w-full max-w-2xl max-h-[460px] object-contain" 
            />
          </div>
        </div>
      </div>

      {/* Testimonial Graphic Section */}
      <div className="bg-white mx-auto py-8 px-4 flex justify-center">
        <img 
          src="/assets/coment-BgpQNvov.png" 
          alt="Client Testimonial" 
          className="w-full max-w-4xl object-contain" 
        />
      </div>

      {/* Statistics Block */}
      <section className="bg-white max-w-6xl mx-auto pb-16 px-4">
        <h2 className="text-4xl text-center font-bold text-[#086B87] mb-12">Built on Quality. Driven by Trust.</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 max-w-5xl mx-auto mb-12">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 max-w-5xl mx-auto">
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

      {/* Decorative Related Section */}
      <div className="bg-white mx-auto py-12">
        <div className="flex justify-center">
          
          <img src="/assets/endsection-C5mJ4NFL.png" alt="Process details graph" className="w-full md:w-1/2 rounded-2xl" style={{ maxWidth: "577px" }} />
        </div>
      </div>

      {/* You're In Good Hands CTA */}
      <div className="text-center textmain mx-auto py-16 px-4">
        <h2 className="text-4xl font-extrabold text-[#086B87] mb-4" style={{ color: "#086B87" }}>
          You’re In Good Hands
        </h2>
        <div className="flex justify-center mb-8">
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl font-medium">
            Let our data scraping services be the foundation of your next business decision.{' '}
            <Link to="/contactus" className="text-brand-600 font-bold underline hover:text-brand-700 transition">
              Let's Talk
            </Link>{' '}
            to discuss your project needs and get a free consultation!
          </p>
        </div>
        {/*
        <Link to="/aboutus">
          <button className="bg-[#0a85a7] hover:bg-[#097390] text-white font-bold px-8 py-3 rounded-lg text-lg shadow-lg transition font-inter">
            About Us
          </button>
        </Link>
        */}
      </div>

      <Footer />
    </div>
  )
}
