import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import RichTextEditor from '../../components/RichTextEditor'
import {
  PageHeader, Card, Button, Field, Input, Alert,
} from '../../components/admin/ui'

/* ---------- helpers ---------- */
const htmlToText = (html = '') =>
  html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const emptyBlock = () => ({ heading: '', content: '' })

export default function ProjectForm({ mode = 'create' }) {
  const isEdit = mode === 'edit'
  const { id } = useParams()
  const navigate = useNavigate()

  const [projectNumber, setProjectNumber] = useState('')
  const [title, setTitle] = useState('')
  // Array of { heading, content } blocks
  const [descriptions, setDescriptions] = useState([emptyBlock()])
  const [link, setLink] = useState('')
  const [videoLink, setVideoLink] = useState('')
  const [industry, setIndustry] = useState('')
  const [blurImage, setBlurImage] = useState(false)
  const [featured, setFeatured] = useState(false)
  const [images, setImages] = useState([])
  const [urlInput, setUrlInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [error, setError] = useState('')
  const [industries, setIndustries] = useState([])

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/auth/login')
  }, [navigate])

  /* Load industries */
  useEffect(() => {
    ;(async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/industries`)
        setIndustries(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        console.error('Failed to load industries', err)
      }
    })()
  }, [])

  /* Load project in edit mode */
  useEffect(() => {
    if (!isEdit || !id) return
    ;(async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${API_BASE_URL}/projects/${id}`)
        const p = res.data
        setProjectNumber(p.projectNumber)
        setTitle(p.title)

        // Prefer `descriptions[]`, fall back to legacy `description`
        if (Array.isArray(p.descriptions) && p.descriptions.length > 0) {
          setDescriptions(
            p.descriptions.map((d) => ({
              heading: d.heading || '',
              content: d.content || '',
            }))
          )
        } else if (p.description) {
          setDescriptions([{ heading: '', content: p.description }])
        } else {
          setDescriptions([emptyBlock()])
        }

        setLink(p.link || '')
        setVideoLink(p.videoLink || '')
        setIndustry(p.industry || '')
        setBlurImage(!!p.blurImage)
        setFeatured(!!p.featured)
        setImages(p.images || [])
      } catch (err) {
        console.error(err)
        setError('Failed to load project details.')
      } finally { setLoading(false) }
    })()
  }, [isEdit, id])

  /* ---------- image handlers ---------- */
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true); setError('')
    try {
      const urls = await Promise.all(files.map(async (file) => {
        if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
          throw new Error('Only PNG, JPEG or WEBP images are allowed')
        }
        const formData = new FormData()
        formData.append('file', file)
        const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        return res.data.url
      }))
      setImages((prev) => [...prev, ...urls])
    } catch (err) {
      setError(err.message || 'Image upload failed. Please try again.')
    } finally { setUploading(false) }
  }

  const handleAddUrl = (e) => {
    e.preventDefault()
    if (!urlInput.trim()) return
    setImages((prev) => [...prev, urlInput.trim()])
    setUrlInput('')
  }

  const moveImage = (from, to) => {
    if (to < 0 || to >= images.length) return
    const next = [...images]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    setImages(next)
  }

  /* ---------- description block handlers ---------- */
  const addDescriptionBlock = () => {
    setDescriptions((prev) => [...prev, emptyBlock()])
  }

  const removeDescriptionBlock = (index) => {
    setDescriptions((prev) => {
      if (prev.length === 1) return prev
      return prev.filter((_, i) => i !== index)
    })
  }

  const moveDescriptionBlock = (from, to) => {
    if (to < 0 || to >= descriptions.length) return
    setDescriptions((prev) => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

  const updateBlock = (index, patch) => {
    setDescriptions((prev) =>
      prev.map((b, i) => (i === index ? { ...b, ...patch } : b))
    )
  }

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Drop completely empty blocks
    const cleanedBlocks = descriptions
      .map((b) => ({
        heading: (b.heading || '').trim(),
        content: (b.content || '').trim(),
      }))
      .filter((b) => b.heading || b.content)

    if (!projectNumber || !title || cleanedBlocks.length === 0) {
      setError('Please fill in the project number, title, and at least one description block.')
      return
    }

    setSaving(true); setError('')

    const legacyDescription = htmlToText(cleanedBlocks[0]?.content || '')

    const postData = {
      projectNumber: Number(projectNumber),
      title,
      descriptions: cleanedBlocks,      // new: array of { heading, content(HTML) }
      description: legacyDescription,   // legacy plain-text fallback
      link: link.trim(),
      videoLink: videoLink.trim(),
      industry,
      blurImage,
      featured,
      images,
    }

    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      if (isEdit) await axios.put(`${API_BASE_URL}/projects/${id}`, postData, config)
      else await axios.post(`${API_BASE_URL}/projects`, postData, config)
      navigate('/admin/projects')
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'save'} project.`)
    } finally { setSaving(false) }
  }

  return (
    <AdminLayout>
      <PageHeader
        title={isEdit ? 'Edit Portfolio Project' : 'New Portfolio Project'}
        description={isEdit ? 'Update the details of this project.' : 'Add a new project to your portfolio.'}
      />

      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

      <Card>
        {loading ? (
          <div className="p-10 text-center text-ink-muted text-sm">Loading…</div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Project Number + Title */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field label="Project Number">
                <Input type="number" value={projectNumber} onChange={(e) => setProjectNumber(e.target.value)} placeholder="e.g. 1" required />
              </Field>
              <div className="md:col-span-2">
                <Field label="Project Title">
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Automated Scraping Dashboard" required />
                </Field>
              </div>
            </div>

            {/* Industry + External Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                label="Industry"
                hint={
                  industries.length === 0
                    ? 'No industries yet — create them in Admin → Industries'
                    : 'Choose the industry this project belongs to'
                }
              >
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-line rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition"
                >
                  <option value="">— None —</option>
                  {industries.map((ind) => (
                    <option key={ind._id} value={ind.slug}>{ind.name}</option>
                  ))}
                </select>
              </Field>

              <Field label="External Link (optional)">
                <Input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://example.com/case-study"
                />
              </Field>
            </div>

            {/* YouTube Video Link */}
            <Field
              label="YouTube Video Link (optional)"
              hint="If provided, a 'Watch on YouTube' button will appear in the project's Read More popup, next to the project number."
            >
              <Input
                type="url"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </Field>

            {/* Featured Toggle */}
            <div className="border border-line rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink">Featured Project</p>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                    Featured projects appear in the <strong>About page portfolio section</strong>.
                    Non-featured projects only appear on the <strong>Portfolio page</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={featured}
                  onClick={() => setFeatured((f) => !f)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors shrink-0 mt-0.5 ${
                    featured ? 'bg-[#0a85a7]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      featured ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {featured && (
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                    <i className="fa-solid fa-star"></i>
                    Featured — shows on About page
                  </span>
                </div>
              )}
            </div>

            {/* Blur Toggle */}
            <div className="border border-line rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink">Blur project images</p>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                    Enable this to blur the images on your public portfolio — useful for
                    confidential or private client projects that shouldn't be shown in full detail.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={blurImage}
                  onClick={() => setBlurImage((b) => !b)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors shrink-0 mt-0.5 ${
                    blurImage ? 'bg-[#0a85a7]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      blurImage ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {images.length > 0 && (
                <div className="mt-4 flex items-center gap-3">
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-line bg-gray-100 shrink-0">
                    <img
                      src={images[0]}
                      alt="Preview"
                      className={`w-full h-full object-cover ${blurImage ? 'img-blur-preview' : ''}`}
                      onError={(e) => { e.target.src = '/assets/slider.png' }}
                    />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-ink">
                      {blurImage ? '👁️ Blurred preview' : '👁️ Full preview'}
                    </p>
                    <p className="text-ink-subtle mt-0.5">
                      This is how the first image will appear on the site.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ===================== Description Blocks ===================== */}
            <div className="border border-line rounded-lg">
              <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 border-b border-line rounded-t-lg">
                <div>
                  <p className="text-sm font-semibold text-ink">Description Blocks</p>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Add one or more titled sections of rich text. These are shown in the project's Read More popup on the public site.
                  </p>
                </div>
                <Button type="button" variant="secondary" size="sm" onClick={addDescriptionBlock}>
                  <i className="fa-solid fa-plus mr-1.5"></i>
                  Add Block
                </Button>
              </div>

              <div className="p-4 space-y-4">
                {descriptions.map((block, idx) => (
                  <div key={idx} className="border border-line rounded-lg bg-white">
                    <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-line bg-gray-50/60 rounded-t-lg">
                      <span className="text-xs font-semibold text-ink-muted">
                        Block {idx + 1}
                        {idx === 0 && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-brand-50 text-brand-700">primary</span>
                        )}
                      </span>
                      <div className="flex items-center gap-1">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => moveDescriptionBlock(idx, idx - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-ink-muted hover:text-brand-600 hover:bg-white border border-transparent hover:border-line transition"
                            title="Move up"
                          >
                            <i className="fa-solid fa-arrow-up text-xs"></i>
                          </button>
                        )}
                        {idx < descriptions.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveDescriptionBlock(idx, idx + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-ink-muted hover:text-brand-600 hover:bg-white border border-transparent hover:border-line transition"
                            title="Move down"
                          >
                            <i className="fa-solid fa-arrow-down text-xs"></i>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeDescriptionBlock(idx)}
                          disabled={descriptions.length === 1}
                          className="w-7 h-7 flex items-center justify-center rounded-md text-ink-muted hover:text-red-600 hover:bg-white border border-transparent hover:border-line transition disabled:opacity-40 disabled:cursor-not-allowed"
                          title={descriptions.length === 1 ? 'At least one block is required' : 'Remove block'}
                        >
                          <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                      </div>
                    </div>

                    <div className="p-3 space-y-3">
                      <Field label="Heading (optional)" hint="Shown as a sub-heading above this block's content">
                        <Input
                          value={block.heading}
                          onChange={(e) => updateBlock(idx, { heading: e.target.value })}
                          placeholder="e.g. The Challenge"
                        />
                      </Field>

                      <Field label="Content">
                        <RichTextEditor
                          value={block.content}
                          onChange={(val) => updateBlock(idx, { content: val })}
                          placeholder="Write this section's content…"
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <p className="text-sm font-medium text-ink mb-2">Project Images</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="cursor-pointer bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-100 px-4 py-2.5 rounded-lg flex items-center justify-center text-sm font-medium transition shrink-0">
                  <i className="fa-solid fa-cloud-arrow-up mr-2"></i>
                  {uploading ? 'Uploading…' : 'Upload Images'}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageUpload}
                    multiple
                    disabled={uploading}
                  />
                </label>
                <span className="text-ink-subtle text-sm self-center hidden sm:inline">or</span>
                <div className="flex flex-1 gap-2">
                  <Input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste image URL…"
                  />
                  <Button variant="secondary" onClick={handleAddUrl}>Add URL</Button>
                </div>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {images.map((src, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-line aspect-video bg-gray-50">
                      <img
                        src={src}
                        alt=""
                        className={`w-full h-full object-cover ${blurImage ? 'img-blur-preview' : ''}`}
                      />
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 bg-brand-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded z-10">
                          Cover
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5">
                        {idx > 0 && (
                          <button type="button" onClick={() => moveImage(idx, idx - 1)}
                            className="bg-white text-ink rounded-full p-1.5 shadow" title="Move left">
                            <i className="fa-solid fa-arrow-left text-xs"></i>
                          </button>
                        )}
                        {idx < images.length - 1 && (
                          <button type="button" onClick={() => moveImage(idx, idx + 1)}
                            className="bg-white text-ink rounded-full p-1.5 shadow" title="Move right">
                            <i className="fa-solid fa-arrow-right text-xs"></i>
                          </button>
                        )}
                        <button type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="bg-red-600 text-white rounded-full p-1.5 shadow" title="Remove">
                          <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-5 border-t border-line">
              <Button type="button" variant="secondary" onClick={() => navigate('/admin/projects')}>Cancel</Button>
              <Button type="submit" disabled={saving || uploading}>
                {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Project'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </AdminLayout>
  )
}