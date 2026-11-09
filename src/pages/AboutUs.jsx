import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Slider from 'react-slick'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import TestimonialSlider from '../components/TestimonialSlider'
import SEO from '../components/SEO'
import ProjectImageLightbox from '../components/public/ProjectImageLightbox'
import ProjectDetailModal from '../components/public/ProjectDetailModal'
import ProjectCard from '../components/public/ProjectCard'
import { API_BASE_URL } from '../config'

/* -------------------- Animated Counter -------------------- */
function AnimatedCounter({
  start,
  end,
  duration = 1800,
  suffix = '',
  pad = 0,
  className = '',
  ariaLabel,
}) {
  const [count, setCount] = useState(start)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setCount(end)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true

            const startTime = performance.now()
            const range = Math.abs(end - start)
            const direction = end >= start ? 1 : -1

            const animate = (now) => {
              const elapsed = now - startTime
              const progress = Math.min(elapsed / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              const current = Math.round(start + direction * range * eased)
              setCount(current)

              if (progress < 1) {
                requestAnimationFrame(animate)
              } else {
                setCount(end)
              }
            }

            requestAnimationFrame(animate)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [start, end, duration])

  const display = pad > 0 ? String(count).padStart(pad, '0') : String(count)

  return (
    <span ref={ref} className={className} aria-label={ariaLabel}>
      {display}
      {suffix}
    </span>
  )
}

