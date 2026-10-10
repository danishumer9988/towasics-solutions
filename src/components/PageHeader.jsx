import React from 'react'

export default function PageHeader({
  title,
  description,
  image,
  imageAlt,
  children,
  imageSize = 'normal',
}) {
  // Wrapper size presets
  const sizeClasses = {
    small:  'max-w-[340px] h-[180px] sm:h-[210px] md:h-[240px] lg:h-[270px]',
    normal: 'max-w-[520px] h-[260px] sm:h-[320px] md:h-[360px] lg:h-[390px]',
    large:  'max-w-[640px] h-[300px] sm:h-[360px] md:h-[400px] lg:h-[440px]',
  }
  const imageWrapperClass = sizeClasses[imageSize] || sizeClasses.normal

  return (
    <div
      className="main-container relative w-full text-white overflow-hidden flex items-center min-h-[420px] sm:min-h-[460px] lg:min-h-[480px]"
      style={{
        backgroundImage: "url('/assets/backimage.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wider uppercase font-inter leading-tight">
              {title}
            </h1>
            {description && (
              <div className="text-white text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 opacity-95 font-inter">
                {description}
              </div>
            )}
            {children}
          </div>

          {image && (
            <div className="lg:col-span-5 flex justify-center lg:justify-end items-center">
              <div className={`w-full ${imageWrapperClass} flex items-center justify-center lg:justify-end`}>
                <img
                  src={image}
                  alt={imageAlt || title || 'Header illustration'}
                  className="max-h-full max-w-full w-auto h-auto object-contain animate-float drop-shadow-xl"
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}