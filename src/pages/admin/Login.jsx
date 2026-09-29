import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
    <div className="min-h-screen flex bg-white">
      {/* ==================== LEFT — Brand panel ==================== */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #086B87 0%, #0a85a7 45%, #1aa4ac 100%)',
        }}
      >
        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-40 -left-24 w-[520px] h-[520px] rounded-full bg-[#35D9E1]/10 blur-3xl" />
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.06]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="dots"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16 text-white">
          {/* Brand mark */}
          <Link to="/" className="inline-flex items-center gap-3 w-fit">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center">
              <i className="fa-solid fa-cube text-white text-lg"></i>
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">Towasic</p>
              <p className="text-[11px] uppercase tracking-widest text-white/70 leading-tight">
                Solutions
              </p>
            </div>
          </Link>

          {/* Middle: illustration + tagline */}
          <div className="flex flex-col items-start gap-8 max-w-md">
            <img
              src="/assets/abutus.png"
              alt=""
              className="w-full max-w-sm drop-shadow-2xl"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <div>
              <h2
                className="text-3xl xl:text-4xl font-extrabold leading-tight mb-3"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Welcome back to
                <br />
                <span className="text-[#A5EEF5]">Towasic Admin</span>
              </h2>
              <p className="text-white/75 text-base leading-relaxed font-medium">
                Manage your portfolio, blogs, FAQ, users and analytics — all in
                one place.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>© {new Date().getFullYear()} Towasic Solutions</span>
            <Link
              to="/"
              className="hover:text-white transition inline-flex items-center gap-1.5"
            >
              <i className="fa-solid fa-arrow-left text-[10px]"></i>
              Back to website
            </Link>
          </div>
        </div>
      </div>

      {/* ==================== RIGHT — Form panel ==================== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile brand mark */}
          <Link
            to="/"
            className="lg:hidden flex items-center gap-3 mb-10 w-fit"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0a85a7] flex items-center justify-center">
              <i className="fa-solid fa-cube text-white text-base"></i>
            </div>
            <div>
              <p className="font-bold text-base text-[#086B87] leading-tight">
                Towasic
              </p>
              <p className="text-[10px] uppercase tracking-widest text-[#0a85a7]/70 leading-tight">
                Solutions
              </p>
            </div>
          </Link>

          {/* Title */}
          <div className="mb-8">
            <h1
              className="text-3xl font-extrabold text-[#086B87] mb-2 tracking-tight"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {step === 3 ? 'Reset password' : 'Admin Login'}
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              {step === 1 &&
                'Sign in with your email and password to continue.'}
              {step === 2 && 'Enter the 6-digit code we emailed you.'}
              {step === 3 && 'We\u2019ll email you a code to reset your password.'}
            </p>
          </div>

          {step === 1 && (
            <CredentialsStep
              onOtpSent={(email) => {
                setPending(email)
                setStep(2)
              }}
              onForgot={() => setStep(3)}
            />
          )}
          {step === 2 && (
            <OtpStep onSuccess={handleSuccess} onBack={() => setStep(1)} />
          )}
          {step === 3 && <ForgotStep onBack={() => setStep(1)} />}
        </div>
      </div>
    </div>
  )
}

/* Simple module-level store so OtpStep knows which email to verify */
let pendingEmail = ''
const setPending = (e) => {
  pendingEmail = e
}
const getPending = () => pendingEmail

/* ==================== Shared UI ==================== */

const inputBase =
  'w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-[15px] font-medium focus:outline-none focus:border-[#0a85a7] focus:ring-4 focus:ring-[#0a85a7]/10 transition'

const labelBase =
  'block text-[13px] font-semibold text-gray-700 mb-2 tracking-tight'

