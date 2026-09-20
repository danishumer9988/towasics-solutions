import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import {
  PageHeader, Card, Button, Modal, ConfirmDialog, Field, Input, Select,
  Alert, EmptyState, TableSkeleton, Badge,
} from '../../components/admin/ui'

/* ---------- Create user form ---------- */
function CreateUserForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', profileImage: '', role: 'user',
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const uploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setError('Please upload a valid PNG/JPEG image.')
      return
    }
    setUploading(true); setError('')
    const data = new FormData()
    data.append('file', file)
    data.append('upload_preset', 'united eldt')
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dgmzv5drk/image/upload', { method: 'POST', body: data })
      if (!res.ok) throw new Error('Upload failed')
      const result = await res.json()
      setFormData((prev) => ({ ...prev, profileImage: result.secure_url }))
    } catch (err) {
      console.error(err); setError('Failed to upload image.')
    } finally { setUploading(false) }
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <Alert>{error}</Alert>}
      <Field label="Name"><Input name="name" value={formData.name} onChange={onChange} required /></Field>
      <Field label="Email"><Input type="email" name="email" value={formData.email} onChange={onChange} required /></Field>
      <Field label="Password"><Input type="password" name="password" value={formData.password} onChange={onChange} required /></Field>
      <Field label="Phone"><Input name="phone" value={formData.phone} onChange={onChange} /></Field>
      <Field label="Role">
        <Select name="role" value={formData.role} onChange={onChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </Select>
      </Field>
      <Field label="Profile Image">
        <div className="flex items-center gap-3">
          <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-line px-4 py-2 rounded-lg text-sm font-medium text-ink">
            {uploading ? 'Uploading…' : 'Choose image'}
            <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={uploadImage} className="hidden" disabled={uploading} />
          </label>
          {formData.profileImage && <img src={formData.profileImage} alt="" className="w-10 h-10 rounded-full object-cover border border-line" />}
        </div>
      </Field>
      <div className="flex justify-end gap-2 pt-3">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading || uploading}>{loading ? 'Creating…' : 'Create'}</Button>
      </div>
    </form>
  )
}

/* ---------- Main page ---------- */
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
    if (!localStorage.getItem('user')) navigate('/auth/login')
  }, [navigate])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setUsers(res.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/auth/users/${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setUsers(users.filter((u) => u._id !== selectedUser._id))
      setDeleteOpen(false); setSelectedUser(null)
    } catch (err) { console.error(err); alert('Failed to delete user.') }
  }

  const handleChangePassword = async () => {
    if (!newPassword.trim()) return
    try {
      await axios.put(`${API_BASE_URL}/auth/changepassword/${selectedUser._id}`,
        { password: newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      setPasswordOpen(false); setNewPassword(''); setSelectedUser(null)
    } catch (err) { console.error(err); alert('Failed to change password.') }
  }

  return (
    <AdminLayout>
      <PageHeader
        title="User Management"
        description="Manage admin and user accounts."
        actions={<Button onClick={() => setCreateOpen(true)}><i className="fa-solid fa-user-plus"></i>Create User</Button>}
      />

      <Card className="overflow-hidden">
        {loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : users.length === 0 ? (
          <EmptyState icon="fa-users" title="No users yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-subtle border-b border-line bg-gray-50/60">
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-line last:border-0 hover:bg-gray-50/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {u.profileImage ? (
                          <img src={u.profileImage} alt="" className="w-9 h-9 rounded-full object-cover border border-line" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center font-semibold text-sm">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-ink">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-muted">{u.email}</td>
                    <td className="px-5 py-3 text-ink-muted">{u.phone || '—'}</td>
                    <td className="px-5 py-3">
                      <Badge tone={u.role === 'admin' ? 'brand' : 'neutral'}>{u.role || 'user'}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm"
                          onClick={() => { setPasswordOpen(true); setSelectedUser(u) }}>
                          <i className="fa-solid fa-key"></i>
                        </Button>
                        <Button variant="ghost" size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => { setSelectedUser(u); setDeleteOpen(true) }}>
                          <i className="fa-solid fa-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New User">
        <CreateUserForm
          onSuccess={() => { setCreateOpen(false); fetchUsers() }}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={deleteOpen && !!selectedUser}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete user"
        message={selectedUser ? `Are you sure you want to delete ${selectedUser.name}?` : ''}
        confirmLabel="Delete"
      />

      <Modal open={passwordOpen && !!selectedUser} onClose={() => setPasswordOpen(false)} title="Change Password" maxWidth="max-w-sm">
        {selectedUser && (
          <>
            <p className="text-sm text-ink-muted mb-4">Set a new password for {selectedUser.name}.</p>
            <div className="flex gap-2">
              <Input
                type={passwordType}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
              />
              <Button variant="secondary" onClick={() => setPasswordType(passwordType === 'password' ? 'text' : 'password')}>
                <i className={`fa-solid ${passwordType === 'password' ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              </Button>
            </div>
            <Button className="w-full mt-4" onClick={handleChangePassword}>Change Password</Button>
          </>
        )}
      </Modal>
    </AdminLayout>
  )
}