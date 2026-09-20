import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import { PageHeader, Card, CardHeader, EmptyState, TableSkeleton } from '../../components/admin/ui'

export default function Subscriptions() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
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

  return (
    <AdminLayout>
      <PageHeader title="Subscriptions" description="Emails collected from your website's newsletter form." />

      <Card className="overflow-hidden">
        <CardHeader title="Email Subscribers" subtitle={`${subs.length} total`} />
        {loading ? (
          <TableSkeleton rows={6} cols={2} />
        ) : subs.length === 0 ? (
          <EmptyState icon="fa-envelope" title="No subscriptions yet" description="Subscribers will appear here." />
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
                {subs.map((s) => (
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