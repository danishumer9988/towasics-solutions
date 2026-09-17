import React from 'react'
import { Link } from 'react-router-dom'

export default function HomeRelatedServices() {
  return (
    <section className="py-20 bg-white servicese">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 mb-8 text-left">
        <h2 className="add-heading mb-6 text-4xl font-bold text-[#086B87]">
          Related services to solve more subjects
        </h2>
        <p className="addpara text-gray-600 text-lg leading-relaxed max-w-5xl">
          Data scraping can be the first step toward business optimization and revenue growth. Our experience shows that companies usually need more services to improve business processes, change the ecosystem, or solve specific challenges. Gain a broader vision of your goals and ways to achieve them with Towasic’s experts.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-center">
        <div className="text-center">
          <img src="/assets/allservice.png" alt="allservice" className="max-w-full h-auto" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <Link to="/contactus">
          <button className="bg-[#0a85a7] hover:bg-[#097390] text-white px-10 py-3 rounded-lg font-medium text-lg transition-colors flex items-center gap-2 font-inter">
            Ask Us Anything
            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="16" viewBox="0 0 31 16" fill="none">
              <path d="M30.3369 8.70711C30.7274 8.31658 30.7274 7.68342 30.3369 7.29289L23.9729 0.928932C23.5824 0.538408 22.9492 0.538408 22.5587 0.928932C22.1682 1.31946 22.1682 1.95262 22.5587 2.34315L28.2156 8L22.5587 13.6569C22.1682 14.0474 22.1682 14.6805 22.5587 15.0711C22.9492 15.4616 23.5824 15.4616 23.9729 15.0711L30.3369 8.70711ZM0.496582 8V9H29.6298V8V7H0.496582V8Z" fill="white" />
            </svg>
          </button>
        </Link>
      </div>
    </section>
  )
}
