import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { servicesData } from '../data/servicesData'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'

// Map of use case images per service
const useCasesImages = {
  'bulk-data-scrapping': '/assets/bulk-data-scrapping.png',
  'powerbi-design': '/assets/powerbi-design.png',
  'server-setup': '/assets/server-setup.png',
  'api-integration': '/assets/api-integration.png',
  'daily-data': '/assets/daily-data.png',
  'ai-powered-bots': '/assets/ai.png',
  'web-automation': '/assets/newautomation.png',
  'custom-web-scraping': '/assets/customwebscraping.png'
}

// Map of service detail images
const serviceImages = {
  'heroman.png': '/assets/heroman.png',
  'servic.png': '/assets/servic.png',
  'service2.png': '/assets/services2.png',
  'powerbi2.png': '/assets/powerbi2.png',
  'power.png': '/assets/power.png',
  'chooseimage.png': '/assets/chooseimage.png',
  'serversetup.png': '/assets/serveri.png',
  'apiintergrration.png': '/assets/apiintergrration.png',
  'party.png': '/assets/party.png',
  'dailyfeed.png': '/assets/dailyfeed.png',
  'dailydata.png': '/assets/Group 48095444.png',
  'aibots.png': '/assets/aibots.png',
  'bots.png': '/assets/bots.png',
  'automation.png': '/assets/automation.png',
  'webbots.png': '/assets/webbots.png',
  'custom.png': '/assets/custom.png',
  'scrape.png': '/assets/scrape.png'
}

// Map of 3 sample images for section 2 per service
const serviceSection2Images = {
  'bulk-data-scrapping': [
    '/Bulk Data Scrapping/6b4de253e3deea18b71b9666b2adc92e820cdcbc.png',
    '/Bulk Data Scrapping/357d4ca05494db5b33956134ea6d91a3b48fd3c9.png',
    '/Bulk Data Scrapping/7e743b335e5bafc1a758216cbc14aab0807da8ba.png'
  ],
  'powerbi-design': [
    '/Power bi dashboard/5232bf89d9c3cdb4d5547bbec55bae5c420fdf36.png',
    '/Power bi dashboard/be2739eb6df278c52c81c8f6e045b24423ec2a2e.png',
    '/Power bi dashboard/2b7c9e1c9246e361e16c5f8d02278df5f0a99502.png'
  ],
  'server-setup': [
    '/Server setup for bots & script/2764fd61c150d68b6b4ec56e3cadbd904ece3e93.png',
    '/Server setup for bots & script/cfcf192ef6453a004a563d894d4daff513794f84.png',
    '/Server setup for bots & script/a04ba7f44f51104d89a84f582f7402dbe26affd2.png'
  ],
  'api-integration': [
    '/Third-Party API Integration/10b86949cd0a71543d63511b296679de62999838.png',
    '/Third-Party API Integration/b86ba23c7ac5cdbe6496a61d15fffdf7c29e2857.png',
    '/Third-Party API Integration/c6bfdb6e48aeb6feac66d6f434c9b3d4a097fd0f.png'
  ],
  'daily-data': [
    '/Daily data feeds/a0bc2d94bf28e0c88b8e0905e69f0c92a9a3f285.png',
    '/Daily data feeds/48776a6a6134e78db5e890525bc08ed117a01da1.png',
    '/Daily data feeds/6d0310cc3eea0adf96f16f31bb2dea474c6ea898.png'
  ],
  'ai-powered-bots': [
    '/AI-Powered Bots/11fc137234610cb6f0c477f192f4af5cd6d2c38e.png',
    '/AI-Powered Bots/2ec9b22672e9a9a6e13edf07c77b7968994e0513.png',
    '/AI-Powered Bots/beeec8879ca8c2d4d1cd3185ef418203b97aef0f.png'
  ],
  'web-automation': [
    '/web automation bots/e4cc36dc8814716f9c0712efb7e640355443393e.jpg',
    '/web automation bots/c6739d43de8927bc35c15f981abef57db2bc58f1.jpg',
    '/web automation bots/09b73a5eeeaf5d2972acdce939516be3c565dfe3.png'
  ],
  'custom-web-scraping': [
    '/custom web scraping software/cd3acc272dd55af47722657365f2ad72ded42949.png',
    '/custom web scraping software/3a434be320bec179011eba07cc9e1cd7f57f344a.png',
    '/custom web scraping software/dbec73779c93e25721afa049b5defd911641ea39.png'
  ]
}

