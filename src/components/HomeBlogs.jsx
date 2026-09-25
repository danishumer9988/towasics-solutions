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
