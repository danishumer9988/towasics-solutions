import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'

export default function VerifyInvite() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const [email, setEmail] = useState(params.get('email') || '')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('user')) navigate('/dashboard')
  }, [navigate])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (otp.length !== 6) return setError('Enter the 6-digit code')

    setLoading(true)
    try {
      await axios.post(`${API_BASE_URL}/auth-otp/verify-invite`, { email, otp })
      setDone(true)
      setTimeout(() => navigate('/auth/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Activation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-lg shadow-md border border-gray-150 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-check text-emerald-500 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Activated</h2>
          <p className="text-gray-600 text-sm">Redirecting to login…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-150">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-3">
            <i className="fa-solid fa-user-shield text-brand-600 text-xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Activate your account</h2>
          <p className="text-sm text-gray-500">Enter the 6-digit code from your admin.</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Activation code</label>
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
            {loading ? 'Activating…' : 'Activate account'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/auth/login" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}