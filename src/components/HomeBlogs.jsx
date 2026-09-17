import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config'

export default function HomeBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/blogs`)
        const publishedBlogs = res.data.filter(b => b.isPublished !== false)
        
        // Filter featured
        const featured = publishedBlogs.filter(b => b.isFeatured === true).slice(0, 3)
        setBlogs(featured)
      } catch (err) {
        console.error('Error fetching home blogs:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 font-semibold">
          Loading blogs...
        </div>
      </section>
    )
  }

  if (blogs.length === 0) {
    return null; // Don't show blog section if no blogs exist
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-end mb-12">
          <div className="text-left">
            <p className="text-brand-600 font-medium mb-2 uppercase tracking-wider">
              Blog & Article
            </p>
            <h2 className="client-heading2 text-4xl font-bold text-[#086B87]">
              Read our latest blog & Article
            </h2>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/blog">
              <button className="bg-[#0a85a7] hover:bg-[#097390] text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors font-inter">
                All Blogs & Articles
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((post) => {
            // Strip HTML for the excerpt
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = post.content || ''
            const textExcerpt = tempDiv.textContent || tempDiv.innerText || ''

            return (
              <div key={post._id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                  <div className="h-48 overflow-hidden bg-gray-50">
                    <img 
                      src={post.featuredImage || "/assets/blogimage.png"} 
                      className="w-full h-full object-cover" 
                      alt={post.title} 
                      onError={(e) => { e.target.src = "/assets/blogimage.png" }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3 justify-center gap-2 font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "4px" }} width="15" height="13" viewBox="0 0 15 13" fill="none">
                        <path d="M7.15903 6.20504C8.00799 6.20504 8.82217 5.88967 9.42248 5.3283C10.0228 4.76693 10.36 4.00555 10.36 3.21165C10.36 2.41776 10.0228 1.65638 9.42248 1.09501C8.82217 0.533636 8.00799 0.218262 7.15903 0.218262C6.31007 0.218262 5.49589 0.533636 4.89558 1.09501C4.29528 1.65638 3.95803 2.41776 3.95803 3.21165C3.95803 4.00555 4.29528 4.76693 4.89558 5.3283C5.49589 5.88967 6.31007 6.20504 7.15903 6.20504ZM7.15903 7.5202C2.9031 7.5202 0.174805 9.71648 0.174805 10.7858V12.7826H14.1433V10.7858C14.1433 9.49264 11.5604 7.5202 7.15903 7.5202Z" fill="black" />
                      </svg>
                      <span>{post.author || 'Admin'}</span>
                      <span className="text-gray-300">|</span>
                      <svg xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "4px" }} width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M4.33509 0H2.12954V1.375H0.65918V3.4375H10.9517V1.375H9.48136V0H7.27582V1.375H4.33509V0Z" fill="black" />
                        <path d="M10.9517 4.8125H0.65918V10.3125H10.9517V4.8125Z" fill="black" />
                      </svg>
                      <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                    </div>
                    <Link to={`/blogs/${post.slug}`}>
                      <h3 className="text-xl font-bold text-[#086B87] mb-3 hover:text-brand-600 line-clamp-2 transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 font-medium">
                      {textExcerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-4 text-center">
                  <Link to={`/blogs/${post.slug}`} className="inline-block text-[#0a85a7] font-semibold text-sm hover:underline">
                    Read More →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