function ServiceImagesCollage({ serviceName, fallbackImg, onEnlarge }) {
  const images = serviceSection2Images[serviceName]

  if (!images || images.length === 0) {
    return (
      <div 
        onClick={() => onEnlarge && onEnlarge(fallbackImg, [fallbackImg], 0)}
        className="cursor-pointer group relative rounded-2xl overflow-hidden"
      >
        <img src={fallbackImg} alt="Technical Details" className="max-w-[85%] rounded-2xl object-cover" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-[400px] space-y-4">
      {/* Top row: 2 images side by side */}
      <div className="grid grid-cols-2 gap-4">
        {images.slice(0, 2).map((img, i) => (
          <div 
            key={i} 
            onClick={() => onEnlarge && onEnlarge(img, images, i)}
            className="group relative rounded-2xl sm:rounded-3xl overflow-hidden hover:scale-[1.03] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl border border-gray-100 bg-white"
          >
            <img 
              src={img} 
              alt={`Sample ${i + 1}`} 
              className="w-full h-full object-cover rounded-2xl sm:rounded-3xl"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl sm:rounded-3xl">
              <span className="bg-black/75 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-xs">
                <i className="fa-solid fa-magnifying-glass-plus text-xs"></i> Enlarge
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row: 1 wide image */}
      {images[2] && (
        <div 
          onClick={() => onEnlarge && onEnlarge(images[2], images, 2)}
          className="group relative rounded-2xl sm:rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl border border-gray-100 bg-white"
        >
          <img 
            src={images[2]} 
            alt="Sample 3" 
            className="w-full h-auto object-cover rounded-2xl sm:rounded-3xl"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl sm:rounded-3xl">
            <span className="bg-black/75 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-xs">
              <i className="fa-solid fa-magnifying-glass-plus text-xs"></i> Enlarge
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function ServiceImageModal({ isOpen, image, images = [], initialIndex = 0, title = '', onClose }) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex)

  React.useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex, image])

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && images.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % images.length)
      }
      if (e.key === 'ArrowLeft' && images.length > 1) {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, images, onClose])

  if (!isOpen) return null

  const currentImg = images.length > 0 ? images[currentIndex] : image

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close (Cross) Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 sm:-top-5 sm:-right-10 bg-white/20 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all shadow-xl text-xl"
          title="Close (Esc)"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Enlarged Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/40 flex items-center justify-center max-h-[80vh] w-full">
          <img
            src={currentImg}
            alt={title || "Enlarged Service Image"}
            className="max-h-[80vh] max-w-full object-contain"
          />
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-between w-full max-w-2xl px-2 text-white">
          <p className="text-sm sm:text-base font-semibold truncate font-inter text-white/90">
            {title} {images.length > 1 && `(${currentIndex + 1} of ${images.length})`}
          </p>

          {images.length > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5"
              >
                <i className="fa-solid fa-chevron-left text-xs"></i> Prev
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5"
              >
                Next <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BottomLinkSection({ service, serviceName }) {
  const useCaseImg = useCasesImages[serviceName] || '/assets/forservice.png'
  
  const prefixText = service.finalline.prefix || service.finalline.description
  const linkText = service.finalline.linkText || (service.finalline.title ? service.finalline.title.replace(':', '').trim() : '')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h2 
          className="text-[24px] md:text-[36px]"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', color: '#1AA7AD' }}
        >
          Use Cases
        </h2>
      </div>
      <div className="flex justify-center mb-12">
        <img src={useCaseImg} alt="Use Cases" className="max-w-full rounded-xl" style={{ maxHeight: '500px' }} />
      </div>
      
      <div className="text-center my-20">
        <h2 
          className="text-[24px] md:text-[36px] mb-3"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', color: '#1AA7AD' }}
        >
          {service.finalline.title}
        </h2>
        <p 
          className="text-[16px] md:text-[20px]"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', color: '#5A5A5A' }}
        >
          {prefixText}
          <Link 
            to={service.finalline.url} 
            className="hover:opacity-80 transition-opacity ml-1"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: '100%', letterSpacing: '0%', textDecoration: 'underline', textDecorationStyle: 'solid', color: '#1AA7AD' }}
          >
            {linkText}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function ServicePage() {
  const { serviceName } = useParams()
  const service = servicesData[serviceName]

  const [modalState, setModalState] = React.useState({
    isOpen: false,
    image: '',
    images: [],
    initialIndex: 0
  })

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-800">Service not found</h2>
          <Link to="/" className="text-brand-600 hover:underline mt-4 inline-block">Return to Home</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const handleEnlarge = (image, images, initialIndex) => {
    setModalState({
      isOpen: true,
      image,
      images: images && images.length > 0 ? images : [image],
      initialIndex: initialIndex || 0
    })
  }

  const handleCloseModal = () => {
    setModalState({ isOpen: false, image: '', images: [], initialIndex: 0 })
  }

  const heroImgUrl = serviceImages[service.heroImage] || '/assets/heroman.png'
  const section1ImgUrl = serviceImages[service.section1.image] || '/assets/servic.png'
  const section2ImgUrl = serviceImages[service.section2.image] || '/assets/service2.png'
  const whyChooseImgUrl = serviceImages[service.whyChoose.image] || '/assets/chooseimage.png'

  return (
    <div className="min-h-screen bg-white">

      <Navbar />

      {/* Hero Header Section */}
      <PageHeader
        title={service.title}
        description={service.serviceTagline}
        image={heroImgUrl}
        imageAlt={service.title}
      />

      {/* Section 1 - Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p 
                className="text-[18px] md:text-[24px]"
                style={{ fontFamily: "'Inria Serif', serif", fontWeight: 700, lineHeight: '100%', letterSpacing: '0%', color: '#44D9E7' }}
              >
                Towasic Solutions
              </p>
              <h2 
                className="text-[28px] md:text-[40px]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, lineHeight: '100%', letterSpacing: '0%', textTransform: 'capitalize', color: '#086B87' }}
              >
                {service.section1.title}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {service.section1.description}
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 pt-4">
                {service.section1.stats.map((stat, idx) => (
                  <div key={idx} className="border-l-4 border-brand-500 pl-4">
                    <div className="text-3xl font-black text-brand-600 mb-1">{stat.value}</div>
                    <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Link
                  to="/industries"
                  className="bg-[#0a85a7] hover:bg-[#097390] text-white px-6 py-3 rounded-lg hover:shadow-lg transition shadow-md flex items-center gap-2 w-fit font-semibold font-inter"
                >
                  View All Industries
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img src={section1ImgUrl} alt="Overview" className="max-w-[85%] rounded-2xl object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Technical Details */}
      <section className="py-16 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <ServiceImagesCollage 
                serviceName={serviceName} 
                fallbackImg={section2ImgUrl} 
                onEnlarge={handleEnlarge}
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <h2 
                className="text-[24px] md:text-[36px]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, lineHeight: '100%', letterSpacing: '0%', textTransform: 'capitalize', color: '#1AA7AD' }}
              >
                {service.section2.title}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {service.section2.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-service-section text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 
                className="text-[24px] md:text-[36px]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, lineHeight: '100%', letterSpacing: '0%', color: '#61F7FF' }}
              >
                {service.whyChoose.title}
              </h2>
              <div className="space-y-4">
                {service.whyChoose.points.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <span className="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="19" viewBox="0 0 23 19" fill="none"><path d="M2 12.2273C2 12.2273 4.03571 12.2273 6.75 17C6.75 17 14.2944 4.49955 21 2" stroke="#61F7FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </span>
                    <p className="text-gray-300 text-lg font-medium">{point}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Right column kept empty to let the background pattern's loop graphic display cleanly */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Use Cases & Bottom Link Section */}
      <BottomLinkSection service={service} serviceName={serviceName} />

      {/* Service Image Modal */}
      <ServiceImageModal
        isOpen={modalState.isOpen}
        image={modalState.image}
        images={modalState.images}
        initialIndex={modalState.initialIndex}
        title={service.section2.title}
        onClose={handleCloseModal}
      />

      <Footer />
    </div>
  )
}
