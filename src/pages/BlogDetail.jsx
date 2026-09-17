import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import { API_BASE_URL } from '../config'

export default function BlogDetail() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${API_BASE_URL}/blogs/${slug}`)
        setBlog(res.data)
      } catch (err) {
        setError('Blog post not found')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (slug) {
      fetchBlog()
    }
  }, [slug])

  const formattedDate = blog?.date 
    ? new Date(blog.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Hero Section */}
        <PageHeader
          title={loading ? 'Loading...' : blog?.title || 'Blog Post'}
          description={formattedDate}
          image="/assets/blog.png"
          imageAlt={blog?.title || 'Blog Post'}
        />

        {/* Blog Content */}
        <div className="max-w-4xl mx-auto px-4 py-12 bg-white rounded-3xl shadow-md border border-gray-200 my-12">
          {loading ? (
            <div className="text-center py-10 font-semibold text-gray-500">Loading blog content...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 font-semibold">{error}</div>
          ) : (
            <article className="prose max-w-none">
              <h1 className="text-3xl md:text-4xl font-extrabold text-brand-850 mb-4">{blog.title}</h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 font-semibold mb-8 border-b pb-4">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://secure.gravatar.com/avatar/c64d729959c5acf420eadf0cee6fe7957c0abbcd4faa72aaabf5511b17e16aae?s=120&d=mm&r=g" 
                    alt="author" 
                    className="w-8 h-8 rounded-full border" 
                  />
                  <span>{blog.author || 'Admin'}</span>
                </div>
                <span>•</span>
                <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>

              {blog.featuredImage && (
                <div className="mb-8 overflow-hidden rounded-2xl border">
                  <img src={blog.featuredImage} alt={blog.title} className="w-full object-cover max-h-[400px]" />
                </div>
              )}

              <div 
                className="text-gray-700 leading-relaxed space-y-6 text-lg font-medium" 
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-12 border-t pt-6">
                  <h3 className="font-bold text-gray-700 mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, idx) => (
                      <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600 font-semibold">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          )}

          <div className="mt-12 border-t pt-6">
            <Link to="/blog" className="text-brand-600 hover:underline font-bold text-sm">
              ← Back to all blogs
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
