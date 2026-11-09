import { useEffect, useState, useRef } from 'react';
import EffectImage from './EffectImage';
import {
  getImageUrl,
  resolveImageEffects,
  DEFAULT_IMAGE_EFFECTS,
} from '../../lib/imageEffects.jsx';

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
const BUTTON_STEP = 1.25;

export default function ProjectImageLightbox({
  isOpen,
  image,
  title,
  images = [],
  blurImage = false,
  project = null,
  onClose,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setViewState] = useState({ zoom: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const viewRef = useRef({ zoom: 1, x: 0, y: 0 });
  const dragRef = useRef({ active: false, sx: 0, sy: 0, ox: 0, oy: 0 });
  const movedRef = useRef(false);
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  /* Normalize entries */
  const entries = images.length > 0 ? images : [{ url: image, effects: null }];

  const commit = (v) => {
    viewRef.current = v;
    setViewState(v);
  };

  /* Jump to the clicked image */
  useEffect(() => {
    if (!entries.length || !image) return;
    const idx = entries.findIndex((entry) => getImageUrl(entry) === image);
    setCurrentIndex(idx !== -1 ? idx : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, images]);

  /* Reset zoom on open + slide change */
  useEffect(() => {
    commit({ zoom: 1, x: 0, y: 0 });
  }, [isOpen, currentIndex]);

  /* ---------- pan clamp ---------- */
  const clampXY = (x, y, z) => {
    if (z <= 1) return { x: 0, y: 0 };
    const box = containerRef.current;
    const img = imgRef.current;
    if (!box || !img) return { x, y };
    const maxX = Math.max(0, (img.offsetWidth * z - box.clientWidth) / 2);
    const maxY = Math.max(0, (img.offsetHeight * z - box.clientHeight) / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  /* ---------- zoom ---------- */
  const zoomTo = (nextZoom, px = 0, py = 0) => {
    const { zoom, x, y } = viewRef.current;
    const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));
    if (z === zoom) return;
    if (z <= 1) {
      commit({ zoom: 1, x: 0, y: 0 });
      return;
    }
    const nx = px - ((px - x) * z) / zoom;
    const ny = py - ((py - y) * z) / zoom;
    commit({ zoom: z, ...clampXY(nx, ny, z) });
  };

  const zoomIn = () => zoomTo(viewRef.current.zoom * BUTTON_STEP);
  const zoomOut = () => zoomTo(viewRef.current.zoom / BUTTON_STEP);
  const resetZoom = () => commit({ zoom: 1, x: 0, y: 0 });

  const pointFromEvent = (e) => {
    const box = containerRef.current;
    if (!box) return { px: 0, py: 0 };
    const r = box.getBoundingClientRect();
    return {
      px: e.clientX - (r.left + r.width / 2),
      py: e.clientY - (r.top + r.height / 2),
    };
  };

  /* ---------- navigation ---------- */
  const next = () => {
    if (entries.length > 1) setCurrentIndex((p) => (p + 1) % entries.length);
  };
  const prev = () => {
    if (entries.length > 1) setCurrentIndex((p) => (p - 1 + entries.length) % entries.length);
  };

  /* ---------- wheel zoom ---------- */
  useEffect(() => {
    if (!isOpen) return;
    const handleWheel = (e) => {
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : 1;
      const dy = Math.max(-120, Math.min(120, e.deltaY * unit));
      const factor = Math.exp(-dy * 0.0015);
      const { px, py } = pointFromEvent(e);
      zoomTo(viewRef.current.zoom * factor, px, py);
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /* ---------- keyboard ---------- */
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && entries.length > 1) next();
      if (e.key === 'ArrowLeft' && entries.length > 1) prev();
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-' || e.key === '_') zoomOut();
      if (e.key === '0') resetZoom();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, entries.length, currentIndex]);

  /* ---------- drag to pan ---------- */
  const onPointerDown = (e) => {
    if (viewRef.current.zoom <= 1) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = {
      active: true,
      sx: e.clientX,
      sy: e.clientY,
      ox: viewRef.current.x,
      oy: viewRef.current.y,
    };
    movedRef.current = false;
    setDragging(true);
  };
  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.abs(dx) + Math.abs(dy) > 3) movedRef.current = true;
    const z = viewRef.current.zoom;
    commit({ zoom: z, ...clampXY(d.ox + dx, d.oy + dy, z) });
  };
  const endDrag = () => {
    dragRef.current.active = false;
    setDragging(false);
  };

  const onDoubleClick = (e) => {
    if (viewRef.current.zoom === 1) {
      const { px, py } = pointFromEvent(e);
      zoomTo(2, px, py);
    } else {
      resetZoom();
    }
  };

  const onAreaClick = (e) => {
    e.stopPropagation();
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  const { zoom, x, y } = view;
  const currentEntry = entries[currentIndex];
  const currentImg = getImageUrl(currentEntry) || image;
  const currentEffects = project
    ? resolveImageEffects(project, currentEntry)
    : blurImage
      ? { ...DEFAULT_IMAGE_EFFECTS, enabled: true }
      : null;

  const ctrlBtn =
    'w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center ' +
    'transition-colors duration-150 border border-white/20 cursor-pointer touch-manipulation ' +
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/15';

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center select-none"
      onClick={onClose}
      onContextMenu={(e) => e.preventDefault()}
    >
      <style>{`
        .lightbox-noscroll::-webkit-scrollbar { display: none; }
        .lightbox-noscroll { -ms-overflow-style: none; scrollbar-width: none; }
        .lightbox-noscroll img { -webkit-user-drag: none; user-select: none; }
      `}</style>

      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <p className="text-white text-sm sm:text-base font-semibold truncate max-w-[40%] sm:max-w-[50%] font-inter">
          {title || 'Preview'}
          {entries.length > 1 && (
            <span className="ml-2 text-white/70 font-normal text-xs sm:text-sm">
              ({currentIndex + 1} of {entries.length})
            </span>
          )}
        </p>

        <div
          className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            className={ctrlBtn}
            title="Zoom out (−)"
            aria-label="Zoom out"
          >
            <i className="fa-solid fa-magnifying-glass-minus text-sm"></i>
          </button>

          <button
            type="button"
            onClick={resetZoom}
            disabled={zoom <= MIN_ZOOM}
            className="h-9 sm:h-10 min-w-[3.5rem] px-2 rounded-full bg-black/50 hover:bg-white/20 text-white text-xs font-semibold tabular-nums cursor-pointer touch-manipulation transition-colors duration-150 disabled:cursor-default disabled:hover:bg-black/50"
            title="Reset zoom (0)"
            aria-label="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            className={ctrlBtn}
            title="Zoom in (+)"
            aria-label="Zoom in"
          >
            <i className="fa-solid fa-magnifying-glass-plus text-sm"></i>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="ml-1 sm:ml-2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-red-600 text-white flex items-center justify-center transition-colors duration-150 cursor-pointer touch-manipulation"
            title="Close (Esc)"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center px-4 sm:px-16 py-16 overflow-hidden lightbox-noscroll"
        onClick={onAreaClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default',
          touchAction: 'none',
        }}
      >
        <EffectImage
          ref={imgRef}
          src={currentImg}
          alt={title || 'Enlarged Project View'}
          effects={currentEffects}
          className="max-h-full max-w-full object-contain"
          style={{
            transform: `scale(${zoom}) translate(${x / zoom}px, ${y / zoom}px)`,
            willChange: dragging ? 'transform' : 'auto',
          }}
          onDoubleClick={onDoubleClick}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/slider.png';
          }}
        />
      </div>

      {entries.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full
                       bg-white/15 hover:bg-white/30 text-white
                       flex items-center justify-center transition-colors duration-150 shadow-xl
                       border border-white/20 hover:border-white/40 cursor-pointer touch-manipulation"
            title="Previous (←)"
            aria-label="Previous image"
          >
            <i className="fa-solid fa-chevron-left text-lg sm:text-xl"></i>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full
                       bg-white/15 hover:bg-white/30 text-white
                       flex items-center justify-center transition-colors duration-150 shadow-xl
                       border border-white/20 hover:border-white/40 cursor-pointer touch-manipulation"
            title="Next (→)"
            aria-label="Next image"
          >
            <i className="fa-solid fa-chevron-right text-lg sm:text-xl"></i>
          </button>
        </>
      )}

      {entries.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-20 px-4 sm:px-6 pb-3 sm:pb-4 bg-gradient-to-t from-black/80 to-transparent pt-6 pointer-events-none">
          <div
            className="flex gap-2 overflow-x-auto px-2 py-1 justify-start sm:justify-center lightbox-noscroll pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {entries.map((entry, i) => {
              const entryUrl = getImageUrl(entry);
              const entryEffects = project
                ? resolveImageEffects(project, entry)
                : blurImage
                  ? { ...DEFAULT_IMAGE_EFFECTS, enabled: true }
                  : null;
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-12 w-16 sm:h-14 sm:w-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors duration-150 cursor-pointer touch-manipulation ${
                    currentIndex === i
                      ? 'border-white scale-105 shadow-lg'
                      : 'border-white/30 hover:border-white/60 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Show image ${i + 1}`}
                >
                  <EffectImage
                    src={entryUrl}
                    alt={`Thumb ${i + 1}`}
                    effects={entryEffects}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}