function PrimaryButton({ loading, children, disabled, ...rest }) {
  return (
    <button
      {...rest}
      disabled={loading || disabled}
      className={`w-full py-3.5 rounded-xl font-semibold text-white text-[15px] transition-all shadow-sm ${
        loading || disabled
          ? 'bg-[#0a85a7]/60 cursor-not-allowed'
          : 'bg-[#0a85a7] hover:bg-[#097390] active:scale-[0.99]'
      }`}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="w-4 h-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeOpacity="0.25"
            />
            <path
              d="M22 12a10 10 0 0 0-10-10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  )
}

function ErrorBox({ children }) {
  return (
    <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
      <i className="fa-solid fa-circle-exclamation mt-0.5 text-red-500"></i>
      <span className="flex-1">{children}</span>
    </div>
  )
}

/* ==================== Step 1: email + password ==================== */
function CredentialsStep({ onOtpSent, onForgot }) {
  const [creds, setCreds] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
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
        <label className={labelBase}>Email address</label>
        <div className="relative">
          <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
          <input
            type="email"
            value={creds.email}
            onChange={(e) => setCreds({ ...creds, email: e.target.value })}
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={`${inputBase} pl-11`}
          />
        </div>
      </div>

      <div>
        <label className={labelBase}>Password</label>
        <div className="relative">
          <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
          <input
            type={showPw ? 'text' : 'password'}
            value={creds.password}
            onChange={(e) =>
              setCreds({ ...creds, password: e.target.value })
            }
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className={`${inputBase} pl-11 pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            tabIndex={-1}
          >
            <i
              className={`fa-regular ${showPw ? 'fa-eye-slash' : 'fa-eye'} text-sm`}
            ></i>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end -mt-1">
        <button
          type="button"
          onClick={onForgot}
          className="text-sm text-[#0a85a7] hover:text-[#086B87] hover:underline font-semibold"
        >
          Forgot password?
        </button>
      </div>

      <PrimaryButton type="submit" loading={loading}>
        Continue
      </PrimaryButton>
    </form>
  )
}

/* ==================== Step 2: OTP ==================== */
function OtpStep({ onSuccess, onBack }) {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const email = getPending()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth-otp/login-verify`,
        { email, otp }
      )
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

      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-[#EEFAFD] border border-[#35D9E1]/30">
        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <i className="fa-solid fa-envelope-circle-check text-[#0a85a7] text-sm"></i>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-[#086B87]">Code sent</p>
          <p className="text-gray-600 mt-0.5 break-all">
            We emailed a 6-digit code to{' '}
            <strong className="text-gray-900">{email}</strong>
          </p>
        </div>
      </div>

      <div>
        <label className={`${labelBase} text-center block`}>
          Verification code
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
          className="w-full px-4 py-4 border border-gray-200 rounded-xl text-center text-2xl tracking-[0.6em] font-bold text-[#086B87] placeholder-gray-300 focus:outline-none focus:border-[#0a85a7] focus:ring-4 focus:ring-[#0a85a7]/10 transition"
        />
      </div>

      <PrimaryButton
        type="submit"
        loading={loading}
        disabled={otp.length !== 6}
      >
        Verify & Login
      </PrimaryButton>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium inline-flex items-center justify-center gap-1.5"
      >
        <i className="fa-solid fa-arrow-left text-[11px]"></i>
        Back to login
      </button>
    </form>
  )
}

/* ==================== Step 3: forgot password ==================== */
function ForgotStep({ onBack }) {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const sendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
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
    setLoading(true)
    setError('')
    try {
      await axios.post(`${API_BASE_URL}/auth-otp/reset-password`, {
        email,
        otp,
        newPassword,
      })
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center space-y-5 py-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
          <i className="fa-solid fa-check text-emerald-500 text-2xl"></i>
        </div>
        <div>
          <p className="font-bold text-[#086B87] text-lg">
            Password updated
          </p>
          <p className="text-sm text-gray-500 mt-1">
            You can now sign in with your new password.
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-[#0a85a7] hover:text-[#086B87] font-semibold text-sm hover:underline"
        >
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
          <label className={labelBase}>Your email</label>
          <div className="relative">
            <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
              className={`${inputBase} pl-11`}
            />
          </div>
        </div>

        <PrimaryButton type="submit" loading={loading}>
          Send reset code
        </PrimaryButton>

        <button
          type="button"
          onClick={onBack}
          className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium inline-flex items-center justify-center gap-1.5"
        >
          <i className="fa-solid fa-arrow-left text-[11px]"></i>
          Back to login
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={reset} className="space-y-4">
      {error && <ErrorBox>{error}</ErrorBox>}

      <div>
        <label className={labelBase}>Reset code</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          required
          autoFocus
          placeholder="000000"
          className="w-full px-4 py-4 border border-gray-200 rounded-xl text-center text-2xl tracking-[0.6em] font-bold text-[#086B87] placeholder-gray-300 focus:outline-none focus:border-[#0a85a7] focus:ring-4 focus:ring-[#0a85a7]/10 transition"
        />
      </div>

      <div>
        <label className={labelBase}>New password</label>
        <div className="relative">
          <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
          <input
            type={showPw ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Min 6 characters"
            className={`${inputBase} pl-11 pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            tabIndex={-1}
          >
            <i
              className={`fa-regular ${showPw ? 'fa-eye-slash' : 'fa-eye'} text-sm`}
            ></i>
          </button>
        </div>
      </div>

      <PrimaryButton
        type="submit"
        loading={loading}
        disabled={otp.length !== 6 || newPassword.length < 6}
      >
        Reset password
      </PrimaryButton>

      <button
        type="button"
        onClick={() => {
          setStep(1)
          setOtp('')
          setNewPassword('')
          setError('')
        }}
        className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium inline-flex items-center justify-center gap-1.5"
      >
        <i className="fa-solid fa-arrow-left text-[11px]"></i>
        Back
      </button>
    </form>
  )
}