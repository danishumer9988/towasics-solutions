import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import Industries from './pages/Industries'
import HowItWorks from './pages/HowItWorks'
import FAQ from './pages/FAQ'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import ServicePage from './pages/ServicePage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import NotFound from './pages/NotFound'
import Dashboard from './pages/admin/Dashboard'
import BlogAdmin from './pages/admin/BlogAdmin'
import BlogNew from './pages/admin/BlogNew'
import BlogEdit from './pages/admin/BlogEdit'
import Login from './pages/admin/Login'
import AdminUsers from './pages/admin/AdminUsers'
import Subscriptions from './pages/admin/Subscriptions'
import AddFAQ from './pages/admin/AddFAQ'
import AdminSidebar from './components/AdminSidebar'
import ProjectAdmin from './pages/admin/ProjectAdmin'
import ProjectNew from './pages/admin/ProjectNew'
import ProjectEdit from './pages/admin/ProjectEdit'

import WhatsAppButton from './components/WhatsAppButton'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <WhatsAppButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/howworks" element={<HowItWorks />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/services/:serviceName" element={<ServicePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        {/* Admin routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/blogs" element={<BlogAdmin />} />
        <Route path="/blogs/new" element={<BlogNew />} />
        <Route path="/blogs/edit/:id" element={<BlogEdit />} />
        <Route path="/admin/projects" element={<ProjectAdmin />} />
        <Route path="/admin/projects/new" element={<ProjectNew />} />
        <Route path="/admin/projects/edit/:id" element={<ProjectEdit />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/users" element={<AdminSidebar />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/addfaq" element={<AddFAQ />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}


export default App
