import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import { API_BASE_URL } from '../config'

const PER_PAGE = 20

/* ===================== Project Detail Modal ===================== */
function ProjectDetailModal({ isOpen, project, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const images = project?.images?.length ? project.images : ['/assets/slider.png']

  useEffect(() => {
    if (isOpen) setCurrentIndex(0)
  }, [isOpen, project])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (images.length > 1) {
        if (e.key === 'ArrowRight') setCurrentIndex((p) => (p + 1) % images.length)
        if (e.key === 'ArrowLeft') setCurrentIndex((p) => (p - 1 + images.length) % images.length)
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, images.length, onClose])

  if (!isOpen || !project) return null

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <span className="bg-[#0a85a7] text-white px-3 py-1 rounded-full text-xs font-bold">
            Project #{project.projectNumber?.toString().padStart(2, '0') || '—'}
          </span>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-7">
          <div className="rounded-2xl overflow-hidden bg-gray-50 aspect-video mb-4 flex items-center justify-center">
            <img
              src={images[currentIndex]}
              alt={project.title}
              className="w-full h-full object-contain"
              onError={(e) => { e.target.src = '/assets/slider.png' }}
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-thin">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-14 w-24 rounded-lg overflow-hidden border-2 flex-shrink-0 transition cursor-pointer ${
                    currentIndex === i ? 'border-[#0a85a7] scale-105 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`Thumb ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#086B87] mb-4 leading-tight font-inter">
            {project.title}
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line font-medium font-inter">
            {project.description}
          </p>

          {project.link && project.link.trim() && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0a85a7] hover:bg-[#097390] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition"
              >
                Visit Project
                <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ===================== Project Card ===================== */
function ProjectCard({ project, onReadMore }) {
  const cover = project.images?.[0] || '/assets/slider.png'
  const hasLink = project.link && project.link.trim().length > 0

  const handleReadMore = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (hasLink) {
      window.open(project.link, '_blank', 'noopener,noreferrer')
    } else {
      onReadMore(project)
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-white/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={cover}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => { e.target.src = '/assets/slider.png' }}
        />
        <span className="absolute top-3 left-3 bg-[#0a85a7] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
          #{project.projectNumber?.toString().padStart(2, '0') || '—'}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1 text-left">
        <h3
          className="text-lg font-bold text-[#086B87] mb-2 leading-snug font-inter"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {project.title}
        </h3>
        <p
          className="text-sm text-gray-600 leading-relaxed mb-4 flex-1 font-medium font-inter"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {project.description}
        </p>

        <button
          type="button"
          onClick={handleReadMore}
          className="self-start inline-flex items-center gap-2 text-[#0a85a7] hover:text-[#097390] font-semibold text-sm transition-all hover:gap-3 cursor-pointer bg-transparent border-0 p-0"
        >
          Read More
          {hasLink ? (
            <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
          ) : (
            <i className="fa-solid fa-arrow-right text-xs"></i>
          )}
        </button>
      </div>
    </div>
  )
}

/* ===================== Main Page ===================== */
export default function Portfolio() {
  const [industries, setIndustries] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true); setError('')
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

  const countForIndustry = (slug) =>
    slug === 'all' ? projects.length : projects.filter((p) => p.industry === slug).length

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ===================== HERO ===================== */}
      <PageHeader
        title="Our Portfolio"
        description="Real solutions we've delivered across industries — from web scraping and automation to AI-powered systems."
        image="/assets/allservice.png"
        imageAlt="Portfolio"
      />

      {/* ===================== INDUSTRY TAB BAR ===================== */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 overflow-x-auto scrollbar-thin">
            <div className="flex gap-2 min-w-max">
              <button
                type="button"
                onClick={() => handleSelectIndustry('all')}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedIndustry === 'all'
                    ? 'bg-[#0a85a7] text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-[#0a85a7] hover:text-[#0a85a7]'
                }`}
              >
                All
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
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
                    className={`px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                      active
                        ? 'bg-[#0a85a7] text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-[#0a85a7] hover:text-[#0a85a7]'
                    }`}
                  >
                    {ind.name}
                    <span
                      className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pageItems.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onReadMore={setSelectedProject}
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

              {/* Count line */}
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
          Let's talk about how we can help you solve it.{' '}
          <Link to="/contactus" className="text-[#3EB5D6] underline hover:text-[#096078] font-semibold transition">
            Start a conversation
          </Link>
          .
        </p>
      </section>

      <ProjectDetailModal
        isOpen={!!selectedProject}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <Footer />
    </div>
  )
}