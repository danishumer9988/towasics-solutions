import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import {
  PageHeader, Card, Button, EmptyState, Skeleton,
  ConfirmDialog, Alert, Badge,
} from '../../components/admin/ui'

const isBlogPublished = (b) => b.isPublished !== false

export default function BlogAdmin() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState(null)   // NEW
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/auth/login')
  }, [navigate])

  const fetchBlogs = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${API_BASE_URL}/blogs`)
      setBlogs(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBlogs() }, [])

  const handleDelete = async () => {
    if (!confirmId || deleting) return
    setDeleting(true)
    setError('')
    try {
      await axios.delete(`${API_BASE_URL}/blogs/${confirmId}`)
      setBlogs((prev) => prev.filter((b) => b._id !== confirmId))
      setConfirmId(null)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to delete blog')
      setConfirmId(null)
    } finally {
      setDeleting(false)
    }
  }

  /* ---------- NEW: toggle published ---------- */
  const togglePublished = async (blog) => {
    if (togglingId) return
    setTogglingId(blog._id)
    const nextState = !isBlogPublished(blog)
    setBlogs((prev) =>
      prev.map((b) => (b._id === blog._id ? { ...b, isPublished: nextState } : b))
    )
    try {
      await axios.put(`${API_BASE_URL}/blogs/${blog._id}`, { isPublished: nextState })
    } catch (err) {
      console.error(err)
      setBlogs((prev) =>
        prev.map((b) => (b._id === blog._id ? { ...b, isPublished: blog.isPublished } : b))
      )
      setError('Failed to change publish status')
    } finally {
      setTogglingId(null)
    }
  }

  const publishedCount = blogs.filter(isBlogPublished).length
  const draftCount = blogs.length - publishedCount

  return (
    <AdminLayout>
      <PageHeader
        title="Blog Posts"
        description="Create, edit and publish posts for your website."
        actions={
          <Button as={Link} to="/blogs/new">
            <i className="fa-solid fa-plus"></i>
            New Post
          </Button>
        }
      />

      {error && (
        <div className="mb-4">
          <Alert onClose={() => setError('')}>{error}</Alert>
        </div>
      )}

      {/* Summary chips */}
      {!loading && blogs.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-xs font-medium text-brand-700">
            <i className="fa-solid fa-newspaper"></i>
            {blogs.length} total
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-medium text-emerald-700">
            <i className="fa-solid fa-circle-check"></i>
            {publishedCount} published
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-xs font-medium text-amber-700">
            <i className="fa-solid fa-eye-slash"></i>
            {draftCount} draft{draftCount === 1 ? '' : 's'}
          </span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-44 w-full rounded-none" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </Card>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <Card>
          <EmptyState
            icon="fa-newspaper"
            title="No blog posts yet"
            description="Publish your first blog post to share with your audience."
            action={<Button as={Link} to="/blogs/new">Write a Post</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map((b) => {
            const published = isBlogPublished(b)
            const busy = togglingId === b._id
            return (
              <Card key={b._id} className="overflow-hidden flex flex-col">
                {b.featuredImage && (
                  <div className="h-44 bg-gray-100 overflow-hidden">
                    <img src={b.featuredImage} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {/* NEW: Published toggle */}
                    <button
                      type="button"
                      onClick={() => togglePublished(b)}
                      disabled={busy}
                      title={published ? 'Click to unpublish (move to draft)' : 'Click to publish'}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer disabled:opacity-60 disabled:cursor-wait ${
                        published
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      {busy ? (
                        <i className="fa-solid fa-spinner fa-spin text-[10px]"></i>
                      ) : (
                        <i className={`fa-solid ${published ? 'fa-eye' : 'fa-eye-slash'} text-[10px]`}></i>
                      )}
                      {published ? 'Published' : 'Draft'}
                    </button>

                    {b.isFeatured && <Badge tone="warning">Featured</Badge>}
                    {b.tags?.slice(0, 2).map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                  <Link
                    to={`/blogs/${b.slug}`}
                    className="text-base font-semibold text-ink hover:text-brand-600 line-clamp-2"
                  >
                    {b.title}
                  </Link>
                  <div
                    className="text-sm text-ink-muted mt-2 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: b.content }}
                  />
                </div>
                <div className="px-5 py-3 border-t border-line flex justify-between items-center">
                  <Link
                    to={`/blogs/${b.slug}`}
                    className="text-brand-600 text-sm font-medium hover:underline"
                  >
                    Read more →
                  </Link>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" as={Link} to={`/blogs/edit/${b._id}`}>
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmId(b._id)}
                      className="text-red-600 hover:bg-red-50"
                      title="Delete blog post"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => !deleting && setConfirmId(null)}
        onConfirm={handleDelete}
        busy={deleting}
        title="Delete blog post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmLabel="Delete"
      />
    </AdminLayout>
  )
}