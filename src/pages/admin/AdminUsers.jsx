import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminSidebar from '../../components/AdminSidebar'
import { API_BASE_URL } from '../../config'

// Create User Form Component (originally lR)
function CreateUserForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    profileImage: '',
    role: 'user'
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setError('Please upload a valid image (PNG, JPEG, JPG)')
      return
    }

    setUploading(true)
    setError('')
    const data = new FormData()
    data.append('file', file)
    data.append('upload_preset', 'united eldt')

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dgmzv5drk/image/upload', {
        method: 'POST',
        body: data
      })
      if (!response.ok) throw new Error('Image upload failed')
      const result = await response.json()
      setFormData(prev => ({ ...prev, profileImage: result.secure_url }))
    } catch (err) {
      console.error('Image upload error:', err)
      setError('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="block text-gray-700 font-semibold mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-1">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-1">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-1">Profile Image</label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border font-medium text-sm text-gray-700 transition">
            {uploading ? 'Uploading...' : 'Upload Image'}
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {formData.profileImage && (
            <img src={formData.profileImage} alt="profile" className="w-12 h-12 rounded-full object-cover border" />
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || uploading}
          className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold ${loading || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  )
}

// User Management Component (originally uR)
export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [passwordType, setPasswordType] = useState('password')
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/auth/login')
    }
  }, [navigate])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setUsers(res.data)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDeleteUser = async () => {
    if (!selectedUser) return
    try {
      await axios.delete(`${API_BASE_URL}/auth/users/${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setUsers(users.filter(u => u._id !== selectedUser._id))
      setDeleteOpen(false)
      setSelectedUser(null)
    } catch (err) {
      console.error('Failed to delete user:', err)
      alert('Failed to delete user. Please try again.')
    }
  }

  const handleChangePassword = async () => {
    if (!selectedUser || !newPassword.trim()) return
    try {
      await axios.put(`${API_BASE_URL}/auth/changepassword/${selectedUser._id}`, {
        password: newPassword
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      alert('Password changed successfully')
      setPasswordOpen(false)
      setNewPassword('')
      setSelectedUser(null)
    } catch (err) {
      console.error('Failed to change password:', err)
      alert('Failed to change password. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <AdminSidebar />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <button
              onClick={() => setCreateOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold transition"
            >
              Create New User
            </button>
          </div>

          {loading ? (
            <div className="text-center py-6 text-gray-500 font-medium">Loading users...</div>
          ) : (
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change Password</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(u => (
                    <tr key={u._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.profileImage ? (
                          <img src={u.profileImage} alt={u.name} className="h-10 w-10 rounded-full object-cover border" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{u.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.phone || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => { setPasswordOpen(true); setSelectedUser(u) }}
                          className="text-blue-600 hover:text-blue-900 font-semibold"
                        >
                          Change Password
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => { setSelectedUser(u); setDeleteOpen(true) }}
                          className="text-red-600 hover:text-red-900 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create User Modal */}
        {createOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-start mb-4 border-b pb-3">
                <h3 className="text-xl font-bold text-gray-800">Create New User</h3>
                <button onClick={() => setCreateOpen(false)} className="text-gray-500 hover:text-gray-700 text-lg">✕</button>
              </div>
              <CreateUserForm 
                onSuccess={() => { setCreateOpen(false); fetchUsers() }} 
                onCancel={() => setCreateOpen(false)} 
              />
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteOpen && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Confirm Deletion</h3>
              <p className="mb-6 text-gray-600">Are you sure you want to delete user <strong>{selectedUser.name}</strong>?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {passwordOpen && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
                <button onClick={() => setPasswordOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <p className="text-sm text-gray-500 mb-4">Enter the new password for {selectedUser.name}</p>
              <div className="flex gap-2 items-center mb-6">
                <input
                  type={passwordType}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  className="p-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                  onClick={() => setPasswordType(passwordType === 'password' ? 'text' : 'password')}
                >
                  <i className={`fa-solid ${passwordType === 'password' ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                </button>
              </div>
              <button
                onClick={handleChangePassword}
                className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded font-semibold w-full transition"
              >
                Change Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
