import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Slider from 'react-slick'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import TestimonialSlider from '../components/TestimonialSlider'
import { API_BASE_URL } from '../config'

/* -------------------- Portfolio: Project Detail Modal -------------------- */
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

          {/* Title + full description */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#086B87] mb-4 leading-tight font-inter">
            {project.title}
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line font-medium font-inter">
            {project.description}
          </p>

          {/* External link (if any) */}
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
  );
}

/* -------------------- Portfolio: Compact Project Card -------------------- */
function ProjectCard({ project, onReadMore }) {
  const cover = project.images?.[0] || '/assets/slider.png';
  const hasLink = project.link && project.link.trim().length > 0;

  const handleReadMore = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasLink) {
      window.open(project.link, '_blank', 'noopener,noreferrer');
    } else {
      onReadMore(project);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-white/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Image */}
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

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 text-left">
        <h3
          className="text-lg font-bold text-[#086B87] mb-2 leading-snug font-inter"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.title}
        </h3>
        <p
          className="text-sm text-gray-600 leading-relaxed mb-4 flex-1 font-medium font-inter"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
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
  );
}

/* -------------------- Portfolio: Section (grid) -------------------- */
function PortfolioSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE_URL}/projects`);
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error loading portfolio:', err);
      setError('Unable to load portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

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

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
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
          )}

          {/* Error */}
          {!loading && error && (
            <div className="mt-10 max-w-xl mx-auto text-center bg-white rounded-2xl shadow-md p-8 border border-red-100">
              <i className="fa-solid fa-triangle-exclamation text-red-500 text-3xl mb-3"></i>
              <p className="text-gray-700 font-medium mb-4">{error}</p>
              <button
                onClick={fetchProjects}
                className="bg-[#0a85a7] hover:bg-[#097390] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && projects.length === 0 && (
            <div className="mt-10 max-w-xl mx-auto text-center bg-white rounded-2xl shadow-md p-10 border border-[#e2eff2]">
              <i className="fa-regular fa-folder-open text-[#0a85a7] text-4xl mb-4"></i>
              <h3 className="text-xl font-bold text-[#086B87] mb-2">Portfolio coming soon</h3>
              <p className="text-gray-600 text-sm">
                We're curating our latest projects. Check back shortly to see what we've been building.
              </p>
            </div>
          )}

          {/* Grid of compact cards */}
          {!loading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onReadMore={setSelectedProject}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail modal */}
      <ProjectDetailModal
        isOpen={!!selectedProject}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
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

      {/* Hero Header Section */}
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

          <div className="flex justify-center max-w-5xl mx-auto" style={{ maxWidth: "600px" }}>
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
          {/* Section Header */}
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

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {teamMembers.map((member, idx) => {
              const isLastCentered = idx === 9; // Hassan Basra (10th item)
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-6 border border-[#e2eff2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-5 hover:-translate-y-1 ${
                    isLastCentered ? 'lg:col-start-2' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-32 h-32 sm:w-36 sm:h-36 shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-xs">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
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

      {/* Testimonials Slider */}
      <TestimonialSlider />

      {/* Portfolio Section */}
      <PortfolioSection />

      <Footer />
    </div>
  )
}