import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import {
  PageHeader, Card, Button, Badge, EmptyState,
  TableSkeleton, ConfirmDialog, Alert,
} from '../../components/admin/ui'

export default function ProjectAdmin() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/auth/login')
  }, [navigate])

  const fetchProjects = async () => {
    setLoading(true); setError('')
    try {
      const res = await axios.get(`${API_BASE_URL}/projects`)
      setProjects(res.data)
    } catch (err) {
      console.error(err); setError('Failed to load portfolio projects')
    } finally { setLoading(false) }
  }
  useEffect(() => { fetchProjects() }, [])

  const handleDelete = async () => {
    if (!confirmId) return
    setDeleting(true)
    try {
      await axios.delete(`${API_BASE_URL}/projects/${confirmId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setProjects(projects.filter((p) => p._id !== confirmId))
      setConfirmId(null)
    } catch (err) {
      console.error(err); setError('Failed to delete project')
    } finally {
      setDeleting(false)
    }
  }

  const featuredCount = projects.filter(p => p.featured).length

  return (
    <AdminLayout>
      <PageHeader
        title="Portfolio Projects"
        description="Manage the projects shown on your website."
        actions={
          <Button as={Link} to="/admin/projects/new">
            <i className="fa-solid fa-plus"></i>
            New Project
          </Button>
        }
      />

      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

      {/* Summary chips */}
      {!loading && projects.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-xs font-medium text-brand-700">
            <i className="fa-solid fa-diagram-project"></i>
            {projects.length} total
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-medium text-emerald-700">
            <i className="fa-solid fa-star"></i>
            {featuredCount} featured
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600">
            <i className="fa-solid fa-list"></i>
            {projects.length - featuredCount} on Portfolio page only
          </span>
        </div>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : projects.length === 0 ? (
          <EmptyState
            icon="fa-diagram-project"
            title="No projects yet"
            description="Start by adding your first portfolio project."
            action={<Button as={Link} to="/admin/projects/new">Add Project</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-subtle border-b border-line bg-gray-50/60">
                  <th className="px-5 py-3 font-medium w-20">No.</th>
                  <th className="px-5 py-3 font-medium w-28">Cover</th>
                  <th className="px-5 py-3 font-medium w-28">Featured</th>
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Description</th>
                  <th className="px-5 py-3 font-medium w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p._id} className="border-b border-line last:border-0 hover:bg-gray-50/60">
                    <td className="px-5 py-3"><Badge tone="brand">#{p.projectNumber}</Badge></td>
                    <td className="px-5 py-3">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover border border-line" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-ink-subtle text-xs">—</div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {p.featured ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                          <i className="fa-solid fa-star text-[10px]"></i>
                          Featured
                        </span>
                      ) : (
                        <span className="text-xs text-ink-subtle">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-medium text-ink">{p.title}</td>
                    <td className="px-5 py-3 text-ink-muted hidden md:table-cell max-w-md truncate">{p.description}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <Button variant="ghost" size="sm" as={Link} to={`/admin/projects/edit/${p._id}`}>
                          <i className="fa-solid fa-pen-to-square"></i>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setConfirmId(p._id)} className="text-red-600 hover:bg-red-50">
                          <i className="fa-solid fa-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        busy={deleting}
        title="Delete project"
        message="Are you sure you want to delete this portfolio project? This action cannot be undone."
        confirmLabel="Delete"
      />
    </AdminLayout>
  )
}