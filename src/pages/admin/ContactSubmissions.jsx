import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import {
  PageHeader, Card, CardHeader, Button, Badge, EmptyState,
  TableSkeleton, Input, Modal, ConfirmDialog, Alert,
} from '../../components/admin/ui'
import { exportData, DownloadMenu } from '../../lib/exportData'

/* ================= FULL OPTION LISTS ================= */
const ALL_SERVICES = [
  'Bulk Data Scraping',
  'Custom Web Scraping Software',
  'Web Automation Bots',
  'AI-Powered Bots',
  'Daily Data Feeds',
  'Third-Party API Integration',
  'Server Setup for Bots & Scripts',
  'PowerBI Dashboard Design',
  'Others',
]

const ALL_BUDGETS = [
  '$0 - $500',
  '$501 - $1000',
  '$1001 - $5000',
  '$5001 - $10000',
  '$10000+',
]

export default function ContactSubmissions() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  /* Filters */
  const [q, setQ] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [serviceFilter, setServiceFilter] = useState('all')
  const [budgetFilter, setBudgetFilter] = useState('all')

  /* Selection + modals */
  const [selected, setSelected] = useState([])
  const [viewContact, setViewContact] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const navigate = useNavigate()

  const authHeaders = () => {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/auth/login')
  }, [navigate])

  const fetchContacts = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${API_BASE_URL}/contacts`, { headers: authHeaders() })
      setContacts(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error(err)
      setError('Failed to load contact submissions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchContacts() }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  /* ---------------- Filtered list ---------------- */
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    const from = fromDate ? new Date(fromDate).getTime() : null
    const to   = toDate   ? new Date(toDate).getTime() + 24 * 60 * 60 * 1000 : null

    return contacts.filter((c) => {
      if (term) {
        const hay = [c.name, c.email, c.phone, c.service, c.message, c.budget]
          .map(x => (x || '').toString().toLowerCase())
        if (!hay.some(f => f.includes(term))) return false
      }
      if (serviceFilter !== 'all' && c.service !== serviceFilter) return false
      if (budgetFilter !== 'all' && c.budget !== budgetFilter) return false
      const t = c.createdAt ? new Date(c.createdAt).getTime() : null
      if (from && (!t || t < from)) return false
      if (to   && (!t || t > to))   return false
      return true
    })
  }, [contacts, q, fromDate, toDate, serviceFilter, budgetFilter])

  /* ---------------- Selection ---------------- */
  const filteredIds = useMemo(() => filtered.map(c => c._id), [filtered])
  const allSelected = filteredIds.length > 0 && filteredIds.every(id => selected.includes(id))
  const someSelected = selected.length > 0 && !allSelected

  const toggleAll = () => {
    if (allSelected) setSelected(prev => prev.filter(id => !filteredIds.includes(id)))
    else setSelected(prev => Array.from(new Set([...prev, ...filteredIds])))
  }
  const toggleOne = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  /* ---------------- Download ---------------- */
  const exportColumns = [
    { label: 'Name',        key: 'name' },
    { label: 'Email',       key: 'email' },
    { label: 'Phone',       key: 'phone' },
    { label: 'Service',     key: 'service' },
    { label: 'Budget',      key: 'budget' },
    { label: 'Message',     key: 'message' },
    { label: 'Submitted',   value: (r) => r.createdAt ? new Date(r.createdAt).toLocaleString() : '' },
  ]

  const handleDownload = (format) => {
    const rows = selected.length > 0
      ? filtered.filter(c => selected.includes(c._id))
      : filtered
    const stamp = new Date().toISOString().slice(0, 10)
    const tag = selected.length > 0 ? `selected-${rows.length}` : `all-${rows.length}`
    exportData(rows, exportColumns, format, `contacts-${tag}-${stamp}`, 'Contact Submissions')
  }

  /* ---------------- Delete ---------------- */
  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return
    setDeleting(true)
    try {
      const ids = confirmDelete.ids
      if (ids.length === 1) {
        await axios.delete(`${API_BASE_URL}/contacts/${ids[0]}`, { headers: authHeaders() })
      } else {
        await axios.post(`${API_BASE_URL}/contacts/bulk-delete`, { ids }, { headers: authHeaders() })
      }
      setToast({ type: 'success', message: `Deleted ${ids.length} submission${ids.length === 1 ? '' : 's'}` })
      setSelected(prev => prev.filter(id => !ids.includes(id)))
      setConfirmDelete(null)
      fetchContacts()
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to delete' })
    } finally {
      setDeleting(false)
    }
  }

  const resetFilters = () => {
    setQ('')
    setFromDate('')
    setToDate('')
    setServiceFilter('all')
    setBudgetFilter('all')
  }

  /* ---------------- Stats ---------------- */
  const totalContacts = contacts.length
  const todayCount = contacts.filter(c => {
    if (!c.createdAt) return false
    const d = new Date(c.createdAt)
    const today = new Date()
    return d.toDateString() === today.toDateString()
  }).length
  const weekCount = contacts.filter(c => {
    if (!c.createdAt) return false
    const diff = Date.now() - new Date(c.createdAt).getTime()
    return diff < 7 * 24 * 60 * 60 * 1000
  }).length

  return (
    <AdminLayout>
      {/* Toast */}
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
        title="Contact Submissions"
        description="Leads captured from your website's contact form."
        actions={
          <div className="flex items-center gap-2">
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => setConfirmDelete({ ids: selected })}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition inline-flex items-center gap-1.5"
              >
                <i className="fa-solid fa-trash"></i>
                Delete {selected.length}
              </button>
            )}
            <DownloadMenu
              onDownload={handleDownload}
              disabled={filtered.length === 0}
              label={selected.length > 0 ? `Download (${selected.length})` : 'Download'}
            />
          </div>
        }
      />

      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#EEFAFD] flex items-center justify-center">
                <i className="fa-solid fa-inbox text-[#0a85a7]"></i>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#086B87]">{totalContacts}</p>
                <p className="text-xs font-medium text-ink-subtle uppercase tracking-wider">Total Submissions</p>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                <i className="fa-solid fa-calendar-day text-emerald-500"></i>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-emerald-600">{todayCount}</p>
                <p className="text-xs font-medium text-ink-subtle uppercase tracking-wider">Today</p>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                <i className="fa-solid fa-calendar-week text-amber-500"></i>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-amber-600">{weekCount}</p>
                <p className="text-xs font-medium text-ink-subtle uppercase tracking-wider">Last 7 days</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader
          title="All Submissions"
          subtitle={`${filtered.length} of ${contacts.length} shown${selected.length > 0 ? ` · ${selected.length} selected` : ''}`}
        />

        {/* Filter bar */}
        <div className="px-5 py-4 border-b border-line flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-ink-subtle mb-1">Search</label>
            <Input
              placeholder="Search name, email, message…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {/* Service — now shows ALL services */}
          <div className="w-[210px]">
            <label className="block text-xs font-medium text-ink-subtle mb-1">Service</label>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="all">All services</option>
              {ALL_SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Budget — now shows ALL budgets */}
          <div className="w-[170px]">
            <label className="block text-xs font-medium text-ink-subtle mb-1">Budget</label>
            <select
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="all">All budgets</option>
              {ALL_BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="w-[150px]">
            <label className="block text-xs font-medium text-ink-subtle mb-1">From date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="w-[150px]">
            <label className="block text-xs font-medium text-ink-subtle mb-1">To date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-line bg-white hover:bg-gray-50 transition"
          >
            <i className="fa-solid fa-xmark mr-1"></i> Reset
          </button>
        </div>

        {loading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="fa-inbox"
            title={contacts.length === 0 ? 'No submissions yet' : 'No matches'}
            description={contacts.length === 0
              ? 'Submissions from your contact form will appear here.'
              : 'Try adjusting your filters.'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-subtle border-b border-line bg-gray-50/60">
                  <th className="px-5 py-3 font-medium w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={el => { if (el) el.indeterminate = someSelected }}
                      onChange={toggleAll}
                      className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-3 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Contact</th>
                  <th className="px-3 py-3 font-medium hidden md:table-cell">Service</th>
                  <th className="px-3 py-3 font-medium hidden lg:table-cell">Budget</th>
                  <th className="px-3 py-3 font-medium hidden lg:table-cell">Message</th>
                  <th className="px-3 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const isSel = selected.includes(c._id)
                  return (
                    <tr
                      key={c._id}
                      className={`border-b border-line last:border-0 hover:bg-gray-50/60 ${isSel ? 'bg-brand-50/40' : ''}`}
                    >
                      <td className="px-5 py-3">
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={() => toggleOne(c._id)}
                          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-medium text-ink truncate max-w-[180px]">{c.name || '—'}</p>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-ink-muted text-xs truncate max-w-[200px]">{c.email || '—'}</p>
                        {c.phone && <p className="text-ink-subtle text-[11px] mt-0.5">{c.phone}</p>}
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        {c.service ? <Badge tone="brand">{c.service}</Badge> : <span className="text-ink-subtle">—</span>}
                      </td>
                      <td className="px-3 py-3 text-ink-muted hidden lg:table-cell">
                        {c.budget || '—'}
                      </td>
                      <td className="px-3 py-3 text-ink-muted hidden lg:table-cell max-w-[260px] truncate">
                        {c.message || '—'}
                      </td>
                      <td className="px-3 py-3 text-ink-muted whitespace-nowrap">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewContact(c)}
                          >
                            View
                          </Button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete({ ids: [c._id] })}
                            title="Delete submission"
                            className="w-8 h-8 flex items-center justify-center rounded-md text-red-600 hover:bg-red-50 transition"
                          >
                            <i className="fa-solid fa-trash text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ---------------- View modal ---------------- */}
      <Modal
        open={!!viewContact}
        onClose={() => setViewContact(null)}
        title="Submission Details"
        maxWidth="max-w-2xl"
      >
        {viewContact && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['Name', viewContact.name],
                ['Email', viewContact.email],
                ['Phone', viewContact.phone || '—'],
                ['Service', viewContact.service || '—'],
                ['Budget', viewContact.budget || '—'],
                ['Submitted', viewContact.createdAt ? new Date(viewContact.createdAt).toLocaleString() : '—'],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs uppercase tracking-wide text-ink-subtle font-medium">{k}</p>
                  <p className="text-ink mt-0.5 break-words">{v}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-ink-subtle font-medium mb-1">Message</p>
              <div className="bg-gray-50 border border-line rounded-lg p-4 whitespace-pre-line text-ink">
                {viewContact.message || '—'}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-line">
              <a
                href={`mailto:${viewContact.email}`}
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-line hover:bg-gray-50 transition inline-flex items-center gap-1.5"
              >
                <i className="fa-solid fa-envelope"></i>
                Reply by email
              </a>
              <Button
                variant="secondary"
                onClick={() => setViewContact(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ---------------- Delete confirmation ---------------- */}
      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDeleteConfirm}
        busy={deleting}
        title="Delete submission"
        message={
          confirmDelete
            ? `Delete ${confirmDelete.ids.length} submission${confirmDelete.ids.length === 1 ? '' : 's'}? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete permanently"
      />
    </AdminLayout>
  )
}