import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'

const nav = [
  {
    section: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: 'fa-gauge-high' },
    ],
  },
  {
    section: 'Content',
    items: [
      { to: '/admin/projects', label: 'Projects',   icon: 'fa-diagram-project' },
      { to: '/blogs',          label: 'Blog Posts', icon: 'fa-newspaper' },
      { to: '/addfaq',         label: 'FAQs',       icon: 'fa-circle-question' },
    ],
  },
  {
    section: 'Audience',
    items: [
      { to: '/subscriptions', label: 'Subscriptions', icon: 'fa-envelope' },
      { to: '/admin/users',   label: 'Users',         icon: 'fa-users' },
    ],
  },
]

export default function AdminSidebar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Close mobile drawer on route change
  useEffect(() => { setOpen(false) }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/auth/login')
  }

  return (
    <>
      {/* Mobile top bar */}
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

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 bg-ink/40 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-0 h-screen w-64 shrink-0
          bg-white border-r border-line
          flex flex-col
          transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-line">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
              A
            </div>
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

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {nav.map((group) => (
            <div key={group.section}>
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                {group.section}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
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
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
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