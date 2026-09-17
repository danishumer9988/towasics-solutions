import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminSidebar from '../../components/AdminSidebar'
import { API_BASE_URL } from '../../config'

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      navigate('/auth/login')
    }
  }, [navigate])

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${API_BASE_URL}/subscriptions`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setSubscriptions(res.data)
      } catch (err) {
        console.error('Error fetching subscriptions:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSubscriptions()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <AdminSidebar />
        
        <div className="mb-12 container mx-auto bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-3">Email Subscriptions</h2>
          {loading ? (
            <div className="text-center py-6 text-gray-500 font-medium">Loading subscription list...</div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No subscriptions found.</div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email Address
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscription Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscriptions.map((sub) => (
                    <tr key={sub._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {sub.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
