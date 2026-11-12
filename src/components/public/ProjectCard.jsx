import { useState } from 'react';
import EffectImage from './EffectImage';
import { getImageUrl, resolveImageEffects } from '../../lib/imageEffects.jsx';

export default function ProjectCard({ project, onEnlarge, onReadMore, variant = 'grid' }) {
  if (variant === 'slider') {
    return <SliderProjectCard project={project} onEnlarge={onEnlarge} onReadMore={onReadMore} />;
  }
  return <GridProjectCard project={project} onEnlarge={onEnlarge} onReadMore={onReadMore} />;
}

/* ---------- Grid variant ---------- */
function GridProjectCard({ project, onReadMore, onEnlarge }) {
  const coverEntry = project.images?.[0];
  const cover = getImageUrl(coverEntry) || '/assets/slider.png';
  const coverEffects = resolveImageEffects(project, coverEntry);

  const handleShare = (e) => {
    e.stopPropagation();
    const shareData = {
      title: project.title,
      text: `Check out this project: ${project.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Project link copied to clipboard!');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-white/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div
        className="relative aspect-[4/3] overflow-hidden bg-gray-100 cursor-pointer group select-none"
        onClick={() =>
          onEnlarge &&
          onEnlarge(
            cover,
            project.images?.length ? project.images : [coverEntry || cover],
            project.title,
            project
          )
        }
        onContextMenu={(e) => e.preventDefault()}
        title="Click to enlarge image"
      >
        <EffectImage
          src={cover}
          alt={project.title}
          effects={coverEffects}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = '/assets/slider.png';
          }}
        />

        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-black/75 text-white text-xs font-semibold px-3.5 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <i className="fa-solid fa-magnifying-glass-plus text-sm"></i> Click to Enlarge
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none flex flex-col items-start">
          {project.projectNumber != null && project.projectNumber !== '' && (
            <span className="inline-flex items-stretch overflow-hidden rounded-t-md bg-[#0a2a33]/90 text-white font-inter">
              <span className="w-1 bg-[#097390]"></span>
              <span className="px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase">
                Project #{project.projectNumber.toString().padStart(2, '0')}
              </span>
            </span>
          )}

          <div className="w-full bg-black/45 backdrop-blur-md px-3 py-2">
            <h3 className="text-white text-sm font-normal leading-snug font-inter text-left max-h-[2.75em] overflow-hidden">
              {project.title}
            </h3>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-3 py-2.5">
        <button
          type="button"
          onClick={() => onReadMore(project)}
          className="inline-flex items-center gap-2 text-[#0a85a7] hover:text-[#097390] font-semibold text-xs transition-all hover:gap-3 cursor-pointer bg-transparent border-0 p-0"
        >
          Read More
          <i className="fa-solid fa-arrow-right text-[10px]"></i>
        </button>

        {/* NEW SHARE BUTTON */}
        <button
          type="button"
          onClick={handleShare}
          className="text-gray-400 hover:text-[#0a85a7] transition-colors p-1"
          title="Share Project"
        >
          <i className="fa-solid fa-share-nodes text-sm"></i>
        </button>
      </div>
    </div>
  );
}

/* ---------- Slider variant ---------- */
function SliderProjectCard({ project, onEnlarge, onReadMore }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const entries = project.images?.length ? project.images : [{ url: '/assets/slider.png', effects: null }];
  const activeEntry = entries[activeIndex] || entries[0];
  const activeImage = getImageUrl(activeEntry) || '/assets/slider.png';
  const activeEffects = resolveImageEffects(project, activeEntry);

  const handleShare = (e) => {
    e.stopPropagation();
    const shareData = {
      title: project.title,
      text: `Check out this project: ${project.title}`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Project link copied to clipboard!');
    }
  };

  return (
    <div className="px-2 flex justify-center w-full">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-8 w-full max-w-5xl border border-white/20 min-h-[400px] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-left">
            <span className="inline-block bg-[#0a85a7] text-white px-4 py-1.5 rounded-full font-bold text-sm tracking-wide shadow-sm font-sans">
              Project #{project.projectNumber?.toString().padStart(2, '0') || '—'}
            </span>

            <h3 className="text-2xl md:text-3xl font-extrabold text-[#086B87] leading-tight font-inter">
              {project.title}
            </h3>

            <p
              className="text-gray-600 leading-relaxed text-sm md:text-base font-medium font-inter"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {project.description}
            </p>

            <div className="flex items-center gap-4 mt-2">
              <button
                type="button"
                onClick={() => onReadMore(project)}
                className="inline-flex items-center gap-2 text-[#0a85a7] hover:text-[#097390] font-semibold text-sm transition-all hover:gap-3 cursor-pointer bg-transparent border-0 p-0"
              >
                Read More
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>

              {/* NEW SHARE BUTTON */}
              <button
                type="button"
                onClick={handleShare}
                className="text-gray-400 hover:text-[#0a85a7] transition-colors p-1"
                title="Share Project"
              >
                <i className="fa-solid fa-share-nodes text-sm"></i>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div
              onClick={() =>
                onEnlarge && onEnlarge(activeImage, entries, project.title, project)
              }
              onContextMenu={(e) => e.preventDefault()}
              className="rounded-2xl overflow-hidden border border-gray-100 aspect-video shadow-md bg-gray-50 flex items-center justify-center cursor-pointer group relative select-none"
              title="Click to enlarge image"
            >
              <EffectImage
                src={activeImage}
                alt={project.title}
                effects={activeEffects}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = '/assets/slider.png';
                }}
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-black/75 text-white text-xs font-semibold px-3.5 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-xs">
                  <i className="fa-solid fa-magnifying-glass-plus text-sm"></i> Click to Enlarge
                </span>
              </div>
            </div>

            {entries.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-1 scrollbar-thin">
                {entries.map((entry, i) => {
                  const entryUrl = getImageUrl(entry);
                  const entryEffects = resolveImageEffects(project, entry);
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      onContextMenu={(e) => e.preventDefault()}
                      className={`h-12 w-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                        activeIndex === i
                          ? 'border-[#0a85a7] scale-105 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <EffectImage
                        src={entryUrl}
                        effects={entryEffects}
                        alt={`Thumb ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}