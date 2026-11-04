import { useEffect, useState, useRef } from 'react'

/**
 * Full-screen image viewer (lightbox) with:
 *   - Overlay Prev / Next arrow buttons
 *   - Hidden scrollbars
 *   - Unlimited zoom in (wheel, +/− buttons, double-click, keyboard)
 *   - Drag to pan when zoomed
 *   - Thumbnail strip
 *   - Right-click / save protection (deterrent — not absolute)
 */
export default function ProjectImageLightbox({
  isOpen,
  image,
  title,
  images = [],
  blurImage = false,
  onClose,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 })

  /* Jump to the clicked image when opened */
  useEffect(() => {
    if (images && image) {
      const idx = images.indexOf(image)
      setCurrentIndex(idx !== -1 ? idx : 0)
    }
  }, [image, images])

  /* Reset zoom on open and when slide changes */
  useEffect(() => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }, [isOpen, currentIndex])

  /* ---------- zoom controls (NO upper limit) ---------- */
  const zoomIn = () => {
    setZoom((z) => +(z + 0.25).toFixed(2))
  }
  const zoomOut = () => {
    setZoom((z) => {
      const next = Math.max(1, +(z - 0.25).toFixed(2))
      if (next === 1) setOffset({ x: 0, y: 0 })
      return next
    })
  }
  const resetZoom = () => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  /* ---------- navigation ---------- */
  const next = () => {
    if (images.length > 1) setCurrentIndex((p) => (p + 1) % images.length)
  }
  const prev = () => {
    if (images.length > 1) setCurrentIndex((p) => (p - 1 + images.length) % images.length)
  }

  /* ---------- wheel zoom (global, prevent page scroll) ---------- */
  useEffect(() => {
    if (!isOpen) return
    const handleWheel = (e) => {
      e.preventDefault()
      const delta = e.deltaY < 0 ? 0.25 : -0.25
      setZoom((z) => {
        const next = Math.max(1, +(z + delta).toFixed(2))
        if (next === 1) setOffset({ x: 0, y: 0 })
        return next
      })
    }
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [isOpen])

  /* ---------- keyboard ---------- */
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && images.length > 1) next()
      if (e.key === 'ArrowLeft' && images.length > 1) prev()
      if (e.key === '+' || e.key === '=') zoomIn()
      if (e.key === '-' || e.key === '_') zoomOut()
      if (e.key === '0') resetZoom()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, images.length, currentIndex])

  /* ---------- drag to pan ---------- */
  const onMouseDown = (e) => {
    if (zoom === 1) return
    e.preventDefault()
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y }
  }
  const onMouseMove = (e) => {
    if (!dragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setOffset({ x: dragStart.current.ox + dx, y: dragStart.current.oy + dy })
  }
  const onMouseUp = () => setDragging(false)

  const onDoubleClick = () => {
    if (zoom === 1) setZoom(2)
    else resetZoom()
  }

  if (!isOpen) return null

  const currentImg = images.length > 0 ? images[currentIndex] : image

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center select-none"
      onClick={onClose}
      onContextMenu={(e) => e.preventDefault()}
    >
      <style>{`
        .lightbox-noscroll::-webkit-scrollbar { display: none; }
        .lightbox-noscroll { -ms-overflow-style: none; scrollbar-width: none; }
        .lightbox-noscroll img { -webkit-user-drag: none; user-select: none; }
      `}</style>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-b from-black/70 to-transparent">
        <p className="text-white text-sm sm:text-base font-semibold truncate max-w-[60%] font-inter">
          {title || 'Preview'}
          {images.length > 1 && (
            <span className="ml-2 text-white/70 font-normal text-xs sm:text-sm">
              ({currentIndex + 1} of {images.length})
            </span>
          )}
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); onClose() }}
          className="w-10 h-10 rounded-full bg-white/15 hover:bg-red-600 text-white flex items-center justify-center transition-colors duration-150 shadow-lg cursor-pointer"
          title="Close (Esc)"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      {/* Main image area */}
      <div
        className="relative w-full h-full flex items-center justify-center px-4 sm:px-16 py-16 overflow-hidden lightbox-noscroll"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{ cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <img
          src={currentImg}
          alt={title || 'Enlarged Project View'}
          className={`max-h-full max-w-full object-contain ${blurImage ? 'img-blur-modal' : ''}`}
          style={{
            transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
            willChange: 'transform',
          }}
          onDoubleClick={onDoubleClick}
          onDragStart={(e) => e.preventDefault()}
          onError={(e) => { e.target.src = '/assets/slider.png' }}
          draggable={false}
        />

        {/* Block right-click on image */}
        <div
          className="absolute inset-0"
          onContextMenu={(e) => e.preventDefault()}
          style={{ pointerEvents: zoom === 1 ? 'auto' : 'none' }}
        />

        {blurImage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 shadow-lg">
              <i className="fa-solid fa-lock text-xs"></i>
              Confidential project — image blurred
            </span>
          </div>
        )}
      </div>

      {/* Prev / Next — overlay on image edges */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="group absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full
                       bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white
                       flex items-center justify-center transition-colors duration-150 shadow-xl
                       border border-white/20 hover:border-white/40 cursor-pointer"
            title="Previous (←)"
            aria-label="Previous image"
          >
            <i className="fa-solid fa-chevron-left text-lg sm:text-xl"></i>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="group absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full
                       bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white
                       flex items-center justify-center transition-colors duration-150 shadow-xl
                       border border-white/20 hover:border-white/40 cursor-pointer"
            title="Next (→)"
            aria-label="Next image"
          >
            <i className="fa-solid fa-chevron-right text-lg sm:text-xl"></i>
          </button>
        </>
      )}

      {/* Zoom controls — unlimited zoom in, zoom out stops at 1× */}
      <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); zoomIn() }}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white
                     flex items-center justify-center transition-colors duration-150 shadow-lg border border-white/20
                     cursor-pointer"
          title="Zoom in (+)"
        >
          <i className="fa-solid fa-magnifying-glass-plus text-sm"></i>
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); zoomOut() }}
          disabled={zoom <= 1}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white
                     flex items-center justify-center transition-colors duration-150 shadow-lg border border-white/20
                     disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          title="Zoom out (−)"
        >
          <i className="fa-solid fa-magnifying-glass-minus text-sm"></i>
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); resetZoom() }}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white
                     flex items-center justify-center transition-colors duration-150 shadow-lg border border-white/20 cursor-pointer"
          title="Reset zoom (0)"
        >
          <i className="fa-solid fa-compress text-sm"></i>
        </button>
      </div>

      {/* Zoom percentage indicator */}
      {zoom > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-semibold tabular-nums">
          {Math.round(zoom * 100)}%
        </div>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-20 px-4 sm:px-6 pb-3 sm:pb-4 bg-gradient-to-t from-black/80 to-transparent pt-6">
          <div
            className="flex gap-2 overflow-x-auto px-2 py-1 justify-start sm:justify-center lightbox-noscroll"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-12 w-16 sm:h-14 sm:w-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors duration-150 cursor-pointer ${
                  currentIndex === i
                    ? 'border-white scale-105 shadow-lg'
                    : 'border-white/30 hover:border-white/60 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumb ${i + 1}`}
                  loading="lazy"
                  className={`w-full h-full object-cover ${blurImage ? 'img-blur-thumb' : ''}`}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}