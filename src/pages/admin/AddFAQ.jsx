import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminSidebar from '../../components/AdminSidebar'
import { API_BASE_URL } from '../../config'

export default function AddFAQ() {
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' })
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      navigate('/auth/login')
    }
  }, [navigate])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`)
      setCategories(res.data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        await axios.post(`${API_BASE_URL}/categories`, { category: newCategoryName })
        setNewCategoryName('')
        fetchCategories()
      } catch (err) {
        console.error('Error adding category:', err)
      }
    }
  }

  const handleAddFaq = async () => {
    if (newFaq.question.trim() && newFaq.answer.trim() && selectedCategoryId) {
      try {
        await axios.post(`${API_BASE_URL}/categories/${selectedCategoryId}/faqs`, newFaq)
        setNewFaq({ question: '', answer: '' })
        setSelectedCategoryId(null)
        fetchCategories()
      } catch (err) {
        console.error('Error adding FAQ:', err)
      }
    }
  }

  const toggleCategory = (id) => {
    setActiveCategoryId(activeCategoryId === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <AdminSidebar />
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">FAQ Management</h2>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Go back
          </button>
        </div>

        {/* Add Category Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Add New Category</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition"
              onClick={handleAddCategory}
            >
              Add Category
            </button>
          </div>
        </div>

        {/* Categories and FAQs Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Categories</h3>
          {loading ? (
            <div className="text-center py-6 text-gray-500 font-medium">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-6 text-gray-500 font-medium">No categories yet. Add one above!</div>
          ) : (
            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat._id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition select-none"
                    onClick={() => toggleCategory(cat._id)}
                  >
                    <h4 className="font-bold text-gray-800">{cat.category}</h4>
                    <span className="text-xl font-semibold text-gray-600">
                      {activeCategoryId === cat._id ? '−' : '+'}
                    </span>
                  </div>

                  {activeCategoryId === cat._id && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      {cat.faqs && cat.faqs.length > 0 ? (
                        <div className="space-y-3 mb-4">
                          {cat.faqs.map((faq, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                              <div className="font-semibold text-gray-800 mb-1">Q: {faq.question}</div>
                              <div className="text-gray-600">A: {faq.answer}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm italic mb-4">No FAQs in this category yet.</div>
                      )}

                      <button
                        className="px-4 py-2 border-2 border-brand-500 text-brand-600 hover:bg-brand-50 font-medium rounded-lg transition"
                        onClick={() => setSelectedCategoryId(cat._id)}
                      >
                        {selectedCategoryId === cat._id ? 'Adding FAQ...' : 'Add FAQ to this Category'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add FAQ Form Section */}
        {selectedCategoryId && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Add New FAQ</h3>
            <div className="space-y-4">
              <div className="input-group">
                <label className="block text-gray-600 font-medium mb-1">Question</label>
                <input
                  type="text"
                  placeholder="Enter question"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="input-group">
                <label className="block text-gray-600 font-medium mb-1">Answer</label>
                <textarea
                  placeholder="Enter answer"
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition"
                  onClick={handleAddFaq}
                >
                  Add FAQ
                </button>
                <button
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
                  onClick={() => setSelectedCategoryId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
