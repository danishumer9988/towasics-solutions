import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import {
  PageHeader, Card, CardHeader, EmptyState, TableSkeleton, Input,
  Button, ConfirmDialog, Alert,
} from '../../components/admin/ui'
import { exportData, DownloadMenu } from '../../lib/exportData'

/* -------------------- Toast -------------------- */
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onClose, 3200)
    return () => clearTimeout(t)
  }, [toast, onClose])

  if (!toast) return null
  const isSuccess = toast.type === 'success'

  return (
    <div className="fixed top-6 right-6 z-[9999]">
      <div className={`flex items-start gap-3 min-w-[280px] px-4 py-3 rounded-xl shadow-lg border bg-white ${
        isSuccess ? 'border-emerald-100' : 'border-red-100'
      }`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isSuccess ? 'bg-emerald-50' : 'bg-red-50'
        }`}>
          <i className={`fa-solid ${isSuccess ? 'fa-check text-emerald-500' : 'fa-xmark text-red-500'}`}></i>
        </div>
        <p className="text-sm text-ink mt-1">{toast.message}</p>
      </div>
    </div>
  )
}

/* -------------------- Main Page -------------------- */
export default function Subscriptions() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  // Filters
  const [q, setQ] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  // Selection
  const [selected, setSelected] = useState([])

  // Delete confirm
  const [confirmDelete, setConfirmDelete] = useState(null)  // { ids: [...] } | null
  const [deleting, setDeleting] = useState(false)

  const navigate = useNavigate()

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  /* ---------- Auth guard ---------- */
  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/auth/login')
  }, [navigate])

  /* ---------- Fetch subscriptions ---------- */
  const fetchSubs = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${API_BASE_URL}/subscriptions`, authHeaders())
      setSubs(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error(err)
      setError('Failed to load subscriptions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSubs() }, [])

  /* ---------- Mark as read on mount ---------- */
  useEffect(() => {
    const markRead = async () => {
      try {
        await axios.put(`${API_BASE_URL}/subscriptions/mark-read`, {}, authHeaders())
      } catch (err) {
        console.error('Failed to mark as read', err)
      }
    }
    markRead()
  }, [])

  /* ---------- Filtered list ---------- */
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    const from = fromDate ? new Date(fromDate).getTime() : null
    const to = toDate ? new Date(toDate).getTime() + 24 * 60 * 60 * 1000 : null

    return subs.filter((s) => {
      if (term && !(s.email || '').toLowerCase().includes(term)) return false
      const t = s.createdAt ? new Date(s.createdAt).getTime() : null
      if (from && (!t || t < from)) return false
      if (to && (!t || t > to)) return false
      return true
    })
  }, [subs, q, fromDate, toDate])

  /* ---------- Selection logic ---------- */
  const filteredIds = useMemo(() => filtered.map((s) => s._id), [filtered])
  const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selected.includes(id))
  const someSelected = selected.length > 0 && !allSelected

  const toggleAll = () => {
    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !filteredIds.includes(id)))
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...filteredIds])))
    }
  }

  const toggleOne = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  /* ---------- Download ---------- */
  const columns = [
    { label: 'Email', key: 'email' },
    { label: 'Subscribed', value: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleString() : '') },
  ]

  const handleDownload = (format) => {
    const rows = selected.length > 0
      ? filtered.filter((s) => selected.includes(s._id))
      : filtered
    const stamp = new Date().toISOString().slice(0, 10)
    const tag = selected.length > 0 ? `selected-${rows.length}` : `all-${rows.length}`
    exportData(rows, columns, format, `subscriptions-${tag}-${stamp}`, 'Email Subscriptions')
  }

  /* ---------- Delete ---------- */
  const handleDeleteConfirm = async () => {
    if (!confirmDelete || deleting) return
    setDeleting(true)
    try {
      const ids = confirmDelete.ids
      if (ids.length === 1) {
        await axios.delete(`${API_BASE_URL}/subscriptions/${ids[0]}`, authHeaders())
      } else {
        await axios.post(`${API_BASE_URL}/subscriptions/bulk-delete`, { ids }, authHeaders())
      }

      setToast({ type: 'success', message: `Deleted ${ids.length} subscription${ids.length === 1 ? '' : 's'}.` })
      setSelected((prev) => prev.filter((id) => !ids.includes(id)))
      setConfirmDelete(null)
      fetchSubs()
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to delete.' })
    } finally {
      setDeleting(false)
    }
  }

  const resetFilters = () => {
    setQ('')
    setFromDate('')
    setToDate('')
  }

  /* ---------- Stats ---------- */
  const totalCount = subs.length
  const todayCount = subs.filter((s) => {
    if (!s.createdAt) return false
    return new Date(s.createdAt).toDateString() === new Date().toDateString()
  }).length
  const weekCount = subs.filter((s) => {
    if (!s.createdAt) return false
    return Date.now() - new Date(s.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
  }).length

  return (
    <AdminLayout>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <PageHeader
        title="Subscriptions"
        description="Emails collected from your website's newsletter form."
        actions={
          <div className="flex items-center gap-2">
            {/* Bulk delete button — only shows when items selected */}
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

            {/* Download — respects selection */}
            <DownloadMenu
              onDownload={handleDownload}
              disabled={filtered.length === 0}
              label={selected.length > 0 ? `Download (${selected.length})` : 'Download'}
            />
          </div>
        }
      />

      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

      {/* ---------- Stats cards ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#EEFAFD] flex items-center justify-center">
                <i className="fa-solid fa-envelope text-[#0a85a7]"></i>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#086B87]">{totalCount}</p>
                <p className="text-xs font-medium text-ink-subtle uppercase tracking-wider">Total Subscribers</p>
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

      {/* ---------- Table card ---------- */}
      <Card className="overflow-hidden">
        <CardHeader
          title="Email Subscribers"
          subtitle={`${filtered.length} of ${subs.length} shown${selected.length > 0 ? ` · ${selected.length} selected` : ''}`}
        />

        {/* Filter bar */}
        <div className="px-5 py-4 border-b border-line flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-ink-subtle mb-1">Search</label>
            <Input
              placeholder="Search email…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
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
            <i className="fa-solid fa-xmark mr-1"></i>
            Reset
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <TableSkeleton rows={6} cols={4} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="fa-envelope"
            title={subs.length === 0 ? 'No subscriptions yet' : 'No matches'}
            description={subs.length === 0 ? 'Subscribers will appear here.' : 'Try adjusting your filters.'}
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
                      ref={(el) => { if (el) el.indeterminate = someSelected }}
                      onChange={toggleAll}
                      className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-3 py-3 font-medium">Email</th>
                  <th className="px-3 py-3 font-medium">Subscribed</th>
                  <th className="px-3 py-3 font-medium text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const isSel = selected.includes(s._id)
                  return (
                    <tr
                      key={s._id}
                      className={`border-b border-line last:border-0 hover:bg-gray-50/60 ${isSel ? 'bg-brand-50/40' : ''}`}
                    >
                      <td className="px-5 py-3">
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={() => toggleOne(s._id)}
                          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-medium text-ink truncate max-w-[400px]">{s.email}</p>
                      </td>
                      <td className="px-3 py-3 text-ink-muted whitespace-nowrap">
                        {s.createdAt ? new Date(s.createdAt).toLocaleString() : '—'}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setConfirmDelete({ ids: [s._id] })}
                          title="Delete subscription"
                          className="w-8 h-8 inline-flex items-center justify-center rounded-md text-red-600 hover:bg-red-50 transition"
                        >
                          <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ---------- Delete confirmation ---------- */}
      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDeleteConfirm}
        busy={deleting}
        title="Delete subscription"
        message={
          confirmDelete
            ? `Delete ${confirmDelete.ids.length} subscription${confirmDelete.ids.length === 1 ? '' : 's'}? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete permanently"
      />
    </AdminLayout>
  )
}