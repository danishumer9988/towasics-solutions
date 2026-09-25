import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Slider from 'react-slick'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import TestimonialSlider from '../components/TestimonialSlider'
import { API_BASE_URL } from '../config'

/* -------------------- Image Lightbox (gallery) -------------------- */
function ImageLightboxModal({ isOpen, image, title, images = [], onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images && image) {
      const idx = images.indexOf(image);
      if (idx !== -1) setCurrentIndex(idx);
      else setCurrentIndex(0);
    }
  }, [image, images]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && images.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
      if (e.key === 'ArrowLeft' && images.length > 1) {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, images, onClose]);

  if (!isOpen) return null;

  const currentImg = images.length > 0 ? images[currentIndex] : image;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 sm:-top-5 sm:-right-10 bg-white/20 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all shadow-xl text-xl"
          title="Close (Esc)"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/40 flex items-center justify-center max-h-[80vh] w-full">
          <img
            src={currentImg}
            alt={title || "Enlarged Project View"}
            className="max-h-[80vh] max-w-full object-contain"
            onError={(e) => { e.target.src = '/assets/slider.png' }}
          />
        </div>

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
  );
}

/* -------------------- Project Detail Modal (full title + description) -------------------- */
function ProjectDetailModal({ isOpen, project, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = project?.images?.length ? project.images : ['/assets/slider.png'];

  useEffect(() => {
    if (isOpen) setCurrentIndex(0);
  }, [isOpen, project]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (images.length > 1) {
        if (e.key === 'ArrowRight') setCurrentIndex((p) => (p + 1) % images.length);
        if (e.key === 'ArrowLeft')  setCurrentIndex((p) => (p - 1 + images.length) % images.length);
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, images.length, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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

        {/* Scrollable body */}
        <div className="overflow-y-auto p-5 sm:p-7">
          {/* Main image */}
          <div className="rounded-2xl overflow-hidden bg-gray-50 aspect-video mb-4 flex items-center justify-center">
            <img
              src={images[currentIndex]}
              alt={project.title}
              className="w-full h-full object-contain"
              onError={(e) => { e.target.src = '/assets/slider.png' }}
            />
          </div>

          {/* Thumbnails */}
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

          {/* Full title + description */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#086B87] mb-4 leading-tight font-inter">
            {project.title}
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line font-medium font-inter">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Project Card -------------------- */
function ProjectCard({ project, onEnlarge, onReadMore }) {
  const [activeImage, setActiveImage] = useState(
    project.images && project.images.length > 0 ? project.images[0] : '/assets/slider.png'
  );

  return (
    <div className="px-2 flex justify-center w-full">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-8 w-full max-w-5xl border border-white/20 min-h-[400px] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Details */}
          <div className="space-y-4 text-left">
            <span className="inline-block bg-[#0a85a7] text-white px-4 py-1.5 rounded-full font-bold text-sm tracking-wide shadow-sm font-sans">
              Project #{project.projectNumber?.toString().padStart(2, '0') || '—'}
            </span>

            <h3 className="text-2xl md:text-3xl font-extrabold text-[#086B87] leading-tight font-inter">
              {project.title}
            </h3>

            {/* 2-line clamped description */}
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

            {/* Read More button */}
            <button
              type="button"
              onClick={() => onReadMore(project)}
              className="inline-flex items-center gap-2 text-[#0a85a7] hover:text-[#097390] font-semibold text-sm transition-all hover:gap-3 cursor-pointer bg-transparent border-0 p-0 mt-2"
            >
              Read More
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>

          {/* Images */}
          <div className="flex flex-col gap-4">
            <div
              onClick={() => onEnlarge && onEnlarge(activeImage, project.images, project.title)}
              className="rounded-2xl overflow-hidden border border-gray-100 aspect-video shadow-md bg-gray-50 flex items-center justify-center cursor-pointer group relative"
              title="Click to enlarge image"
            >
              <img
                src={activeImage}
                alt={project.title}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                onError={(e) => { e.target.src = '/assets/slider.png' }}
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-black/75 text-white text-xs font-semibold px-3.5 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-xs">
                  <i className="fa-solid fa-magnifying-glass-plus text-sm"></i> Click to Enlarge
                </span>
              </div>
            </div>

            {project.images && project.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-1 scrollbar-thin">
                {project.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`h-12 w-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImage === img ? 'border-[#0a85a7] scale-105 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Portfolio Section -------------------- */
function PortfolioSlider() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({ isOpen: false, image: '', images: [], title: '' });
  const [detailProject, setDetailProject] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/projects`);
        setProjects(res.data);
      } catch (err) {
        console.error('Error loading portfolio projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleEnlargeImage = (image, images, title) => {
    setModalState({
      isOpen: true,
      image,
      images: images && images.length > 0 ? images : [image],
      title
    });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, image: '', images: [], title: '' });
  };

  if (loading) {
    return (
      <section className="py-20 bg-[#35d9e1]/70">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-800 font-bold text-lg">
          Loading portfolio...
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  const displayProjects = projects;

  const settings = {
    infinite: displayProjects.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    autoplay: false,
    arrows: false,
    centerMode: false,
    initialSlide: 0
  };

  return (
    <>
      <section className="py-20 bg-[#35d9e1]/75 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#086B87] tracking-wider">PORTFOLIO</h2>
            <div className="flex justify-center mt-3">
              <p className="text-gray-700 text-lg font-medium max-w-3xl">
                Every successful outcome begins with a clear, focused, and well-structured process that lays the foundation for achieving goals with precision and confidence
              </p>
            </div>
          </div>

          <div className="relative mt-12 px-4 md:px-12">
            {displayProjects.length > 1 && (
              <>
                <button
                  onClick={() => sliderRef.current?.slickPrev()}
                  className="absolute left-0 md:left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 h-12 w-12 rounded-full flex items-center justify-center shadow-lg border border-gray-200 transition-all z-10 active:scale-95"
                  title="Previous Project"
                >
                  <i className="fa-solid fa-chevron-left text-lg"></i>
                </button>

                <button
                  onClick={() => sliderRef.current?.slickNext()}
                  className="absolute right-0 md:right-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 h-12 w-12 rounded-full flex items-center justify-center shadow-lg border border-gray-200 transition-all z-10 active:scale-95"
                  title="Next Project"
                >
                  <i className="fa-solid fa-chevron-right text-lg"></i>
                </button>
              </>
            )}

            <div className="slider-container mt-10">
              <Slider ref={sliderRef} {...settings} className="testimonial-slider">
                {displayProjects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onEnlarge={handleEnlargeImage}
                    onReadMore={setDetailProject}
                  />
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </section>

      {/* Image Lightbox */}
      <ImageLightboxModal
        isOpen={modalState.isOpen}
        image={modalState.image}
        images={modalState.images}
        title={modalState.title}
        onClose={handleCloseModal}
      />

      {/* Project Detail Modal (Read More) */}
      <ProjectDetailModal
        isOpen={!!detailProject}
        project={detailProject}
        onClose={() => setDetailProject(null)}
      />
    </>
  );
}

const teamMembers = [
  {
    name: "Bilal Ahmed",
    image: "/team/Team Avatar.png",
    skills: [
      "AI Engineering & IoT",
      "Robotics & Simulation",
      "ROS & ROS 2"
    ]
  },
  {
    name: "Azmat Hussain",
    image: "/team/Team Avatar (1).png",
    skills: [
      "AI Product Strategy & Architecture",
      "Embedded Systems & Robotics",
      "Sensor Fusion & Edge AI",
      "Autonomous Systems"
    ]
  },
  {
    name: "Noor Gohar",
    image: "/team/Team Avatar (2).png",
    skills: [
      "Linux Administration",
      "Azure Cloud",
      "Digital Ocean",
      "Docker & Containerization"
    ]
  },
  {
    name: "Haris Ahmed",
    image: "/team/Frame 1000004271.png",
    skills: [
      "Python Automation & Bots",
      "CRM Integration & Automation",
      "Web Automation",
      "Data Engineering"
    ]
  },
  {
    name: "Saad Afzal",
    image: "/team/Team Avatar (3).png",
    skills: [
      "Full-Stack Web Development",
      "Shopify & WordPress Development",
      "React, Next.js & React Native",
      "Node.js & Backend Development",
      "Web Application Hosting"
    ]
  },
  {
    name: "Ali Ijaz",
    image: "/team/Team Avatar (4).png",
    skills: [
      "Digital Marketing",
      "Advertising & Campaign Management",
      "B2B & B2C Lead Generation",
      "Marketing Analytics & Growth"
    ]
  },
  {
    name: "Tahir Abbas",
    image: "/team/Frame 1000004271 (1).png",
    skills: [
      "RAG & LLM Application Development",
      "AI Agents & Agentic Systems",
      "Computer Vision",
      "Python & Node.js Backend"
    ]
  },
  {
    name: "Mudassar Hayat",
    image: "/team/Frame 1000004271 (2).png",
    skills: [
      "Generative AI & Agentic Systems",
      "RAG & LLM Fine-Tuning",
      "Machine Learning & Deep Learning",
      "Computer Vision & NLP",
      "Cloud & MLOps"
    ]
  },
  {
    name: "Ahsan Rajpoot",
    image: "/team/Frame 1000004271 (2).png",
    skills: [
      "Data Engineering & Analytics",
      "Data Quality & Migration",
      "Google Cloud & Data Stack",
      "Oracle Applications & Power BI"
    ]
  },
  {
    name: "Hassan Basra",
    image: "/team/Frame 1000004271 (2).png",
    skills: [
      "Generative AI & LLM Applications",
      "Agentic AI & Autonomous Systems",
      "Conversational AI & Intelligent Chatbots",
      "LLM Training, Fine-Tuning & Optimization",
      "AI-Powered Automation & Intelligent Solutions"
    ]
  }
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <PageHeader
        title="About Us"
        description="Turning complex ideas into powerful, real-world results"
        image="/assets/abutus.png"
        imageAlt="About Us"
      />

      {/* Leadership Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight font-inter mb-6">
              Leadership Team
            </h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium font-inter">
              At Towasic Solutions, We Are A Team Of Experienced Developers Specializing In Web Scraping, Automation, AI Agents, Machine Learning, Website Development, IoT Projects, And Full-Stack Development. With Over 5 Years Of Expertise And 235+ Successful Projects Delivered, We Pride Ourselves On Building Intelligent, Reliable, And Efficient Solutions For Clients Worldwide.
            </p>
          </div>

          <div className="flex justify-center max-w-5xl mx-auto" style={{maxWidth:"600px"}}>
            <img
              src="/team/Group 48095451.png"
              alt="Leadership Team"
              className="w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 object-contain"
            />
          </div>
        </div>
      </section>

      {/* Meet Our Experts Section */}
      <section className="py-24 bg-[#f4fbfc] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#086B87] font-bold text-sm sm:text-base tracking-widest uppercase mb-2 inline-block font-sans">
              OUR TEAM
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight font-inter mb-4">
              Meet Our Experts
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto font-medium font-inter leading-relaxed">
              A talented team of developers, engineers, designers, and strategists working together to build intelligent solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {teamMembers.map((member, idx) => {
              const isLastCentered = idx === 9;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-6 border border-[#e2eff2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-5 hover:-translate-y-1 ${
                    isLastCentered ? 'lg:col-start-2' : ''
                  }`}
                >
                  <div className="w-32 h-32 sm:w-36 sm:h-36 shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-xs">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                      {member.name}
                    </h3>
                    <ul className="space-y-1.5">
                      {member.skills.map((skill, sIdx) => (
                        <li
                          key={sIdx}
                          className="text-xs sm:text-[13px] text-gray-600 flex items-start gap-2 leading-relaxed"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0"></span>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Block */}
      <section className="py-12 bg-gradient-to-r from-brand-600 to-brand-800 text-white shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-extrabold mb-1">20+</div>
              <div className="text-white/90 text-sm font-semibold uppercase tracking-wider">Tech Experts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold mb-1">235+</div>
              <div className="text-white/90 text-sm font-semibold uppercase tracking-wider">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold mb-1">97%</div>
              <div className="text-white/90 text-sm font-semibold uppercase tracking-wider">Client satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold mb-1">03</div>
              <div className="text-white/90 text-sm font-semibold uppercase tracking-wider">Global Offices</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-brand-600 text-lg font-semibold uppercase tracking-wider mb-2">
              Why Choose Us?
            </h2>
            <p className="text-4xl font-bold text-brand-800">
              Our Core Values
            </p>
          </div>
          <div className="flex justify-center mt-12">
            <img
              src="/assets/aboutsec.png"
              alt="Core Values infographics"
              className="w-full max-w-4xl rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Partners/CDL Tech Testimonial Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-brand-600 text-lg font-semibold uppercase tracking-wider mb-2">
              Testimonials
            </h2>
            <p className="text-4xl font-bold text-brand-800">
              Trusted by Industry Leaders
            </p>
          </div>
          <div className="flex justify-center mt-12">
            <img
              src="/team/Group 48095430.png"
              alt="CDL Tech Review"
              className="w-full max-w-3xl rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>

      <TestimonialSlider />
      <PortfolioSlider />
      <Footer />
    </div>
  )
}