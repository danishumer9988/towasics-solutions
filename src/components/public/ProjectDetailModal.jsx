import { useEffect, useState } from 'react'
import ProjectDescriptionBlocks from './ProjectDescriptionBlocks'

const getVideoUrl = (project) => {
  const url = typeof project?.videoLink === 'string' ? project.videoLink.trim() : ''
  return /^https?:\/\//i.test(url) ? url : ''
}

const IMG_PROTECT = {
  draggable: false,
  onDragStart: (e) => e.preventDefault(),
  onContextMenu: (e) => e.preventDefault(),
}

export default function ProjectDetailModal({ isOpen, project, onClose, onEnlarge }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Normalize images to ensure objects
  const safeImages = project?.images?.length
    ? project.images.map(img => typeof img === 'string' ? { url: img, blurred: false } : img)
    : [{ url: '/assets/slider.png', blurred: false }]

  const currentImage = safeImages[currentIndex] || safeImages[0]

  useEffect(() => {
    if (isOpen) setCurrentIndex(0)
  }, [isOpen, project])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (safeImages.length > 1) {
        if (e.key === 'ArrowRight') setCurrentIndex((p) => (p + 1) % safeImages.length)
        if (e.key === 'ArrowLeft') setCurrentIndex((p) => (p - 1 + safeImages.length) % safeImages.length)
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, safeImages.length, onClose])

  if (!isOpen || !project) return null

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none"
      onClick={onClose}
      onContextMenu={(e) => e.preventDefault()}
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
            title="Close (Esc)"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-7">
          <div
            className="rounded-2xl overflow-hidden bg-gray-50 aspect-video mb-4 flex items-center justify-center relative cursor-zoom-in"
            onClick={() => onEnlarge?.(currentImage.url, safeImages.map(img => img.url), project.title)}
            onContextMenu={(e) => e.preventDefault()}
          >
            <img
              src={currentImage.url}
              alt={project.title}
              className={`w-full h-full object-contain ${currentImage.blurred ? 'img-blur-modal' : ''}`}
              onError={(e) => { e.target.src = '/assets/slider.png' }}
              {...IMG_PROTECT}
            />
            {currentImage.blurred && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 shadow-lg">
                  <i className="fa-solid fa-lock text-xs"></i>
                  Confidential project — image blurred
                </span>
              </div>
            )}
          </div>

          {safeImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-thin">
              {safeImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`h-14 w-24 rounded-lg overflow-hidden border-2 flex-shrink-0 transition cursor-pointer ${
                    currentIndex === i ? 'border-[#0a85a7] scale-105 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`Thumb ${i + 1}`}
                    loading="lazy"
                    className={`w-full h-full object-cover ${img.blurred ? 'img-blur-thumb' : ''}`}
                    {...IMG_PROTECT}
                  />
                </button>
              ))}
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#086B87] mb-4 leading-tight font-inter">
            {project.title}
          </h2>
          <ProjectDescriptionBlocks project={project} />

          {((project.link && project.link.trim()) || getVideoUrl(project)) && (
            <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap gap-3">
              {project.link && project.link.trim() && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0a85a7] hover:bg-[#097390] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition"
                >
                  Visit Project
                  <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                </a>
              )}
              {getVideoUrl(project) && (
                <a
                  href={getVideoUrl(project)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-[#0a85a7] border border-[#0a85a7] hover:bg-[#0a85a7] hover:text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition"
                >
                  <i className="fa-solid fa-play text-xs"></i>
                  Watch Video
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}