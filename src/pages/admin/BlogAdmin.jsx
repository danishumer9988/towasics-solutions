import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminSidebar from '../../components/AdminSidebar'
import { API_BASE_URL } from '../../config'

export default function BlogAdmin() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      navigate('/auth/login')
    }
  }, [navigate])

  const fetchBlogs = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${API_BASE_URL}/blogs`)
      setBlogs(res.data)
    } catch (err) {
      setError('Failed to load blogs')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await axios.delete(`${API_BASE_URL}/blogs/${id}`)
        setBlogs(blogs.filter(blog => blog._id !== id))
      } catch (err) {
        console.error('Failed to delete blog', err)
        setError('Failed to delete blog')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <AdminSidebar />
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Blog Posts</h1>
          <Link 
            to="/blogs/new" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200 font-semibold"
          >
            Add New Blog
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 font-medium text-gray-500">Loading blogs...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 font-semibold">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200 border border-gray-150 flex flex-col justify-between">
                <div>
                  {blog.featuredImage && (
                    <div className="h-48 overflow-hidden">
                      <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <Link to={`/blogs/${blog.slug}`}>
                      <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600 mb-2 line-clamp-2">
                        {blog.title}
                      </h2>
                    </Link>
                    <div 
                      className="text-gray-600 mb-4 line-clamp-3 text-sm" 
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                  <Link to={`/blogs/${blog.slug}`} className="text-blue-600 hover:underline font-semibold text-sm">
                    Read more →
                  </Link>
                  <div className="flex space-x-3 text-lg">
                    <Link to={`/blogs/edit/${blog._id}`} className="text-blue-500 hover:text-blue-700">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                    <button onClick={() => handleDelete(blog._id)} className="text-red-500 hover:text-red-700">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {blogs.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500 font-medium">
                No blog posts created yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
