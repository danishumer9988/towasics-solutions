import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

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
import Portfolio from './pages/Portfolio'

import Dashboard from './pages/admin/Dashboard'
import BlogAdmin from './pages/admin/BlogAdmin'
import BlogNew from './pages/admin/BlogNew'
import BlogEdit from './pages/admin/BlogEdit'
import Login from './pages/admin/Login'
import AdminUsers from './pages/admin/AdminUsers'
import Subscriptions from './pages/admin/Subscriptions'
import AddFAQ from './pages/admin/AddFAQ'
import ProjectAdmin from './pages/admin/ProjectAdmin'
import ProjectNew from './pages/admin/ProjectNew'
import ProjectEdit from './pages/admin/ProjectEdit'
import IndustryAdmin from './pages/admin/IndustryAdmin'
import EstimateSubmissions from './pages/admin/EstimateSubmissions'

import Analytics, { VisitorDetail } from './pages/admin/Analytics'

import WhatsAppButton from './components/WhatsAppButton'
import CookieConsent from './components/CookieConsent'
import EstimatePopup from './components/EstimatePopup'
import { trackPageView, initClickTracking, initExitTracking } from './lib/analytics'

import VerifyInvite from './pages/admin/VerifyInvite'
import ContactSubmissions from './pages/admin/ContactSubmissions'

/* Admin / private pages: no tracking, no cookie banner, no popups.
   NOTE: '/blogs/:slug' is a PUBLIC blog post, so only the admin
   blog routes ('/blogs', '/blogs/new', '/blogs/edit/:id') are listed. */
const ADMIN_PREFIXES = [
  '/admin',
  '/dashboard',
  '/auth',
  '/subscriptions',
  '/addfaq',
]

const isAdminPath = (p) =>
  ADMIN_PREFIXES.some((prefix) => p.startsWith(prefix)) ||
  p === '/blogs' ||
  p === '/blogs/' ||
  p === '/blogs/new' ||
  p.startsWith('/blogs/edit/')

function TrackerMount() {
  const location = useLocation()
  useEffect(() => {
    initClickTracking()
    initExitTracking()
  }, [])
  useEffect(() => {
    if (isAdminPath(location.pathname)) return
    trackPageView()
  }, [location.pathname, location.search])
  return null
}

function useIsAdminArea() {
  const { pathname } = useLocation()
  return isAdminPath(pathname)
}

function ConditionalWhatsApp() {
  if (useIsAdminArea()) return null
  return <WhatsAppButton />
}

function ConditionalCookieConsent() {
  if (useIsAdminArea()) return null
  return <CookieConsent />
}

function ConditionalEstimatePopup() {
  if (useIsAdminArea()) return null
  return <EstimatePopup />
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ConditionalWhatsApp />
      <ConditionalCookieConsent />
      <ConditionalEstimatePopup />
      <TrackerMount />

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
        <Route path="/portfolio" element={<Portfolio />} />

        <Route path="/auth/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/admin/projects" element={<ProjectAdmin />} />
        <Route path="/admin/projects/new" element={<ProjectNew />} />
        <Route path="/admin/projects/edit/:id" element={<ProjectEdit />} />

        <Route path="/admin/industries" element={<IndustryAdmin />} />

        <Route path="/blogs" element={<BlogAdmin />} />
        <Route path="/blogs/new" element={<BlogNew />} />
        <Route path="/blogs/edit/:id" element={<BlogEdit />} />

        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/addfaq" element={<AddFAQ />} />

        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/analytics/visitor/:visitorId" element={<VisitorDetail />} />

        <Route path="/admin/verify-invite" element={<VerifyInvite />} />
        <Route path="/admin/contacts" element={<ContactSubmissions />} />
        <Route path="/admin/estimates" element={<EstimateSubmissions />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App