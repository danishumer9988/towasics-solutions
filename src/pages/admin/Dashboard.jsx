import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminSidebar from '../../components/AdminSidebar'
import { API_BASE_URL } from '../../config'

export default function Dashboard() {
  const [contacts, setContacts] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      navigate('/auth/login')
    }
  }, [navigate])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
        const [contactsRes, subRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/contacts`, config),
          axios.get(`${API_BASE_URL}/subscriptions`, config)
        ])
        setContacts(contactsRes.data)
        setSubscriptions(subRes.data)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleViewDetails = (contact) => {
    setSelectedContact(contact)
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <AdminSidebar />
        
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

        {loading ? (
          <div className="text-center py-10 font-medium text-gray-500">Loading dashboard data...</div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {/* Contact Submissions Table */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Contact Forms</h2>
              <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contacts.map((contact) => (
                      <tr key={contact._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {contact.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {contact.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {contact.service || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleViewDetails(contact)}
                            className="text-brand-600 hover:text-brand-900 flex items-center font-medium"
                          >
                            <i className="fa-solid fa-eye mr-1"></i> View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {contacts.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          No contact forms submitted yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal for viewing submission details */}
        {modalOpen && selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4 border-b pb-3">
                  <h3 className="text-xl font-bold text-gray-800">Contact Details</h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 text-sm">Name</h4>
                    <p className="text-gray-900 mt-0.5">{selectedContact.name}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 text-sm">Email</h4>
                    <p className="text-gray-900 mt-0.5">{selectedContact.email}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 text-sm">Phone</h4>
                    <p className="text-gray-900 mt-0.5">{selectedContact.phone || '-'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 text-sm">Service</h4>
                    <p className="text-gray-900 mt-0.5">{selectedContact.service || '-'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 text-sm">Budget</h4>
                    <p className="text-gray-900 mt-0.5">{selectedContact.budget || '-'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 text-sm">R&D Inquiry</h4>
                    <p className="text-gray-900 mt-0.5">{selectedContact.RND ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-700 text-sm">Message</h4>
                    <p className="text-gray-900 mt-0.5 whitespace-pre-line bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {selectedContact.message || '-'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-700 text-sm">Submitted On</h4>
                    <p className="text-gray-900 mt-0.5">
                      {selectedContact.createdAt ? new Date(selectedContact.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end pt-3 border-t">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
