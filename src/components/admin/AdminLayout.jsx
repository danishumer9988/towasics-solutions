import AdminSidebar from '../AdminSidebar'

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 min-w-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}