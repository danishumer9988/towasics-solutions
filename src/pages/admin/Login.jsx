import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'

export default function Login() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1 = email+password, 2 = OTP, 3 = forgot

  useEffect(() => {
    if (localStorage.getItem('user')) navigate('/dashboard')
  }, [navigate])

  const handleSuccess = (data) => {
    localStorage.setItem('user', JSON.stringify(data.user))
    if (data.token) localStorage.setItem('token', data.token)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-150">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>

        {step === 1 && (
          <CredentialsStep
            onOtpSent={(email) => { setPending(email); setStep(2) }}
            onForgot={() => setStep(3)}
          />
        )}
        {step === 2 && (
          <OtpStep onSuccess={handleSuccess} onBack={() => setStep(1)} />
        )}
        {step === 3 && (
          <ForgotStep onBack={() => setStep(1)} />
        )}
      </div>
    </div>
  )
}

/* Simple module-level store so OtpStep knows which email to verify */
let pendingEmail = ''
const setPending = (e) => { pendingEmail = e }
const getPending = () => pendingEmail

/* ---------------- Step 1: email + password ---------------- */
function CredentialsStep({ onOtpSent, onForgot }) {
  const [creds, setCreds] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await axios.post(`${API_BASE_URL}/auth-otp/login-start`, creds)
      onOtpSent(creds.email)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {error && <ErrorBox>{error}</ErrorBox>}

      <div>
        <label className="block text-gray-700 font-semibold mb-2">Email</label>
        <input
          type="email"
          value={creds.email}
          onChange={(e) => setCreds({ ...creds, email: e.target.value })}
          required
          autoComplete="email"
          placeholder="you@company.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">Password</label>
        <input
          type="password"
          value={creds.password}
          onChange={(e) => setCreds({ ...creds, password: e.target.value })}
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold text-white bg-brand-600 hover:bg-brand-700 transition ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Verifying…' : 'Continue'}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onForgot}
          className="text-sm text-brand-600 hover:text-brand-700 hover:underline font-medium"
        >
          Forgot password?
        </button>
      </div>
    </form>
  )
}

/* ---------------- Step 2: OTP ---------------- */
function OtpStep({ onSuccess, onBack }) {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const email = getPending()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await axios.post(`${API_BASE_URL}/auth-otp/login-verify`, { email, otp })
      onSuccess(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {error && <ErrorBox>{error}</ErrorBox>}

      <div className="text-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100">
        A 6-digit code was sent to
        <br />
        <strong className="text-gray-900">{email}</strong>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2 text-center">Verification code</label>
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
        {loading ? 'Verifying…' : 'Verify & Login'}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back
      </button>
    </form>
  )
}

/* ---------------- Forgot password ---------------- */
function ForgotStep({ onBack }) {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const sendOtp = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await axios.post(`${API_BASE_URL}/auth-otp/forgot-password`, { email })
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send code.')
    } finally {
      setLoading(false)
    }
  }

  const reset = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await axios.post(`${API_BASE_URL}/auth-otp/reset-password`, { email, otp, newPassword })
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
          <i className="fa-solid fa-check text-emerald-500 text-2xl"></i>
        </div>
        <p className="text-gray-700 font-medium">Password updated successfully.</p>
        <button onClick={onBack} className="text-brand-600 hover:text-brand-700 font-semibold hover:underline">
          Back to login
        </button>
      </div>
    )
  }

  if (step === 1) {
    return (
      <form onSubmit={sendOtp} className="space-y-5">
        {error && <ErrorBox>{error}</ErrorBox>}

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Your email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white bg-brand-600 hover:bg-brand-700 transition ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Sending…' : 'Send reset code'}
        </button>

        <button type="button" onClick={onBack} className="w-full text-sm text-gray-500 hover:text-gray-700">
          ← Back to login
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={reset} className="space-y-4">
      {error && <ErrorBox>{error}</ErrorBox>}

      <div>
        <label className="block text-gray-700 font-semibold mb-2">Reset code</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          required
          placeholder="000000"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">New password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading || otp.length !== 6 || newPassword.length < 6}
        className={`w-full py-3 rounded-lg font-semibold text-white bg-brand-600 hover:bg-brand-700 transition ${
          loading || otp.length !== 6 || newPassword.length < 6 ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Updating…' : 'Reset password'}
      </button>

      <button
        type="button"
        onClick={() => { setStep(1); setOtp(''); setNewPassword(''); setError('') }}
        className="w-full text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back
      </button>
    </form>
  )
}

function ErrorBox({ children }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2 text-sm font-medium">
      {children}
    </div>
  )
}