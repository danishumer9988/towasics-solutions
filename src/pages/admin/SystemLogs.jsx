import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import { PageHeader, Card, CardHeader, EmptyState, TableSkeleton, Badge } from '../../components/admin/ui'

export default function SystemLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/auth/login')
  }, [navigate])

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/logs`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setLogs(res.data)
      } catch (err) {
        console.error('Failed to load logs', err)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  const getBadgeTone = (action) => {
    if (action === 'ADMIN_LOGIN') return 'success'
    if (action === 'BACKUP_RUN' || action === 'BACKUP_DOWNLOAD') return 'info'
    if (action.includes('DELETE')) return 'danger'
    if (action.includes('UPDATE')) return 'warning'
    return 'neutral'
  }

  return (
    <AdminLayout>
      <PageHeader
        title="System Logs"
        description="Audit trail of important events and actions in the admin panel."
      />

      <Card className="overflow-hidden">
        <CardHeader title="Recent Activity" subtitle="Showing latest 200 events" />

        {loading ? (
          <TableSkeleton rows={8} cols={4} />
        ) : logs.length === 0 ? (
          <EmptyState icon="fa-clipboard-list" title="No logs found" description="Important actions will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-subtle border-b border-line bg-gray-50/60">
                  <th className="px-5 py-3 font-medium w-48">Time</th>
                  <th className="px-5 py-3 font-medium w-48">Action</th>
                  <th className="px-5 py-3 font-medium w-64">User / IP</th>
                  <th className="px-5 py-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-b border-line last:border-0 hover:bg-gray-50/60">
                    <td className="px-5 py-3 text-ink-muted whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={getBadgeTone(log.action)}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-ink">{log.user}</p>
                      {log.ip && <p className="text-xs text-ink-subtle">{log.ip}</p>}
                    </td>
                    <td className="px-5 py-3 text-ink-muted">
                      {log.details}
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