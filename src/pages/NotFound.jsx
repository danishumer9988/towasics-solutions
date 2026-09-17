import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <Navbar />
        
        <div className="max-w-md mx-auto text-center py-24 px-4 space-y-6">
          <div className="text-7xl font-extrabold text-brand-600">404</div>
          <h1 className="text-3xl font-bold text-gray-800">Oops! Page not found</h1>
          <p className="text-gray-600 font-medium">
            We can't seem to find the page you're looking for. It might have been moved or deleted.
          </p>
          <div className="pt-4">
            <Link 
              to="/" 
              className="inline-block px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-bold shadow-lg transition"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
