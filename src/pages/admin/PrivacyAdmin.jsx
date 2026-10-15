import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import RichTextEditor from '../../components/RichTextEditor'
import { PageHeader, Card, Button, Field, Input, Alert } from '../../components/admin/ui'

export default function PrivacyAdmin() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('Privacy Policies')
  const [effectiveDate, setEffectiveDate] = useState('01 September 2025')
  const [content, setContent] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/auth/login')
  }, [navigate])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/legal/privacy-policy`)
        if (cancelled) return
        setTitle(res.data.title || 'Privacy Policies')
        setEffectiveDate(res.data.effectiveDate || '01 September 2025')
        setContent(res.data.content || '')
      } catch (err) {
        // 404 = no content yet — start with blank editor
        if (err.response?.status !== 404) {
          setError('Failed to load privacy policy.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    if (!content.trim()) {
      setError('Content is required.')
      return
    }

    setSaving(true)
    setError('')
    try {
      await axios.put(
        `${API_BASE_URL}/legal/privacy-policy`,
        { title, effectiveDate, content },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      setToast({ type: 'success', message: 'Privacy Policy saved successfully.' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      {toast && (
        <div className="fixed top-6 right-6 z-[9999]">
          <div className={`flex items-start gap-3 min-w-[280px] px-4 py-3 rounded-xl shadow-lg border bg-white ${
            toast.type === 'success' ? 'border-emerald-100' : 'border-red-100'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              toast.type === 'success' ? 'bg-emerald-50' : 'bg-red-50'
            }`}>
              <i className={`fa-solid ${toast.type === 'success' ? 'fa-check text-emerald-500' : 'fa-xmark text-red-500'}`}></i>
            </div>
            <p className="text-sm text-ink mt-1">{toast.message}</p>
          </div>
        </div>
      )}

      <PageHeader
        title="Privacy Policy"
        description="Edit the content shown on the public /privacy-policy page."
      />

      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

      <Card>
        {loading ? (
          <div className="p-10 text-center text-ink-muted text-sm">Loading…</div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2">
                <Field label="Page Title" hint="Shown at the top of the page as a heading">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Privacy Policies"
                  />
                </Field>
              </div>
              <Field label="Effective Date" hint="Free text — e.g. 01 September 2025">
                <Input
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  placeholder="01 September 2025"
                />
              </Field>
            </div>

            <Field
              label="Content"
              hint="Use the toolbar to format headings, bold, lists, links, and images."
            >
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your privacy policy content here…"
              />
            </Field>

            <div className="flex justify-end gap-2 pt-5 border-t border-line">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save Privacy Policy'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </AdminLayout>
  )
}