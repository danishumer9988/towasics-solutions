import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import {
  PageHeader, Card, CardHeader, Button, EmptyState,
  TableSkeleton, Input, Modal, ConfirmDialog, Alert,
} from '../../components/admin/ui'
import { exportData, DownloadMenu } from '../../lib/exportData'

export default function EstimateSubmissions() {
  const [estimates, setEstimates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  const [q, setQ] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const [selected, setSelected] = useState([])
  const [viewItem, setViewItem] = useState(null)
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

  const fetchEstimates = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${API_BASE_URL}/estimates`, { headers: authHeaders() })
      setEstimates(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error(err)
      setError('Failed to load estimate requests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEstimates() }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    const from = fromDate ? new Date(fromDate).getTime() : null
    const to   = toDate   ? new Date(toDate).getTime() + 24 * 60 * 60 * 1000 : null

    return estimates.filter((e) => {
      if (term) {
        const hay = [e.name, e.email, e.message].map(x => (x || '').toString().toLowerCase())
        if (!hay.some(f => f.includes(term))) return false
      }
      const t = e.createdAt ? new Date(e.createdAt).getTime() : null
      if (from && (!t || t < from)) return false
      if (to   && (!t || t > to))   return false
      return true
    })
  }, [estimates, q, fromDate, toDate])

  const filteredIds = useMemo(() => filtered.map(e => e._id), [filtered])
  const allSelected = filteredIds.length > 0 && filteredIds.every(id => selected.includes(id))
  const someSelected = selected.length > 0 && !allSelected

  const toggleAll = () => {
    if (allSelected) setSelected(prev => prev.filter(id => !filteredIds.includes(id)))
    else setSelected(prev => Array.from(new Set([...prev, ...filteredIds])))
  }
  const toggleOne = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const exportColumns = [
    { label: 'Name',      key: 'name' },
    { label: 'Email',     key: 'email' },
    { label: 'Message',   key: 'message' },
    { label: 'Received',  value: (r) => r.createdAt ? new Date(r.createdAt).toLocaleString() : '' },
  ]

  const handleDownload = (format) => {
    const rows = selected.length > 0 ? filtered.filter(e => selected.includes(e._id)) : filtered
    const stamp = new Date().toISOString().slice(0, 10)
    const tag = selected.length > 0 ? `selected-${rows.length}` : `all-${rows.length}`
    exportData(rows, exportColumns, format, `estimate-requests-${tag}-${stamp}`, 'Estimate Requests')
  }

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return
    setDeleting(true)
    try {
      const ids = confirmDelete.ids
      if (ids.length === 1) {
        await axios.delete(`${API_BASE_URL}/estimates/${ids[0]}`, { headers: authHeaders() })
      } else {
        await axios.post(`${API_BASE_URL}/estimates/bulk-delete`, { ids }, { headers: authHeaders() })
      }
      setToast({ type: 'success', message: `Deleted ${ids.length} request${ids.length === 1 ? '' : 's'}` })
      setSelected(prev => prev.filter(id => !ids.includes(id)))
      setConfirmDelete(null)
      fetchEstimates()
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to delete' })
    } finally {
      setDeleting(false)
    }
  }

  const resetFilters = () => { setQ(''); setFromDate(''); setToDate('') }

  const totalCount = estimates.length
  const todayCount = estimates.filter(e => {
    if (!e.createdAt) return false
    return new Date(e.createdAt).toDateString() === new Date().toDateString()
  }).length
  const weekCount = estimates.filter(e => {
    if (!e.createdAt) return false
    return Date.now() - new Date(e.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
  }).length

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
        title="Estimate Requests"
        description="Free project estimate submissions from the website popup."
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#EEFAFD] flex items-center justify-center">
                <i className="fa-solid fa-calculator text-[#0a85a7]"></i>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#086B87]">{totalCount}</p>
                <p className="text-xs font-medium text-ink-subtle uppercase tracking-wider">Total Requests</p>
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
          title="All Estimate Requests"
          subtitle={`${filtered.length} of ${estimates.length} shown${selected.length > 0 ? ` · ${selected.length} selected` : ''}`}
        />

        <div className="px-5 py-4 border-b border-line flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-ink-subtle mb-1">Search</label>
            <Input
              placeholder="Search name, email, message…"
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
            <i className="fa-solid fa-xmark mr-1"></i> Reset
          </button>
        </div>

        {loading ? (
          <TableSkeleton rows={8} cols={5} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="fa-calculator"
            title={estimates.length === 0 ? 'No estimate requests yet' : 'No matches'}
            description={estimates.length === 0
              ? 'Requests from the website popup will appear here.'
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
                  <th className="px-3 py-3 font-medium">Email</th>
                  <th className="px-3 py-3 font-medium hidden lg:table-cell">Message</th>
                  <th className="px-3 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => {
                  const isSel = selected.includes(e._id)
                  return (
                    <tr
                      key={e._id}
                      className={`border-b border-line last:border-0 hover:bg-gray-50/60 ${isSel ? 'bg-brand-50/40' : ''}`}
                    >
                      <td className="px-5 py-3">
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={() => toggleOne(e._id)}
                          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-medium text-ink truncate max-w-[180px]">{e.name || '—'}</p>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-ink-muted text-xs truncate max-w-[220px]">{e.email || '—'}</p>
                      </td>
                      <td className="px-3 py-3 text-ink-muted hidden lg:table-cell max-w-[320px] truncate">
                        {e.message || '—'}
                      </td>
                      <td className="px-3 py-3 text-ink-muted whitespace-nowrap">
                        {e.createdAt ? new Date(e.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setViewItem(e)}>
                            View
                          </Button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete({ ids: [e._id] })}
                            title="Delete request"
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

      <Modal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title="Estimate Request Details"
        maxWidth="max-w-2xl"
      >
        {viewItem && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['Name', viewItem.name],
                ['Email', viewItem.email],
                ['Received', viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString() : '—'],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs uppercase tracking-wide text-ink-subtle font-medium">{k}</p>
                  <p className="text-ink mt-0.5 break-words">{v}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-ink-subtle font-medium mb-1">Project Description</p>
              <div className="bg-gray-50 border border-line rounded-lg p-4 whitespace-pre-line text-ink">
                {viewItem.message || '—'}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-line">
              <a
                href={`mailto:${viewItem.email}`}
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-line hover:bg-gray-50 transition inline-flex items-center gap-1.5"
              >
                <i className="fa-solid fa-envelope"></i>
                Reply by email
              </a>
              <Button variant="secondary" onClick={() => setViewItem(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDeleteConfirm}
        busy={deleting}
        title="Delete estimate request"
        message={
          confirmDelete
            ? `Delete ${confirmDelete.ids.length} request${confirmDelete.ids.length === 1 ? '' : 's'}? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete permanently"
      />
    </AdminLayout>
  )
}