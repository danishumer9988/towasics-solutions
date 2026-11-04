import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import SEO from '../components/SEO'
import ProjectImageLightbox from '../components/public/ProjectImageLightbox'
import ProjectDetailModal from '../components/public/ProjectDetailModal'
import ProjectCard from '../components/public/ProjectCard'
import { API_BASE_URL } from '../config'

const PER_PAGE = 20

/* ===================== Main Page ===================== */
export default function Portfolio() {
  const [industries, setIndustries] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedProject, setSelectedProject] = useState(null)
  const [lightbox, setLightbox] = useState({ isOpen: false, image: '', images: [], title: '', blurImage: false })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const [indRes, projRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/industries`),
          axios.get(`${API_BASE_URL}/projects`),
        ])
        if (cancelled) return
        setIndustries(Array.isArray(indRes.data) ? indRes.data : [])
        setProjects(Array.isArray(projRes.data) ? projRes.data : [])
      } catch (err) {
        console.error(err)
        if (!cancelled) setError('Failed to load portfolio. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    if (selectedIndustry === 'all') return projects
    return projects.filter((p) => p.industry === selectedIndustry)
  }, [projects, selectedIndustry])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const pageItems = useMemo(() => {
    const start = (page - 1) * PER_PAGE
    return filtered.slice(start, start + PER_PAGE)
  }, [filtered, page])

  const handleSelectIndustry = (slug) => {
    setSelectedIndustry(slug)
    setPage(1)
  }

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
    window.scrollTo({ top: 320, behavior: 'smooth' })
  }

  const handleEnlargeImage = (image, images, title, blurImage = false) => {
    setLightbox({
      isOpen: true,
      image,
      images: images && images.length > 0 ? images : [image],
      title,
      blurImage,
    })
  }

  const handleCloseLightbox = () => {
    setLightbox({ isOpen: false, image: '', images: [], title: '', blurImage: false })
  }

  const countForIndustry = (slug) =>
    slug === 'all' ? projects.length : projects.filter((p) => p.industry === slug).length

  return (
    <div className="min-h-screen bg-white">

      <SEO
        title="Portfolio — Delivered Data Scraping & Automation Projects"
        description="235+ delivered projects across web scraping, intelligent automation, AI bots, super intelligence, and dashboards. Browse featured case studies."
        path="/portfolio"
        image="/assets/og-image.jpg"
      />
      <Navbar />

      {/* ===================== HERO ===================== */}
      <PageHeader
        title="Portfolio"
        description="Explore the projects we've delivered across industries, from web scraping and automation to full-stack AI-powered IoT systems."
        image="/assets/works.png"
        imageAlt="Portfolio"
      />

      {/* ===================== INDUSTRY TAB BAR ===================== */}
      <section className="sticky top-16 z-40 bg-white/60 backdrop-blur-md border-b border-gray-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-5">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={() => handleSelectIndustry('all')}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedIndustry === 'all'
                    ? 'bg-[#0a85a7] text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-[#0a85a7] hover:text-[#0a85a7]'
                }`}
              >
                All
                <span
                  className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedIndustry === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {projects.length}
                </span>
              </button>

              {industries.map((ind) => {
                const count = countForIndustry(ind.slug)
                const active = selectedIndustry === ind.slug
                return (
                  <button
                    key={ind._id}
                    type="button"
                    onClick={() => handleSelectIndustry(ind.slug)}
                    className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[#0a85a7] text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-[#0a85a7] hover:text-[#0a85a7]'
                    }`}
                  >
                    {ind.name}
                    <span
                      className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                        active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PROJECT GRID ===================== */}
      <section className="py-12 sm:py-16 bg-[#F7FBFD] min-h-[400px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-gray-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 w-3/4 bg-gray-200 rounded" />
                    <div className="h-3 w-full bg-gray-100 rounded" />
                    <div className="h-3 w-5/6 bg-gray-100 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="max-w-xl mx-auto text-center bg-white rounded-2xl shadow-md p-8 border border-red-100">
              <i className="fa-solid fa-triangle-exclamation text-red-500 text-3xl mb-3"></i>
              <p className="text-gray-700 font-medium">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="max-w-xl mx-auto text-center bg-white rounded-2xl shadow-md p-10 border border-[#e2eff2]">
              <i className="fa-regular fa-folder-open text-[#0a85a7] text-4xl mb-4"></i>
              <h3 className="text-xl font-bold text-[#086B87] mb-2">
                {selectedIndustry === 'all' ? 'Portfolio coming soon' : 'No projects in this industry yet'}
              </h3>
              <p className="text-gray-600 text-sm">
                {selectedIndustry === 'all'
                  ? "We're curating our latest projects. Check back shortly."
                  : 'Try selecting a different industry tab.'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {pageItems.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onReadMore={setSelectedProject}
                    onEnlarge={handleEnlargeImage}
                    variant="grid"
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                      page === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-[#0a85a7] border border-[#0a85a7] hover:bg-[#0a85a7] hover:text-white'
                    }`}
                  >
                    <i className="fa-solid fa-chevron-left text-xs mr-1"></i>
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((n) => {
                      if (totalPages <= 7) return true
                      if (n === 1 || n === totalPages) return true
                      if (Math.abs(n - page) <= 1) return true
                      return false
                    })
                    .map((n, idx, arr) => {
                      const prev = arr[idx - 1]
                      const gap = prev && n - prev > 1
                      return (
                        <span key={n} className="inline-flex items-center gap-1.5">
                          {gap && <span className="px-2 text-gray-400">…</span>}
                          <button
                            type="button"
                            onClick={() => goToPage(n)}
                            className={`w-10 h-10 rounded-lg text-sm font-semibold transition ${
                              page === n
                                ? 'bg-[#0a85a7] text-white shadow-md'
                                : 'bg-white text-gray-700 border border-gray-200 hover:border-[#0a85a7] hover:text-[#0a85a7]'
                            }`}
                          >
                            {n}
                          </button>
                        </span>
                      )
                    })}

                  <button
                    type="button"
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                      page === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-[#0a85a7] border border-[#0a85a7] hover:bg-[#0a85a7] hover:text-white'
                    }`}
                  >
                    Next
                    <i className="fa-solid fa-chevron-right text-xs ml-1"></i>
                  </button>
                </div>
              )}

              <p className="text-center text-xs text-gray-500 mt-5">
                Showing {pageItems.length} of {filtered.length} project{filtered.length === 1 ? '' : 's'}
                {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
              </p>
            </>
          )}
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="py-16 bg-white text-center px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#086B87] mb-4">
          Have a project in mind?
        </h2>
        <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
          Let's discuss how we can help you engineer your project.{' '}
          <Link to="/contactus" className="text-[#3EB5D6] underline hover:text-[#096078] font-semibold transition">
            Schedule a call
          </Link>
          .
        </p>
      </section>

      <ProjectDetailModal
        isOpen={!!selectedProject}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onEnlarge={handleEnlargeImage}
      />

      <ProjectImageLightbox
        isOpen={lightbox.isOpen}
        image={lightbox.image}
        images={lightbox.images}
        title={lightbox.title}
        blurImage={lightbox.blurImage}
        onClose={handleCloseLightbox}
      />

      <Footer />
    </div>
  )
}