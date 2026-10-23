import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config' // <-- FIXED: Changed from '../../config' to '../config'

const nav = [
  {
    section: 'Overview',
    items: [
      { to: '/dashboard',       label: 'Dashboard', icon: 'fa-gauge-high' },
      { to: '/admin/analytics', label: 'Analytics', icon: 'fa-chart-line' },
      { to: '/admin/logs',      label: 'System Logs', icon: 'fa-clipboard-list' },
    ],
  },
  {
    section: 'Content',
    items: [
      { to: '/admin/projects',   label: 'Portfolio Projects',         icon: 'fa-diagram-project' },
      { to: '/admin/industries', label: 'Portfolio Categories',       icon: 'fa-tags' },
      { to: '/blogs',            label: 'Publish Blog',       icon: 'fa-newspaper' },
      { to: '/admin/blog-categories', label: 'Blog Categories', icon: 'fa-folder-tree' },
      { to: '/addfaq',           label: 'FAQs',             icon: 'fa-circle-question' },
      { to: '/admin/privacy',    label: 'Privacy Policy',   icon: 'fa-shield-halved' },
      { to: '/admin/terms',      label: 'Terms of Service', icon: 'fa-file-contract' },
    ],
  },
  {
    section: 'Audience',
    items: [
      { to: '/admin/contacts',   label: 'Form Submissions', icon: 'fa-inbox', statKey: 'contacts' },
      { to: '/admin/estimates',  label: 'Ballpark Request',   icon: 'fa-calculator', statKey: 'estimates' },
      { to: '/subscriptions',    label: 'Subscriptions',       icon: 'fa-envelope', statKey: 'subscriptions' },
      { to: '/admin/users',      label: 'Users',               icon: 'fa-users' },
    ],
  },
]

export default function AdminSidebar() {
  const [open, setOpen] = useState(false)
  const [stats, setStats] = useState({ contacts: 0, estimates: 0, subscriptions: 0 })
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => { setOpen(false) }, [location.pathname])

  // Fetch unread counts
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return
        const res = await axios.get(`${API_BASE_URL}/stats/unread`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setStats(res.data)
      } catch (err) {
        // Silent fail
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [location.pathname]) // Re-fetch when route changes

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/auth/login')
  }

  return (
    <>
      <div className="lg:hidden sticky top-0 z-30 -m-6 mb-6 px-4 py-3 bg-white border-b border-line flex items-center justify-between">
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 rounded-lg border border-line flex items-center justify-center text-ink"
          aria-label="Open menu"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <span className="font-semibold text-ink">Admin</span>
        <button onClick={handleLogout} className="text-ink-muted text-sm">Logout</button>
      </div>

      {open && (
        <div onClick={() => setOpen(false)} className="lg:hidden fixed inset-0 bg-ink/40 z-40" />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-0 h-screen w-64 shrink-0
          bg-white border-r border-line
          flex flex-col
          transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-line">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-sm">A</div>
            <span className="font-semibold text-ink">Admin Panel</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden w-8 h-8 rounded-md hover:bg-gray-100 text-ink-muted"
            aria-label="Close menu"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {nav.map((group) => (
            <div key={group.section}>
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                {group.section}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const count = item.statKey ? stats[item.statKey] : 0;
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.to === '/dashboard'}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                           ${isActive
                             ? 'bg-brand-50 text-brand-700'
                             : 'text-ink-muted hover:text-ink hover:bg-gray-50'}`
                        }
                      >
                        <i className={`fa-solid ${item.icon} w-4 text-center`}></i>
                        <span className="flex-1">{item.label}</span>
                        {count > 0 && (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            {count}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-line">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-ink-muted hover:text-red-600 hover:bg-red-50 transition"
          >
            <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center"></i>
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}