import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function AdminSidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/auth/login')
  }

  return (
    <nav className="p-4 shadow-lg mb-10 bg-white rounded-lg">
      <ul className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition font-medium">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition font-medium">
            Users
          </Link>
        </li>
        <li>
          <Link to="/subscriptions" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition font-medium">
            Subscriptions
          </Link>
        </li>
        <li>
          <Link to="/blogs" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition font-medium">
            Blogs
          </Link>
        </li>
        <li>
          <Link to="/admin/projects" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition font-medium">
            Projects
          </Link>
        </li>
        <li>
          <Link to="/addfaq" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition font-medium">
            FAQs
          </Link>
        </li>
        <li className="ml-auto">
          <button onClick={handleLogout} className="block px-4 py-2 text-red-600 hover:bg-red-50 rounded transition font-medium">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}
