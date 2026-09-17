import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminSidebar from '../../components/AdminSidebar'
import { API_BASE_URL } from '../../config'

export default function ProjectNew() {
  const [projectNumber, setProjectNumber] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      navigate('/auth/login')
    }
  }, [navigate])

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    setError('')

    try {
      const uploadPromises = files.map(async (file) => {
        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
          throw new Error('Only PNG/JPEG images are allowed')
        }
        const formData = new FormData()
        formData.append('file', file)

        const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return response.data.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      setImages((prevImages) => [...prevImages, ...uploadedUrls])
    } catch (err) {
      console.error('Error uploading images:', err)
      setError(err.message || 'Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const [urlInput, setUrlInput] = useState('')

  const handleAddUrl = (e) => {
    e.preventDefault()
    if (!urlInput.trim()) return
    setImages((prevImages) => [...prevImages, urlInput.trim()])
    setUrlInput('')
  }

  const handleMoveImage = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= images.length) return
    const newImages = [...images]
    const [movedItem] = newImages.splice(fromIdx, 1)
    newImages.splice(toIdx, 0, movedItem)
    setImages(newImages)
  }

  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!projectNumber || !title || !description) {
      setError('Please fill in all required fields')
      return
    }

    setSaving(true)
    setError('')

    const postData = {
      projectNumber: Number(projectNumber),
      title,
      description,
      images
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
      await axios.post(`${API_BASE_URL}/projects`, postData, config)
      navigate('/admin/projects')
    } catch (err) {
      console.error('Error saving project:', err)
      setError(err.response?.data?.message || 'Failed to save project. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <AdminSidebar />
        
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-150 mt-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Portfolio Project</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="projectNumber">Project Number</label>
                <input
                  type="number"
                  id="projectNumber"
                  value={projectNumber}
                  onChange={(e) => setProjectNumber(e.target.value)}
                  placeholder="e.g. 1"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">Project Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Automated Scraping Dashboard"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="6"
                placeholder="Write project description..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Project Images (Multiple Supported)</label>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2.5 rounded-lg flex items-center justify-center font-medium text-sm transition shadow-sm shrink-0">
                    <i className="fa-solid fa-cloud-arrow-up mr-2 text-blue-600"></i>
                    {uploading ? 'Uploading...' : 'Upload Image Files'}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleImageUpload}
                      multiple
                      disabled={uploading}
                    />
                  </label>

                  <span className="text-gray-400 text-sm hidden sm:inline text-center">or</span>

                  <div className="flex flex-1 gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="Paste Image URL (e.g. https://...)"
                      className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrl}
                      className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    {images.map((imgUrl, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border-2 border-gray-200 aspect-video bg-gray-50 flex flex-col justify-between p-1">
                        <img src={imgUrl} alt={`Uploaded ${idx}`} className="w-full h-full object-cover rounded-lg" />
                        
                        {idx === 0 && (
                          <span className="absolute top-2 left-2 bg-[#0a85a7] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                            Primary Cover
                          </span>
                        )}

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveImage(idx, idx - 1)}
                              className="bg-white text-gray-800 rounded-full p-1.5 hover:bg-gray-100 shadow transition"
                              title="Move Left"
                            >
                              <i className="fa-solid fa-arrow-left text-xs"></i>
                            </button>
                          )}
                          {idx < images.length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMoveImage(idx, idx + 1)}
                              className="bg-white text-gray-800 rounded-full p-1.5 hover:bg-gray-100 shadow transition"
                              title="Move Right"
                            >
                              <i className="fa-solid fa-arrow-right text-xs"></i>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow transition"
                            title="Remove Image"
                          >
                            <i className="fa-solid fa-trash text-xs"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate('/admin/projects')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className={`px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-medium ${saving || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {saving ? 'Saving...' : 'Save Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
