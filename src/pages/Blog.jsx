import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import { API_BASE_URL } from '../config'

export default function Blog() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/blogs`)
        // Filter to display published blogs
        setBlogs(res.data.filter(b => b.isPublished !== false))
      } catch (err) {
        console.error('Error fetching blogs:', err)
        setError('Failed to load blog posts. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Main Top Hero Banner */}
      <PageHeader
        title="Blog"
        description="Welcome to our blog, where we share insights, tips, and trends in data scraping, industry applications, and data-driven strategies. Dive into our latest articles to learn how data can empower your business."
        image="/assets/blog.png"
        imageAlt="Blog Illustration"
      />

      {/* Welcome To Our Data Scraping Insights Section */}
      <section className="py-12 bg-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-4 font-inter w-full mx-auto">
          <h2
            className="font-bold text-[20px] sm:text-[24px] capitalize"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              lineHeight: '130%',
              letterSpacing: '0%',
              textTransform: 'capitalize',
              color: '#096078'
            }}
          >
            Welcome to Our Data Scraping Insights
          </h2>

          <p
            className="font-medium text-[16px] text-slate-600 leading-relaxed max-w-4xl mx-auto"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              letterSpacing: '0%'
            }}
          >
            Welcome to our blog, where we share insights, tips, and trends in data scraping, industry applications, and data-driven strategies. Dive into our latest articles to learn how data can empower your business and keep you ahead of the curve.
          </p>

          <p
            className="font-medium text-[16px] text-slate-600 leading-relaxed pt-1 max-w-4xl mx-auto"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              letterSpacing: '0%'
            }}
          >
            Stay updated with the latest trends, tips, and best practices in data scraping. Our blog is dedicated to helping businesses harness the power of data through insightful articles, case studies, and expert advice.
          </p>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="py-12 pb-24 bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-semibold text-lg">
            Loading latest blogs...
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-semibold text-lg">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => {
              // Strip HTML for excerpt
              const tempDiv = document.createElement('div')
              tempDiv.innerHTML = blog.content || ''
              const textExcerpt = tempDiv.textContent || tempDiv.innerText || ''

              return (
                <div
                  key={blog._id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 flex flex-col justify-between hover:shadow-2xl transition duration-300"
                >
                  {/* Top Featured Image */}
                  <div className="h-52 w-full overflow-hidden bg-gray-100">
                    <img
                      src={blog.featuredImage || "/assets/blogimage.png"}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "/assets/blogimage.png" }}
                    />
                  </div>

                  {/* Content Body */}
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-[#0A85A7] leading-snug line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mt-3 mb-6 line-clamp-3 font-medium">
                        {textExcerpt}
                      </p>
                    </div>

                    <div>
                      <Link
                        to={`/blogs/${blog.slug}`}
                        className="inline-block border border-[#0A85A7] text-[#0A85A7] hover:bg-[#EEFCFD] font-semibold text-sm px-6 py-2 rounded-lg transition"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
            {blogs.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500 font-semibold text-lg">
                No blogs published yet.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Ready To Transform Your Industry CTA Section */}
      <section className="py-16 bg-white text-center px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#086B87] mb-4">
          Ready To Transform Your Industry?
        </h2>
        <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed max-w-3xl mx-auto">
          Our Data Scraping Solutions Are Tailored To Meet The Specific Needs Of Your Industry, Giving You The Insights To Excel.{' '}
          <Link to="/contactus" className="text-[#3EB5D6] underline hover:text-[#096078] font-semibold transition">
            Let's Talk
          </Link>{' '}
          To Learn How We Can Empower Your Business With Data-Driven Strategies!
        </p>
      </section>

      <Footer />
    </div>
  )
}