import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import RichTextEditor from '../../components/RichTextEditor'
import { PageHeader, Card, Button, Field, Input, Alert } from '../../components/admin/ui'

export default function BlogForm({ mode = 'create' }) {
  const isEdit = mode === 'edit'
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [featuredImage, setFeaturedImage] = useState(null)
  const [isFeatured, setIsFeatured] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setCurrentUser(JSON.parse(u))
    else navigate('/auth/login')
  }, [navigate])

  useEffect(() => {
    if (!isEdit || !id) return
    ;(async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${API_BASE_URL}/blogs/id/${id}`)
        const b = res.data
        setTitle(b.title)
        setContent(b.content)
        setTags(b.tags?.join(', ') || '')
        setFeaturedImage(b.featuredImage)
        setIsFeatured(!!b.isFeatured)
      } catch (err) {
        console.error(err)
        setError('Failed to load blog post.')
      } finally { setLoading(false) }
    })()
  }, [isEdit, id])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setError('Invalid file type. Please choose a PNG or JPEG image.')
      return
    }
    setUploading(true); setError('')
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (!res.data?.url) throw new Error('Upload failed')
      setFeaturedImage(res.data.url)
    } catch (err) {
      console.error(err)
      setError('Image upload failed.')
    } finally { setUploading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    const postData = {
      title,
      content,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      isPublished: true,
      isFeatured,
      author: currentUser?.name || 'Admin',
      featuredImage,
    }
    try {
      if (isEdit) {
        await axios.put(`${API_BASE_URL}/blogs/${id}`, postData)
        navigate('/blogs')
      } else {
        const res = await axios.post(`${API_BASE_URL}/blogs/new`, postData)
        navigate(`/blogs/${res.data.slug}`)
      }
    } catch (err) {
      console.error(err)
      setError('Failed to save blog post.')
    } finally { setSaving(false) }
  }

  return (
    <AdminLayout>
      <PageHeader
        title={isEdit ? 'Edit Blog Post' : 'New Blog Post'}
        description={isEdit ? 'Update this blog post.' : 'Write and publish a new post.'}
      />

      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

      <Card>
        {loading ? (
          <div className="p-10 text-center text-ink-muted text-sm">Loading…</div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <Field label="Title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </Field>

            <Field label="Content">
              <RichTextEditor value={content} onChange={setContent} placeholder="Write your content…" />
            </Field>

            <Field label="Tags" hint="Comma separated — e.g. tech, web scraping, automation">
              <Input value={tags} onChange={(e) => setTags(e.target.value)} />
            </Field>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 text-brand-600 rounded border-line"
              />
              <span className="text-sm text-ink font-medium">Featured — show on home page</span>
            </label>

            <Field label="Featured Image">
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-line px-4 py-2.5 rounded-lg flex items-center text-sm font-medium text-ink transition">
                  <i className="fa-solid fa-cloud-arrow-up mr-2 text-brand-600"></i>
                  {uploading ? 'Uploading…' : 'Upload Image'}
                  <input type="file" className="hidden" accept="image/png,image/jpeg,image/jpg"
                    onChange={handleImageUpload} disabled={uploading} />
                </label>
                {featuredImage && (
                  <img src={featuredImage} alt="" className="h-16 w-16 rounded-lg object-cover border border-line" />
                )}
              </div>
            </Field>

            <div className="flex justify-end gap-2 pt-5 border-t border-line">
              <Button type="button" variant="secondary" onClick={() => navigate('/blogs')}>Cancel</Button>
              <Button type="submit" disabled={saving || uploading}>
                {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </AdminLayout>
  )
}