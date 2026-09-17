import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminSidebar from '../../components/AdminSidebar'
import { API_BASE_URL } from '../../config'

export default function ProjectAdmin() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      navigate('/auth/login')
    }
  }, [navigate])

  const fetchProjects = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${API_BASE_URL}/projects`)
      setProjects(res.data)
    } catch (err) {
      setError('Failed to load portfolio projects')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this portfolio project?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
        await axios.delete(`${API_BASE_URL}/projects/${id}`, config)
        setProjects(projects.filter(project => project._id !== id))
      } catch (err) {
        console.error('Failed to delete project', err)
        setError('Failed to delete project')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <AdminSidebar />
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Portfolio Projects</h1>
          <Link 
            to="/admin/projects/new" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200 font-semibold"
          >
            Add New Project
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 font-medium text-gray-500">Loading portfolio projects...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 font-semibold">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                    Images
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                      #{project.projectNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex -space-x-2 overflow-hidden">
                        {project.images && project.images.map((img, i) => (
                          <img 
                            key={i} 
                            src={img} 
                            alt={`Preview ${i}`} 
                            className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover bg-gray-50" 
                          />
                        ))}
                        {(!project.images || project.images.length === 0) && (
                          <span className="text-xs text-gray-400">No images</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                      {project.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                      {project.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3 text-lg">
                        <Link to={`/admin/projects/edit/${project._id}`} className="text-blue-500 hover:text-blue-700">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </Link>
                        <button onClick={() => handleDelete(project._id)} className="text-red-500 hover:text-red-700">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No portfolio projects created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
