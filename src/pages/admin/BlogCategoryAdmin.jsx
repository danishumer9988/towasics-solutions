import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import {
  PageHeader, Card, Button, Badge, EmptyState,
  TableSkeleton, Field, Input, Modal, ConfirmDialog, Alert,
} from '../../components/admin/ui'

export default function BlogCategoryAdmin() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ name: '', order: 0 })
  const [saving, setSaving] = useState(false)

  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const navigate = useNavigate()
  const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/auth/login')
  }, [navigate])

  const fetchCategories = async () => {
    setLoading(true); setError('')
    try {
      const res = await axios.get(`${API_BASE_URL}/blog-categories`)
      setCategories(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      setError('Failed to load blog categories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  const openCreate = () => {
    setForm({ name: '', order: categories.length })
    setModal({ type: 'create' })
  }

  const openEdit = (cat) => {
    setForm({ name: cat.name, order: cat.order || 0 })
    setModal({ type: 'edit', category: cat })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setToast({ type: 'error', message: 'Name is required.' })

    setSaving(true)
    try {
      if (modal.type === 'edit') {
        await axios.put(`${API_BASE_URL}/blog-categories/${modal.category._id}`,
          { name: form.name.trim(), order: Number(form.order) || 0 },
          { headers: authHeaders() }
        )
        setToast({ type: 'success', message: 'Category updated.' })
      } else {
        await axios.post(`${API_BASE_URL}/blog-categories`,
          { name: form.name.trim(), order: Number(form.order) || 0 },
          { headers: authHeaders() }
        )
        setToast({ type: 'success', message: 'Category created.' })
      }
      setModal(null)
      fetchCategories()
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to save.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmId) return
    setDeleting(true)
    try {
      await axios.delete(`${API_BASE_URL}/blog-categories/${confirmId}`, { headers: authHeaders() })
      setToast({ type: 'success', message: 'Category deleted.' })
      setConfirmId(null)
      fetchCategories()
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to delete.' })
      setConfirmId(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminLayout>
      {toast && (
        <div className="fixed top-6 right-6 z-[9999]">
          <div className={`flex items-start gap-3 min-w-[280px] px-4 py-3 rounded-xl shadow-lg border bg-white ${
            toast.type === 'success' ? 'border-emerald-100' : 'border-red-100'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              toast.type === 'success' ? 'bg-emerald-50' : 'bg-red-50'
            }`}>
              <i className={`fa-solid ${toast.type === 'success' ? 'fa-check text-emerald-500' : 'fa-xmark text-red-500'}`}></i>
            </div>
            <p className="text-sm text-ink mt-1">{toast.message}</p>
          </div>
        </div>
      )}

      <PageHeader
        title="Blog Categories"
        description="Manage categories shown on the public blog page."
        actions={<Button onClick={openCreate}><i className="fa-solid fa-plus"></i> New Category</Button>}
      />

      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

      <Card className="overflow-hidden">
        {loading ? (
          <TableSkeleton rows={5} cols={4} />
        ) : categories.length === 0 ? (
          <EmptyState icon="fa-tags" title="No categories yet" description="Create a category to organize your blog posts." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-subtle border-b border-line bg-gray-50/60">
                  <th className="px-5 py-3 font-medium w-20">Order</th>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Slug</th>
                  <th className="px-5 py-3 font-medium w-32">Blogs</th>
                  <th className="px-5 py-3 font-medium w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id} className="border-b border-line last:border-0 hover:bg-gray-50/60">
                    <td className="px-5 py-3 text-ink-muted">{cat.order}</td>
                    <td className="px-5 py-3 font-medium text-ink">{cat.name}</td>
                    <td className="px-5 py-3 text-ink-muted font-mono text-xs hidden md:table-cell">{cat.slug}</td>
                    <td className="px-5 py-3"><Badge tone={cat.blogCount > 0 ? 'brand' : 'neutral'}>{cat.blogCount || 0}</Badge></td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(cat)}><i className="fa-solid fa-pen-to-square"></i></Button>
                        <Button variant="ghost" size="sm" onClick={() => setConfirmId(cat._id)} className="text-red-600 hover:bg-red-50"><i className="fa-solid fa-trash"></i></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === 'edit' ? 'Edit Category' : 'New Category'} maxWidth="max-w-md">
        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Category Name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Web Scraping" autoFocus required />
          </Field>
          <Field label="Order">
            <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-2 pt-4 border-t border-line">
            <Button type="button" variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Category'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        busy={deleting}
        title="Delete Category"
        message="Are you sure? You can only delete this if no blogs are using it."
        confirmLabel="Delete"
      />
    </AdminLayout>
  )
}