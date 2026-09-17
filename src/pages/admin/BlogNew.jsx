import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminSidebar from '../../components/AdminSidebar'
import RichTextEditor from '../../components/RichTextEditor'
import { API_BASE_URL } from '../../config'

export default function BlogNew() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [featuredImage, setFeaturedImage] = useState(null)
  const [isFeatured, setIsFeatured] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      setCurrentUser(JSON.parse(userStr))
    } else {
      navigate('/auth/login')
    }
  }, [navigate])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setError('Invalid file type. Please choose a PNG or JPEG image.')
      return
    }

    setUploading(true)
    setError('')
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (!response.data || !response.data.url) throw new Error('Image upload failed')
      setFeaturedImage(response.data.url)
    } catch (err) {
      console.error('Error uploading image:', err)
      setError('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const postData = {
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()),
      isPublished: true,
      isFeatured,
      author: currentUser?.name || 'Admin',
      featuredImage
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/blogs/new`, postData)
      navigate(`/blogs/${res.data.slug}`)
    } catch (err) {
      console.error('Error saving blog:', err)
      setError('Failed to save blog. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <AdminSidebar />
        
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-150 mt-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Blog Post</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="content">Content</label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your blog content here..."
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="tags">Tags (comma separated)</label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="tech, web scraping, automation"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="isFeatured" className="text-gray-700 font-semibold cursor-pointer select-none">
                Featured Blog (visible on Home page)
              </label>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Featured Image</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-lg flex items-center border border-gray-300 font-medium text-sm text-gray-700 transition">
                  <i className="fa-solid fa-cloud-arrow-up mr-2 text-brand-600"></i>
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
                {featuredImage && (
                  <img src={featuredImage} alt="Featured" className="h-16 w-16 object-cover rounded-lg border" />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate('/blogs')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className={`px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-medium ${saving || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {saving ? 'Saving...' : 'Save Blog Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
