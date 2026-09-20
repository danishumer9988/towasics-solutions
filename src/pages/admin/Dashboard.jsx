import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import {
  PageHeader, Card, CardHeader, StatCard, Badge, Modal,
  EmptyState, TableSkeleton, Button,
} from '../../components/admin/ui'

export default function Dashboard() {
  const [contacts, setContacts] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [blogs, setBlogs] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/auth/login')
  }, [navigate])

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }
    const load = async () => {
      setLoading(true)
      try {
        const [c, s, b, p] = await Promise.all([
          axios.get(`${API_BASE_URL}/contacts`, config).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/subscriptions`, config).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/blogs`).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/projects`).catch(() => ({ data: [] })),
        ])
        setContacts(c.data || [])
        setSubscriptions(s.data || [])
        setBlogs(b.data || [])
        setProjects(p.data || [])
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const recentContacts = contacts.slice(0, 5)

  return (
    <AdminLayout>
      <PageHeader
        title="Dashboard"
        description="Overview of your site activity and recent submissions."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Projects"      value={projects.length}      icon="fa-diagram-project" tone="brand" />
        <StatCard label="Blog Posts"    value={blogs.length}         icon="fa-newspaper"       tone="info" />
        <StatCard label="Subscribers"   value={subscriptions.length} icon="fa-envelope"        tone="success" />
        <StatCard label="Contact Forms" value={contacts.length}      icon="fa-inbox"           tone="warning" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent contacts */}
        <Card className="xl:col-span-2 overflow-hidden">
          <CardHeader
            title="Recent Contact Submissions"
            subtitle="Latest inquiries from your website."
          />
          {loading ? (
            <TableSkeleton rows={4} cols={4} />
          ) : recentContacts.length === 0 ? (
            <EmptyState
              icon="fa-inbox"
              title="No contact submissions yet"
              description="Submissions from your website will show up here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-ink-subtle border-b border-line">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Service</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentContacts.map((c) => (
                    <tr key={c._id} className="border-b border-line last:border-0 hover:bg-gray-50/60">
                      <td className="px-5 py-3 font-medium text-ink">{c.name}</td>
                      <td className="px-5 py-3 text-ink-muted">{c.email}</td>
                      <td className="px-5 py-3">
                        {c.service ? <Badge tone="brand">{c.service}</Badge> : <span className="text-ink-subtle">—</span>}
                      </td>
                      <td className="px-5 py-3 text-ink-muted">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => { setSelectedContact(c); setModalOpen(true) }}
                          className="text-brand-600 hover:text-brand-700 font-medium text-xs"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Subscriptions summary */}
        <Card className="overflow-hidden">
          <CardHeader
            title="Recent Subscribers"
            subtitle={`${subscriptions.length} total`}
          />
          {loading ? (
            <TableSkeleton rows={4} cols={1} />
          ) : subscriptions.length === 0 ? (
            <EmptyState icon="fa-envelope" title="No subscribers yet" />
          ) : (
            <ul className="divide-y divide-line">
              {subscriptions.slice(0, 6).map((s) => (
                <li key={s._id} className="px-5 py-3">
                  <p className="text-sm text-ink font-medium truncate">{s.email}</p>
                  <p className="text-xs text-ink-subtle mt-0.5">
                    {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Contact details modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Contact Details" maxWidth="max-w-2xl">
        {selectedContact && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              ['Name', selectedContact.name],
              ['Email', selectedContact.email],
              ['Phone', selectedContact.phone || '—'],
              ['Service', selectedContact.service || '—'],
              ['Budget', selectedContact.budget || '—'],
              ['R&D Inquiry', selectedContact.RND ? 'Yes' : 'No'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-xs uppercase tracking-wide text-ink-subtle font-medium">{k}</p>
                <p className="text-ink mt-0.5">{v}</p>
              </div>
            ))}
            <div className="sm:col-span-2">
              <p className="text-xs uppercase tracking-wide text-ink-subtle font-medium">Message</p>
              <p className="text-ink mt-1 whitespace-pre-line bg-gray-50 border border-line rounded-lg p-3">
                {selectedContact.message || '—'}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs uppercase tracking-wide text-ink-subtle font-medium">Submitted</p>
              <p className="text-ink mt-0.5">
                {selectedContact.createdAt ? new Date(selectedContact.createdAt).toLocaleString() : '—'}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}