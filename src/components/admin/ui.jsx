import { useEffect } from 'react'

/* ---------- Page header ---------- */
export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {description && <p className="text-sm text-ink-muted mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

/* ---------- Card ---------- */
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-line rounded-xl shadow-card ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, actions }) {
  return (
    <div className="px-5 py-4 border-b border-line flex items-center justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {subtitle && <p className="text-xs text-ink-muted mt-0.5">{subtitle}</p>}
      </div>
      {actions}
    </div>
  )
}

/* ---------- Button ---------- */
const variants = {
  primary:    'bg-brand-600 hover:bg-brand-700 text-white shadow-sm',
  secondary:  'bg-white hover:bg-gray-50 text-ink border border-line',
  ghost:      'bg-transparent hover:bg-gray-100 text-ink',
  danger:     'bg-red-600 hover:bg-red-700 text-white',
  dangerSoft: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-100',
}
const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
}
export function Button({ variant = 'primary', size = 'md', className = '', as: Tag = 'button', ...props }) {
  return (
    <Tag
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}`}
    />
  )
}

/* ---------- Form ---------- */
export function Field({ label, hint, error, children }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>}
      {children}
      {hint && !error && <p className="text-xs text-ink-subtle mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}

const inputBase =
  'w-full px-3.5 py-2.5 text-sm bg-white border border-line rounded-lg ' +
  'text-ink placeholder:text-ink-subtle ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition'

export function Input(props)    { return <input    {...props} className={`${inputBase} ${props.className || ''}`} /> }
export function Textarea(props) { return <textarea {...props} className={`${inputBase} ${props.className || ''}`} /> }
export function Select(props)   { return <select   {...props} className={`${inputBase} ${props.className || ''}`} /> }

/* ---------- Badge ---------- */
const tones = {
  neutral: 'bg-gray-100 text-gray-700',
  brand:   'bg-brand-50 text-brand-700',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-amber-50 text-amber-700',
  danger:  'bg-red-50 text-red-700',
  info:    'bg-blue-50 text-blue-700',
}
export function Badge({ tone = 'neutral', children }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}

/* ---------- Empty & loading ---------- */
export function EmptyState({ icon = 'fa-inbox', title, description, action }) {
  return (
    <div className="text-center py-14 px-6">
      <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-ink-muted mb-3">
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {description && <p className="text-sm text-ink-muted mt-1 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-100 rounded-md ${className}`} />
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="p-5 space-y-3">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {Array.from({ length: cols }).map((_, c) => <Skeleton key={c} className="h-4" />)}
        </div>
      ))}
    </div>
  )
}

/* ---------- Stat card ---------- */
export function StatCard({ label, value, icon, tone = 'brand', hint }) {
  const toneBg = {
    brand:   'bg-brand-50 text-brand-700',
    info:    'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-amber-50 text-amber-700',
    danger:  'bg-red-50 text-red-700',
  }[tone]
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">{label}</p>
          <p className="text-2xl font-semibold text-ink mt-2 truncate">{value ?? '—'}</p>
          {hint && <p className="text-xs text-ink-muted mt-1">{hint}</p>}
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${toneBg}`}>
            <i className={`fa-solid ${icon}`}></i>
          </div>
        )}
      </div>
    </Card>
  )
}

/* ---------- Alert ---------- */
export function Alert({ tone = 'danger', children, onClose }) {
  const map = {
    danger:  'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info:    'bg-blue-50 border-blue-200 text-blue-700',
  }
  return (
    <div className={`flex items-start gap-3 border px-4 py-3 rounded-lg text-sm ${map[tone]}`}>
      <i className="fa-solid fa-circle-info mt-0.5"></i>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100">
          <i className="fa-solid fa-xmark"></i>
        </button>
      )}
    </div>
  )
}

/* ---------- Modal ---------- */
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className={`bg-white w-full ${maxWidth} rounded-xl shadow-pop border border-line max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h3 className="text-base font-semibold text-ink">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-gray-100 text-ink-muted">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

/* ---------- Confirm dialog ---------- */
export function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirm', message, confirmLabel = 'Confirm', tone = 'danger', busy }) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <p className="text-sm text-ink-muted">{message}</p>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant={tone} onClick={onConfirm} disabled={busy}>
          {busy ? 'Working…' : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}