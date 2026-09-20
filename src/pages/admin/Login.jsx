import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import { Input, Field, Button, Alert } from '../../components/admin/ui'

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, credentials)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      if (res.data.token) localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-surface">
      {/* Brand side */}
      <div className="hidden lg:flex flex-col justify-between bg-brand-600 text-white p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-bold">A</div>
          <span className="font-semibold">Admin Console</span>
        </div>
        <div>
          <h1 className="text-3xl font-semibold leading-tight max-w-md">
            Manage your site with clarity and control.
          </h1>
          <p className="text-white/70 mt-3 max-w-md text-sm">
            Projects, blogs, FAQs, users and subscriptions — all in one place.
          </p>
        </div>
        <p className="text-xs text-white/60">© {new Date().getFullYear()} Admin</p>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">A</div>
            <span className="font-semibold text-ink">Admin Console</span>
          </div>

          <h2 className="text-2xl font-semibold text-ink">Sign in</h2>
          <p className="text-sm text-ink-muted mt-1">Enter your admin credentials to continue.</p>

          <div className="mt-8 space-y-4">
            {error && <Alert tone="danger">{error}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Email address">
                <Input
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  value={credentials.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </Field>

              <Field label="Password">
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </Field>

              <Button type="submit" size="lg" disabled={loading} className="w-full">
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}