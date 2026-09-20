import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import AdminLayout from '../../components/admin/AdminLayout'
import { PageHeader, Card, CardHeader, Button, Field, Input, Textarea, EmptyState } from '../../components/admin/ui'

export default function AddFAQ() {
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' })
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/auth/login')
  }, [navigate])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`)
      setCategories(res.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchCategories() }, [])

  const addCategory = async () => {
    if (!newCategoryName.trim()) return
    try {
      await axios.post(`${API_BASE_URL}/categories`, { category: newCategoryName })
      setNewCategoryName(''); fetchCategories()
    } catch (err) { console.error(err) }
  }

  const addFaq = async () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim() || !selectedCategoryId) return
    try {
      await axios.post(`${API_BASE_URL}/categories/${selectedCategoryId}/faqs`, newFaq)
      setNewFaq({ question: '', answer: '' })
      setSelectedCategoryId(null)
      fetchCategories()
    } catch (err) { console.error(err) }
  }

  return (
    <AdminLayout>
      <PageHeader
        title="FAQ Management"
        description="Create categories and add frequently asked questions."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Categories" subtitle={`${categories.length} categor${categories.length === 1 ? 'y' : 'ies'}`} />
            {loading ? (
              <div className="p-8 text-center text-ink-muted text-sm">Loading categories…</div>
            ) : categories.length === 0 ? (
              <EmptyState icon="fa-folder-open" title="No categories yet" description="Create your first FAQ category on the right." />
            ) : (
              <div className="divide-y divide-line">
                {categories.map((cat) => {
                  const open = activeCategoryId === cat._id
                  return (
                    <div key={cat._id}>
                      <button
                        onClick={() => setActiveCategoryId(open ? null : cat._id)}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition text-left"
                      >
                        <span className="font-medium text-ink">{cat.category}</span>
                        <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'} text-xs text-ink-muted`}></i>
                      </button>
                      {open && (
                        <div className="px-5 pb-5 space-y-3">
                          {cat.faqs?.length ? cat.faqs.map((f, i) => (
                            <div key={i} className="bg-gray-50 rounded-lg p-3 border border-line">
                              <p className="text-sm font-medium text-ink">Q: {f.question}</p>
                              <p className="text-sm text-ink-muted mt-1">A: {f.answer}</p>
                            </div>
                          )) : (
                            <p className="text-sm text-ink-subtle italic">No FAQs in this category yet.</p>
                          )}
                          <Button
                            variant="secondary" size="sm"
                            onClick={() => setSelectedCategoryId(cat._id)}
                          >
                            {selectedCategoryId === cat._id ? 'Selected' : 'Add FAQ here'}
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
              <CardHeader title="New FAQ" />
              <div className="p-5 space-y-4">
                <Field label="Question">
                  <Input value={newFaq.question} onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })} />
                </Field>
                <Field label="Answer">
                  <Textarea rows={4} value={newFaq.answer} onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })} />
                </Field>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setSelectedCategoryId(null)}>Cancel</Button>
                  <Button onClick={addFaq}>Add FAQ</Button>
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
            <Button onClick={addCategory} className="w-full">Create Category</Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}