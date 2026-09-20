import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import {
  PageHeader, Card, Button, EmptyState, Skeleton,
  ConfirmDialog, Alert, Badge,
} from '../../components/admin/ui'

export default function BlogAdmin() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmId, setConfirmId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/auth/login')
  }, [navigate])

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${API_BASE_URL}/blogs`)
        setBlogs(res.data)
      } catch (err) {
        console.error(err); setError('Failed to load blogs')
      } finally { setLoading(false) }
    })()
  }, [])

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/blogs/${confirmId}`)
      setBlogs(blogs.filter((b) => b._id !== confirmId))
      setConfirmId(null)
    } catch (err) {
      console.error(err); setError('Failed to delete blog')
    }
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Blog Posts"
        description="Create, edit and publish posts for your website."
        actions={<Button as={Link} to="/blogs/new"><i className="fa-solid fa-plus"></i>New Post</Button>}
      />

      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

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
          {blogs.map((b) => (
            <Card key={b._id} className="overflow-hidden flex flex-col">
              {b.featuredImage && (
                <div className="h-44 bg-gray-100 overflow-hidden">
                  <img src={b.featuredImage} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {b.isFeatured && <Badge tone="warning">Featured</Badge>}
                  {b.tags?.slice(0, 2).map((t) => <Badge key={t}>{t}</Badge>)}
                </div>
                <Link to={`/blogs/${b.slug}`} className="text-base font-semibold text-ink hover:text-brand-600 line-clamp-2">
                  {b.title}
                </Link>
                <div
                  className="text-sm text-ink-muted mt-2 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: b.content }}
                />
              </div>
              <div className="px-5 py-3 border-t border-line flex justify-between items-center">
                <Link to={`/blogs/${b.slug}`} className="text-brand-600 text-sm font-medium hover:underline">
                  Read more →
                </Link>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" as={Link} to={`/blogs/edit/${b._id}`}>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmId(b._id)} className="text-red-600 hover:bg-red-50">
                    <i className="fa-solid fa-trash"></i>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete blog post"
        message="Are you sure you want to delete this blog post?"
        confirmLabel="Delete"
      />
    </AdminLayout>
  )
}