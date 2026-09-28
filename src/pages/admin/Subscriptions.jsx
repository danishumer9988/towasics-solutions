import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import { PageHeader, Card, CardHeader, EmptyState, TableSkeleton, Input } from '../../components/admin/ui'
import { exportData, DownloadMenu } from '../../lib/exportData'

export default function Subscriptions() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/auth/login')
  }, [navigate])

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${API_BASE_URL}/subscriptions`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        setSubs(res.data)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    })()
  }, [])

  /* -------------------- Filtered list -------------------- */
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    const from = fromDate ? new Date(fromDate).getTime() : null
    const to   = toDate   ? new Date(toDate).getTime() + 24 * 60 * 60 * 1000 : null

    return subs.filter((s) => {
      if (term && !(s.email || '').toLowerCase().includes(term)) return false
      const t = s.createdAt ? new Date(s.createdAt).getTime() : null
      if (from && (!t || t < from)) return false
      if (to   && (!t || t > to))   return false
      return true
    })
  }, [subs, q, fromDate, toDate])

  /* -------------------- Download -------------------- */
  const columns = [
    { label: 'Email',        key: 'email' },
    { label: 'Subscribed',   value: (r) => r.createdAt ? new Date(r.createdAt).toLocaleString() : '' },
  ]

  const handleDownload = (format) => {
    const stamp = new Date().toISOString().slice(0, 10)
    exportData(
      filtered,
      columns,
      format,
      `subscriptions-${stamp}`,
      'Email Subscriptions'
    )
  }

  const resetFilters = () => {
    setQ('')
    setFromDate('')
    setToDate('')
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Subscriptions"
        description="Emails collected from your website's newsletter form."
        actions={
          <DownloadMenu
            onDownload={handleDownload}
            disabled={filtered.length === 0}
          />
        }
      />

      <Card className="overflow-hidden">
        <CardHeader
          title="Email Subscribers"
          subtitle={`${filtered.length} of ${subs.length} shown`}
        />

        {/* ---------- Filter bar ---------- */}
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

        {loading ? (
          <TableSkeleton rows={6} cols={2} />
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
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s._id} className="border-b border-line last:border-0 hover:bg-gray-50/60">
                    <td className="px-5 py-3 font-medium text-ink">{s.email}</td>
                    <td className="px-5 py-3 text-ink-muted">
                      {s.createdAt ? new Date(s.createdAt).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AdminLayout>
  )
}