import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import {
  PageHeader, Card, Button, Badge, EmptyState, TableSkeleton,
  ConfirmDialog, Alert, Modal, Field, Input,
} from '../../components/admin/ui'

/* -------------------- Create user form -------------------- */
function CreateUserForm({ onOtpSent, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth-otp/invite`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      onOtpSent(formData.email, res.data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send invite. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert>{error}</Alert>}

      <Field label="Name">
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </Field>

      <Field label="Email">
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </Field>

      <Field label="Password" hint="Minimum 6 characters">
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          placeholder="Min 6 characters"
        />
      </Field>

      <Field label="Role">
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-ink text-sm"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </Field>

      <div className="flex justify-end gap-2 pt-4 border-t border-line">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Sending…' : 'Send Invite'}
        </Button>
      </div>
    </form>
  )
}

/* -------------------- Enter OTP form -------------------- */
function VerifyInviteForm({ email, onSuccess, onCancel }) {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post(`${API_BASE_URL}/auth-otp/verify-invite`, { email, otp })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center text-sm text-gray-600 bg-brand-50 rounded-lg p-3 border border-brand-100">
        Activation code was sent to your admin email.
        <br />
        Enter it below to activate <strong>{email}</strong>.
      </div>

      {error && <Alert>{error}</Alert>}

      <div>
        <label className="block text-gray-700 font-semibold mb-2 text-center">
          Activation code
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          required
          autoFocus
          placeholder="000000"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading || otp.length !== 6}
        className={`w-full py-3 rounded-lg font-semibold text-white bg-brand-600 hover:bg-brand-700 transition ${
          loading || otp.length !== 6 ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Verifying…' : 'Verify & Activate'}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="w-full text-sm text-gray-500 hover:text-gray-700"
      >
        Cancel
      </button>
    </form>
  )
}

/* -------------------- Users page -------------------- */
export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal state
  const [modal, setModal] = useState(null)
  // { type: 'create' } | { type: 'verify', email } | { type: 'success', email }
  // | { type: 'resend-verify', email } | { type: 'resend-success', email }

  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [passwordUser, setPasswordUser] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [passwordType, setPasswordType] = useState('password')
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/auth/login')
  }, [navigate])

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setUsers(res.data)
    } catch (err) {
      console.error(err)
      setError('Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const closeModal = () => setModal(null)

  const handleDelete = async () => {
    if (!confirmId) return
    setDeleting(true)
    try {
      await axios.delete(`${API_BASE_URL}/auth/users/${confirmId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setUsers(users.filter((u) => u._id !== confirmId))
      setConfirmId(null)
    } catch (err) {
      console.error(err)
      setError('Failed to delete user.')
    } finally {
      setDeleting(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwordUser || !newPassword.trim()) return
    try {
      await axios.put(
        `${API_BASE_URL}/auth/changepassword/${passwordUser._id}`,
        { password: newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      setPasswordUser(null)
      setNewPassword('')
      fetchUsers()
    } catch (err) {
      console.error(err)
      setError('Failed to change password.')
    }
  }

  /* Resend OTP for an unverified user + open verify modal */
  const startResend = async (user) => {
    try {
      await axios.post(
        `${API_BASE_URL}/auth-otp/resend-invite`,
        { email: user.email },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      setModal({ type: 'resend-verify', email: user.email })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code.')
    }
  }

  return (
    <AdminLayout>
      <PageHeader
        title="User Management"
        description="Invite, activate and manage users of the admin panel."
        actions={
          <Button onClick={() => setModal({ type: 'create' })}>
            <i className="fa-solid fa-plus"></i>
            Create New User
          </Button>
        }
      />

      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

      <Card className="overflow-hidden">
        {loading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : users.length === 0 ? (
          <EmptyState
            icon="fa-users"
            title="No users yet"
            description="Click 'Create New User' to invite your first user."
            action={
              <Button onClick={() => setModal({ type: 'create' })}>Add User</Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-subtle border-b border-line bg-gray-50/60">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium w-24">Role</th>
                  <th className="px-5 py-3 font-medium w-28">Status</th>
                  <th className="px-5 py-3 font-medium w-40">Password</th>
                  <th className="px-5 py-3 font-medium w-40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-line last:border-0 hover:bg-gray-50/60">
                    <td className="px-5 py-3 font-medium text-ink">{u.name}</td>
                    <td className="px-5 py-3 text-ink-muted">{u.email}</td>
                    <td className="px-5 py-3">
                      <Badge tone={u.role === 'admin' ? 'brand' : 'neutral'}>
                        {u.role || 'user'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      {u.pendingInvite ? (
                        <Badge tone="warning">Pending</Badge>
                      ) : (
                        <Badge tone="success">Active</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setPasswordUser(u)}
                        className="text-brand-600 hover:text-brand-700 font-medium text-xs"
                      >
                        Change Password
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1">
                        {u.pendingInvite && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startResend(u)}
                            title="Send fresh activation code"
                            className="text-amber-600 hover:bg-amber-50"
                          >
                            <i className="fa-solid fa-shield-halved"></i>
                            <span className="ml-1.5 text-xs font-semibold">Verify</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmId(u._id)}
                          title="Delete user"
                          className="text-red-600 hover:bg-red-50"
                        >
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

      {/* -------------------- Create modal -------------------- */}
      <Modal
        open={modal?.type === 'create'}
        onClose={closeModal}
        title="Create New User"
        maxWidth="max-w-md"
      >
        <CreateUserForm
          onOtpSent={(email) => setModal({ type: 'verify', email })}
          onCancel={closeModal}
        />
      </Modal>

      {/* -------------------- Verify modal (after create) -------------------- */}
      <Modal
        open={modal?.type === 'verify'}
        onClose={closeModal}
        title="Enter Activation Code"
        maxWidth="max-w-md"
      >
        <VerifyInviteForm
          email={modal?.email}
          onSuccess={() => setModal({ type: 'success', email: modal.email })}
          onCancel={closeModal}
        />
      </Modal>

      {/* -------------------- Resend-verify modal (from Verify button) -------------------- */}
      <Modal
        open={modal?.type === 'resend-verify'}
        onClose={closeModal}
        title="Enter Activation Code"
        maxWidth="max-w-md"
      >
        <div className="text-center text-sm text-emerald-700 bg-emerald-50 rounded-lg p-3 border border-emerald-100 mb-3">
          <i className="fa-solid fa-paper-plane mr-1"></i>
          Fresh code sent to admin email
        </div>
        <VerifyInviteForm
          email={modal?.email}
          onSuccess={() => setModal({ type: 'resend-success', email: modal.email })}
          onCancel={closeModal}
        />
      </Modal>

      {/* -------------------- Success (create flow) -------------------- */}
      <Modal
        open={modal?.type === 'success'}
        onClose={() => { closeModal(); fetchUsers() }}
        title=""
        maxWidth="max-w-sm"
      >
        <div className="text-center space-y-4 py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
            <i className="fa-solid fa-check text-emerald-500 text-3xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">User Activated</h3>
            <p className="text-sm text-gray-500">
              <strong>{modal?.email}</strong> can now log in with their password.
            </p>
          </div>
          <Button className="w-full" onClick={() => { closeModal(); fetchUsers() }}>
            Done
          </Button>
        </div>
      </Modal>

      {/* -------------------- Success (resend flow) -------------------- */}
      <Modal
        open={modal?.type === 'resend-success'}
        onClose={() => { closeModal(); fetchUsers() }}
        title=""
        maxWidth="max-w-sm"
      >
        <div className="text-center space-y-4 py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
            <i className="fa-solid fa-check text-emerald-500 text-3xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">User Verified</h3>
            <p className="text-sm text-gray-500">
              <strong>{modal?.email}</strong> is now active.
            </p>
          </div>
          <Button className="w-full" onClick={() => { closeModal(); fetchUsers() }}>
            Done
          </Button>
        </div>
      </Modal>

      {/* -------------------- Change Password modal -------------------- */}
      <Modal
        open={!!passwordUser}
        onClose={() => { setPasswordUser(null); setNewPassword('') }}
        title="Change Password"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-gray-500 mb-4">
          Enter a new password for <strong>{passwordUser?.name}</strong>
        </p>
        <div className="flex gap-2 items-center mb-5">
          <input
            type={passwordType}
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="button"
            className="p-2.5 border border-gray-300 rounded-md hover:bg-gray-100 transition"
            onClick={() => setPasswordType(passwordType === 'password' ? 'text' : 'password')}
          >
            <i className={`fa-solid ${passwordType === 'password' ? 'fa-eye' : 'fa-eye-slash'} text-sm`}></i>
          </button>
        </div>
        <Button className="w-full" onClick={handleChangePassword}>
          Change Password
        </Button>
      </Modal>

      {/* -------------------- Delete confirm -------------------- */}
      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        busy={deleting}
        title="Delete user"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
      />
    </AdminLayout>
  )
}