/* -------------------- Portfolio Section (About Page) — Featured Only -------------------- */
function PortfolioSlider() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalState, setModalState] = useState({
    isOpen: false,
    image: '',
    images: [],
    title: '',
    project: null,       // NEW
    blurImage: false,
  })
  const [detailProject, setDetailProject] = useState(null)
  const sliderRef = useRef(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/projects?featured=true&active=true`)
        const all = Array.isArray(res.data) ? res.data : []
        setProjects(all)
      } catch (err) {
        console.error('Error loading featured projects:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  /* NEW: 4th arg is now `project` (was blurImage) */
  const handleEnlargeImage = (image, images, title, project = null) => {
    setModalState({
      isOpen: true,
      image,
      images: images && images.length > 0 ? images : [image],
      title,
      project,
      blurImage: false,
    })
  }

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      image: '',
      images: [],
      title: '',
      project: null,
      blurImage: false,
    })
  }

  if (loading) {
    return (
      <section className="py-20 bg-[#35d9e1]/70">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-800 font-bold text-lg">
          Loading portfolio...
        </div>
      </section>
    )
  }

  if (projects.length === 0) return null

  const displayProjects = projects

  const settings = {
    infinite: displayProjects.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    autoplay: false,
    arrows: false,
    centerMode: false,
    initialSlide: 0,
  }

  return (
    <>
      <section className="py-20 bg-[#35d9e1]/75 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#086B87] tracking-wider">PORTFOLIO</h2>
            <div className="flex justify-center mt-3">
              <p className="text-gray-700 text-lg font-medium max-w-3xl">
                Every successful outcome begins with a clear, focused, and well-structured process that lays the foundation for achieving goals with precision and confidence.
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
                    variant="slider"
                  />
                ))}
              </Slider>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-3 bg-[#0a85a7] hover:bg-[#097390] text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md"
            >
              View More
              <i className="fa-solid fa-arrow-right text-sm"></i>
            </Link>
          </div>
        </div>
      </section>

      <ProjectImageLightbox
        isOpen={modalState.isOpen}
        image={modalState.image}
        images={modalState.images}
        title={modalState.title}
        project={modalState.project}
        blurImage={modalState.blurImage}
        onClose={handleCloseModal}
      />

      <ProjectDetailModal
        isOpen={!!detailProject}
        project={detailProject}
        onClose={() => setDetailProject(null)}
        onEnlarge={handleEnlargeImage}
      />
    </>
  )
}

const teamMembers = [
  { name: "Bilal Ahmed", image: "/team/Team Avatar.png", skills: ["AI Engineering & IoT", "Robotics & Simulation", "ROS & ROS 2"] },
  { name: "Azmat Hussain", image: "/team/Team Avatar (1).png", skills: ["AI Product Strategy & Architecture", "Embedded Systems & Robotics", "Sensor Fusion & Edge AI", "Autonomous Systems"] },
  { name: "Noor Gohar", image: "/team/Team Avatar (2).png", skills: ["Linux Administration", "Azure Cloud", "Digital Ocean", "Docker & Containerization"] },
  { name: "Haris Ahmed", image: "/team/Frame 1000004271.png", skills: ["Python Automation & Bots", "CRM Integration & Automation", "Web Automation", "Data Engineering"] },
  { name: "Saad Afzal", image: "/team/Team Avatar (3).png", skills: ["Full-Stack Web Development", "Shopify & WordPress Development", "React, Next.js & React Native", "Node.js & Backend Development", "Web Application Hosting"] },
  { name: "Ali Ijaz", image: "/team/Team Avatar (4).png", skills: ["Digital Marketing", "Advertising & Campaign Management", "B2B & B2C Lead Generation", "Marketing Analytics & Growth"] },
  { name: "Tahir Abbas", image: "/team/Frame 1000004271 (1).png", skills: ["RAG & LLM Application Development", "AI Agents & Agentic Systems", "Computer Vision", "Python & Node.js Backend"] },
  { name: "Danish Umer", image: "/team/danish.png", skills: ["Full-Stack Web Development", " Django & Flask Framework", "Python, React, Next.js & Node.js Technology", "Android & IOS Development "] },
  { name: "Mudassar Hayat", image: "/team/Frame 1000004271 (2).png", skills: ["Generative AI & Agentic Systems", "RAG & LLM Fine-Tuning", "Machine Learning & Deep Learning", "Computer Vision & NLP", "Cloud & MLOps"] },
  { name: "Ahsan Rajpoot", image: "/team/Frame 1000004271 (2).png", skills: ["Data Engineering & Analytics", "Data Quality & Migration", "Google Cloud & Data Stack", "Oracle Applications & Power BI"] },
  { name: "Hassan Basra", image: "/team/Frame 1000004271 (2).png", skills: ["Generative AI & LLM Applications", "Agentic AI & Autonomous Systems", "Conversational AI & Intelligent Chatbots", "LLM Training, Fine-Tuning & Optimization", "AI-Powered Automation & Intelligent Solutions"] },
]

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="About Us — Data Scraping, Automation & Super Intelligence Team"
        description="Meet the team behind 235+ delivered projects in data scraping, intelligent automation, and super intelligence. 20+ specialists across Texas, Doha, and Lahore."
        path="/aboutus"
        image="/assets/og-image.jpg"
      />
      <Navbar />

      <PageHeader
        title="About Us"
        description="We bring the engineering for startups, so you can launch fast and scale smart."
        image="/assets/abutus.png"
        imageAlt="About Us"
      />

      {/* Leadership Team Section */}
      <section className="pt-8 sm:pt-10 pb-0 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#086B87] tracking-tight font-inter mb-6">
              Leadership Team
            </h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium font-inter">
              At Towasic Solutions, we are a team of experienced developers specializing in web scraping, automation bots, AI-powered agents, IoT, and full-stack development. With over 5 years of expertise and 235+ successful projects delivered, we pride ourselves on building intelligent, reliable, and efficient solutions for clients worldwide.
            </p>
          </div>

          <div className="flex justify-center max-w-3xl mx-auto" style={{maxWidth:"700px"}}>
            <img
              src="/team/Group 4809545190.png"
              alt="Leadership Team"
              className="w-full max-w-10xl rounded-20xl sm:rounded-30xl shadow-xl hover:shadow-20xl transition-all duration-300 object-contain"
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#086B87] tracking-tight font-inter mb-4">
              Meet Our Technology Experts
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto font-medium font-inter leading-relaxed">
              A talented team of developers, engineers, designers, and strategists working together to build intelligent solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-[#e2eff2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-5 hover:-translate-y-1"
              >
                <div className="w-32 h-32 sm:w-36 sm:h-36 shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-xs">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{member.name}</h3>
                  <ul className="space-y-1.5">
                    {member.skills.map((skill, sIdx) => (
                      <li key={sIdx} className="text-xs sm:text-[13px] text-gray-600 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0"></span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Block */}
      <section className="py-12 bg-gradient-to-r from-brand-600 to-brand-800 text-white shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <AnimatedCounter start={1} end={20} suffix="+" duration={1800} className="block text-4xl font-extrabold mb-1" ariaLabel="Over 20 tech experts" />
              <div className="text-white/90 text-sm font-semibold uppercase tracking-wider">Tech Experts</div>
            </div>
            <div className="text-center">
              <AnimatedCounter start={1} end={235} suffix="+" duration={1800} className="block text-4xl font-extrabold mb-1" ariaLabel="Over 235 projects completed" />
              <div className="text-white/90 text-sm font-semibold uppercase tracking-wider">Projects Completed</div>
            </div>
            <div className="text-center">
              <AnimatedCounter start={1} end={97} suffix="%" duration={1800} className="block text-4xl font-extrabold mb-1" ariaLabel="97 percent client satisfaction" />
              <div className="text-white/90 text-sm font-semibold uppercase tracking-wider">Client satisfaction</div>
            </div>
            <div className="text-center">
              <AnimatedCounter start={1} end={3} pad={2} duration={1800} className="block text-4xl font-extrabold mb-1" ariaLabel="Three team locations" />
              <div className="text-white/90 text-sm font-semibold uppercase tracking-wider">Team Locations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-brand-600 text-lg font-semibold uppercase tracking-wider mb-2">Why Choose Us?</h2>
            <p className="text-4xl font-bold text-brand-800">Our Core Values</p>
          </div>
          <div className="flex justify-center mt-12">
            <img src="/assets/aboutsec.png" alt="Core Values infographics" className="w-full max-w-5xl rounded-2xl shadow-xl" />
          </div>
        </div>
      </section>

      {/* Partners/CDL Tech Testimonial Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-brand-600 text-lg font-semibold uppercase tracking-wider mb-2">Testimonials</h2>
            <p className="text-4xl font-bold text-brand-800">Trusted by Industry Leaders</p>
          </div>
          <div className="flex justify-center mt-12">
            <img src="/team/Group 48095430.png" alt="CDL Tech Review" className="w-full max-w-3xl rounded-2xl shadow-xl" />
          </div>
        </div>
      </section>

      <TestimonialSlider />
      <PortfolioSlider />
      <Footer />
    </div>
  )
}