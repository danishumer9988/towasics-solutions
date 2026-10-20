import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import { API_BASE_URL } from '../config'

export default function Blog() {
  const [blogs, setBlogs] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [blogsRes, catsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/blogs`),
          axios.get(`${API_BASE_URL}/blog-categories`)
        ])

        // Only show published blogs
        const publishedBlogs = blogsRes.data.filter(b => b.isPublished !== false)
        setBlogs(publishedBlogs)
        setCategories(Array.isArray(catsRes.data) ? catsRes.data : [])
      } catch (err) {
        console.error('Error fetching blogs:', err)
        setError('Failed to load blog posts. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredBlogs = selectedCategory === 'all'
    ? blogs
    : blogs.filter(b => b.category === selectedCategory)

  const countForCategory = (slug) => {
    if (slug === 'all') return blogs.length
    return blogs.filter(b => b.category === slug).length
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <PageHeader
        title="Blog"
        description="Welcome to our blog, where we share insights, tips, and trends in data scraping, industry applications, and data-driven strategies. Dive into our latest articles to learn how data can empower your business."
        image="/assets/blog.png"
        imageAlt="Blog Illustration"
      />

      {/* Category Tabs (Sticky) */}
      {!loading && categories.length > 0 && (
        <section className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100/60 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex flex-wrap justify-center gap-2 sm:gap-2.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#0a85a7] text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-[#0a85a7] hover:text-[#0a85a7]'
                }`}
              >
                All
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {blogs.length}
                </span>
              </button>

              {categories.map((cat) => {
                const active = selectedCategory === cat.slug
                return (
                  <button
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[#0a85a7] text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-[#0a85a7] hover:text-[#0a85a7]'
                    }`}
                  >
                    {cat.name}
                    <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {countForCategory(cat.slug)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Welcome Section */}
      <section className="py-12 bg-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-b border-gray-100">
        <div className="space-y-4 font-inter w-full mx-auto">
          <h2 className="font-bold text-[20px] sm:text-[24px] capitalize" style={{ color: '#096078' }}>
            Welcome to Our Data Scraping Insights
          </h2>
          <p className="font-medium text-[16px] text-slate-600 leading-relaxed pt-1 max-w-4xl mx-auto">
            Stay updated with the latest trends, tips, and best practices in data scraping. Our blog is dedicated to helping businesses harness the power of data through insightful articles, case studies, and expert advice.
          </p>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="py-12 pb-24 bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-semibold text-lg">Loading latest blogs...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-semibold text-lg">{error}</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500 font-semibold text-lg">
            No blogs found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => {
              const tempDiv = document.createElement('div')
              tempDiv.innerHTML = blog.content || ''
              const textExcerpt = tempDiv.textContent || tempDiv.innerText || ''

              return (
                <div key={blog._id} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 flex flex-col justify-between hover:shadow-2xl transition duration-300">
                  <div className="h-52 w-full overflow-hidden bg-gray-100 relative">
                    <img
                      src={blog.featuredImage || "/assets/blogimage.png"}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "/assets/blogimage.png" }}
                    />
                    {blog.category && (
                      <span className="absolute top-3 left-3 bg-[#0a85a7] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                        {categories.find(c => c.slug === blog.category)?.name || blog.category}
                      </span>
                    )}
                  </div>

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
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}