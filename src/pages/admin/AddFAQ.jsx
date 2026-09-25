import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import { PageHeader, Card, CardHeader, Button, Field, Input, Textarea, EmptyState } from '../../components/admin/ui'

/* ------------------------------ Toast ------------------------------ */
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onClose, 3200)
    return () => clearTimeout(t)
  }, [toast, onClose])

  const isSuccess = toast?.type === 'success'

  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(24px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        .toast-anim { animation: toastSlideIn 0.28s cubic-bezier(0.22,1,0.36,1); }
      `}</style>

      {toast && (
        <div className="fixed top-6 right-6 z-[9999] toast-anim">
          <div
            className={`flex items-start gap-3 min-w-[300px] max-w-sm px-5 py-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)] border bg-white ${
              isSuccess ? 'border-emerald-100' : 'border-red-100'
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isSuccess ? 'bg-emerald-50' : 'bg-red-50'}`}>
              {isSuccess ? (
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div className="flex-1 pt-0.5">
              <p className={`text-sm font-bold ${isSuccess ? 'text-emerald-600' : 'text-red-600'}`}>
                {isSuccess ? 'Success' : 'Error'}
              </p>
              <p className="text-sm text-gray-500 mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-300 hover:text-gray-500 transition-colors cursor-pointer -mr-1 -mt-0.5"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

/* --------------------------- Main Component --------------------------- */
export default function AddFAQ() {
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' })
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  // Edit state: { categoryId, faqId, question, answer } | null
  const [editingFaq, setEditingFaq] = useState(null)
  // Delete confirm state: { categoryId, faqId, question } | null
  const [deletingFaq, setDeletingFaq] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/auth/login')
  }, [navigate])

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`)
      setCategories(res.data || [])
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: 'Failed to load categories.' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  /* ------------------------------ Create ------------------------------ */
  const addCategory = async () => {
    const name = newCategoryName.trim()
    if (!name) {
      setToast({ type: 'error', message: 'Category name cannot be empty.' })
      return
    }
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await axios.post(`${API_BASE_URL}/categories`, { category: name })
      setNewCategoryName('')
      await fetchCategories()
      if (res.data?._id) {
        setActiveCategoryId(res.data._id)
        setSelectedCategoryId(res.data._id)
      }
      setToast({ type: 'success', message: `Category "${name}" created. Add a FAQ below.` })
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to create category.' })
    } finally {
      setSubmitting(false)
    }
  }

  const addFaq = async () => {
    if (!selectedCategoryId) {
      setToast({ type: 'error', message: 'Please select a category first.' })
      return
    }
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      setToast({ type: 'error', message: 'Question and answer are required.' })
      return
    }
    if (submitting) return
    setSubmitting(true)
    try {
      await axios.post(`${API_BASE_URL}/categories/${selectedCategoryId}/faqs`, newFaq)
      setNewFaq({ question: '', answer: '' })
      await fetchCategories()
      setToast({ type: 'success', message: 'FAQ added successfully.' })
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to add FAQ.' })
    } finally {
      setSubmitting(false)
    }
  }

  /* ------------------------------ Edit FAQ ------------------------------ */
  const startEdit = (categoryId, faq) => {
    setDeletingFaq(null)
    setEditingFaq({
      categoryId,
      faqId: faq._id,
      question: faq.question,
      answer: faq.answer,
    })
  }

  const cancelEdit = () => setEditingFaq(null)

  const saveEdit = async () => {
    if (!editingFaq) return
    if (!editingFaq.question.trim() || !editingFaq.answer.trim()) {
      setToast({ type: 'error', message: 'Question and answer are required.' })
      return
    }
    if (submitting) return
    setSubmitting(true)
    try {
      await axios.put(
        `${API_BASE_URL}/categories/${editingFaq.categoryId}/faqs/${editingFaq.faqId}`,
        { question: editingFaq.question, answer: editingFaq.answer }
      )
      setEditingFaq(null)
      await fetchCategories()
      setToast({ type: 'success', message: 'FAQ updated.' })
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to update FAQ.' })
    } finally {
      setSubmitting(false)
    }
  }

  /* ------------------------------ Delete FAQ ------------------------------ */
  const startDelete = (categoryId, faq) => {
    setEditingFaq(null)
    setDeletingFaq({ categoryId, faqId: faq._id, question: faq.question })
  }

  const cancelDelete = () => setDeletingFaq(null)

  const confirmDelete = async () => {
    if (!deletingFaq) return
    if (submitting) return
    setSubmitting(true)
    try {
      await axios.delete(
        `${API_BASE_URL}/categories/${deletingFaq.categoryId}/faqs/${deletingFaq.faqId}`
      )
      setDeletingFaq(null)
      await fetchCategories()
      setToast({ type: 'success', message: 'FAQ deleted.' })
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to delete FAQ.' })
    } finally {
      setSubmitting(false)
    }
  }

  /* ------------------------------ Misc ------------------------------ */
  const selectCategoryForFaq = (catId) => {
    setSelectedCategoryId(catId)
    setActiveCategoryId(catId)
  }

  const selectedCategory = categories.find((c) => c._id === selectedCategoryId)

  return (
    <AdminLayout>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <PageHeader
        title="FAQ Management"
        description="Create categories, add, edit or delete frequently asked questions."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Categories"
              subtitle={`${categories.length} categor${categories.length === 1 ? 'y' : 'ies'}`}
            />
            {loading ? (
              <div className="p-8 text-center text-ink-muted text-sm">Loading categories…</div>
            ) : categories.length === 0 ? (
              <EmptyState
                icon="fa-folder-open"
                title="No categories yet"
                description="Create your first FAQ category on the right."
              />
            ) : (
              <div className="divide-y divide-line">
                {categories.map((cat) => {
                  const open = activeCategoryId === cat._id
                  const isSelected = selectedCategoryId === cat._id
                  const faqCount = cat.faqs?.length || 0

                  return (
                    <div key={cat._id}>
                      <button
                        onClick={() => setActiveCategoryId(open ? null : cat._id)}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition text-left"
                      >
                        <span className="font-medium text-ink flex items-center gap-3">
                          {cat.category}
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-ink-muted font-normal">
                            {faqCount} FAQ{faqCount === 1 ? '' : 's'}
                          </span>
                          {isSelected && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                              Selected
                            </span>
                          )}
                        </span>
                        <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'} text-xs text-ink-muted`}></i>
                      </button>

                      {open && (
                        <div className="px-5 pb-5 space-y-3">
                          {faqCount > 0 ? (
                            cat.faqs.map((f) => {
                              const isEditing = editingFaq?.faqId === f._id
                              const isDeleting = deletingFaq?.faqId === f._id

                              /* ---- EDIT MODE ---- */
                              if (isEditing) {
                                return (
                                  <div key={f._id} className="bg-white rounded-lg p-3 border-2 border-brand-300 space-y-2">
                                    <Field label="Question">
                                      <Input
                                        value={editingFaq.question}
                                        onChange={(e) =>
                                          setEditingFaq({ ...editingFaq, question: e.target.value })
                                        }
                                      />
                                    </Field>
                                    <Field label="Answer">
                                      <Textarea
                                        rows={3}
                                        value={editingFaq.answer}
                                        onChange={(e) =>
                                          setEditingFaq({ ...editingFaq, answer: e.target.value })
                                        }
                                      />
                                    </Field>
                                    <div className="flex justify-end gap-2">
                                      <Button variant="secondary" size="sm" onClick={cancelEdit}>
                                        Cancel
                                      </Button>
                                      <Button size="sm" onClick={saveEdit} disabled={submitting}>
                                        {submitting ? 'Saving…' : 'Save Changes'}
                                      </Button>
                                    </div>
                                  </div>
                                )
                              }

                              /* ---- DELETE CONFIRM MODE ---- */
                              if (isDeleting) {
                                return (
                                  <div key={f._id} className="bg-red-50 rounded-lg p-3 border-2 border-red-200">
                                    <div className="flex items-start gap-2">
                                      <i className="fa-solid fa-triangle-exclamation text-red-500 mt-0.5"></i>
                                      <div className="flex-1">
                                        <p className="text-sm font-semibold text-red-700">Delete this FAQ?</p>
                                        <p className="text-xs text-red-600 mt-1 break-words">
                                          "{f.question}" — this cannot be undone.
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-3">
                                      <Button variant="secondary" size="sm" onClick={cancelDelete}>
                                        Cancel
                                      </Button>
                                      <button
                                        type="button"
                                        onClick={confirmDelete}
                                        disabled={submitting}
                                        className="px-3 py-1.5 text-xs font-semibold rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                      >
                                        {submitting ? 'Deleting…' : 'Yes, Delete'}
                                      </button>
                                    </div>
                                  </div>
                                )
                              }

                              /* ---- VIEW MODE ---- */
                              return (
                                <div key={f._id} className="bg-gray-50 rounded-lg p-3 border border-line">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-ink break-words">Q: {f.question}</p>
                                      <p className="text-sm text-ink-muted mt-1 break-words">A: {f.answer}</p>
                                    </div>

                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => startEdit(cat._id, f)}
                                        title="Edit FAQ"
                                        className="w-7 h-7 flex items-center justify-center rounded-md text-ink-muted hover:text-brand-600 hover:bg-white border border-transparent hover:border-line transition cursor-pointer"
                                      >
                                        <i className="fa-solid fa-pen text-xs"></i>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => startDelete(cat._id, f)}
                                        title="Delete FAQ"
                                        className="w-7 h-7 flex items-center justify-center rounded-md text-ink-muted hover:text-red-600 hover:bg-white border border-transparent hover:border-line transition cursor-pointer"
                                      >
                                        <i className="fa-solid fa-trash text-xs"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                          ) : (
                            <p className="text-sm text-ink-subtle italic">
                              No FAQs in this category yet — click below to add one.
                            </p>
                          )}

                          <Button
                            variant={isSelected ? 'secondary' : 'primary'}
                            size="sm"
                            onClick={() => selectCategoryForFaq(cat._id)}
                          >
                            {isSelected ? (
                              <>
                                <i className="fa-solid fa-check mr-1.5"></i>
                                Adding FAQ to this category
                              </>
                            ) : (
                              <>
                                <i className="fa-solid fa-plus mr-1.5"></i>
                                Add FAQ to this category
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          {selectedCategoryId && (
            <Card>
              <CardHeader
                title="New FAQ"
                subtitle={`Adding to: ${selectedCategory?.category || 'Unknown category'}`}
                actions={
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCategoryId(null)}>
                    Close
                  </Button>
                }
              />
              <div className="p-5 space-y-4">
                <Field label="Question">
                  <Input
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    placeholder="e.g. How do I cancel my subscription?"
                  />
                </Field>
                <Field label="Answer">
                  <Textarea
                    rows={4}
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                    placeholder="Type the answer here…"
                  />
                </Field>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedCategoryId(null)
                      setNewFaq({ question: '', answer: '' })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addFaq} disabled={submitting}>
                    {submitting ? 'Adding…' : 'Add FAQ'}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        <Card className="self-start">
          <CardHeader title="Add Category" />
          <div className="p-5 space-y-3">
            <Field label="Category name">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                placeholder="e.g. Billing"
              />
            </Field>
            <Button onClick={addCategory} className="w-full" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create Category'}
            </Button>
            <p className="text-xs text-ink-subtle leading-relaxed">
              After creating a category, the FAQ form opens automatically so you can add questions right away.
            </p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}