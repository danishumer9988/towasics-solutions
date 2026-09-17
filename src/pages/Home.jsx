import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ContactForm from '../components/ContactForm'
import TestimonialSlider from '../components/TestimonialSlider'
import HomeServicesGrid from '../components/HomeServicesGrid'
import HomeRelatedServices from '../components/HomeRelatedServices'
import HomeBlogs from '../components/HomeBlogs'


// Services list matching the 8 dynamic service page routes
const homeServices = [
  { name: 'Bulk Data Scraping', desc: 'Extract large-scale data from websites quickly and efficiently.', path: '/services/bulk-data-scrapping', icon: 'fa-database' },
  { name: 'Custom Web Scraping Software', desc: 'Get a custom-built web scraper tailored to your business needs.', path: '/services/custom-web-scraping', icon: 'fa-code' },
  { name: 'Web Automation Bots', desc: 'Streamline your workflow with custom web automation bots.', path: '/services/web-automation', icon: 'fa-robot' },
  { name: 'AI-Powered Bots', desc: 'Supercharge your business with intelligent AI automation bots.', path: '/services/ai-powered-bots', icon: 'fa-brain' },
  { name: 'Daily Data Feeds', desc: 'Scheduled delivery of fresh, accurate, ready-to-use daily datasets.', path: '/services/daily-data', icon: 'fa-calendar-day' },
  { name: 'Third-Party API Integration', desc: 'Connect your tools to external APIs for connected workflow.', path: '/services/api-integration', icon: 'fa-network-wired' },
  { name: 'Server Setup for Bots & Scripts', desc: 'Configure cloud hosting for maximum uptime and 24/7 automation.', path: '/services/server-setup', icon: 'fa-server' },
  { name: 'PowerBI Dashboard Design', desc: 'Visualize raw data into clean, interactive charts and KPI reports.', path: '/services/powerbi-design', icon: 'fa-chart-pie' },
]

import Slider from 'react-slick'

// BOT logo base64 inline asset
const botLogoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAABoCAYAAAAdHLWhAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA2WSURBVHgB7Z17bFRVHsfPzLRQHrW0xYK62QokZNcSRSqbgMagIqyrIfvHGqJZSZdtwGWDG4RddINrs7IUEPiD7C5atiHbTW1StKsGbS0VWE1AEHlopS0NbYF2gD6nLbR02pm739+Zc+swdNp5nXNnhvtJpjOdx72/c77n/M7vPO65jEUeC/05derUSk3T+jQ1uBobG/eJ89tGMqqmpmZXUVHRy6+88kr20qVL09gdjKWpqelFt9vNM05TxBDo7+//3J9R+MxO3xN2cdscDkdNXV1dfkFBQZa3/eIRvyAzrqoUx5ucnJwkPzZd9vcbXbTW1tYTBw8efJZFkUBWJgGLxUKZZEgiOzs7E1mQwF7+nJ6ePv+pp546QJrZ7fYvS0pKHhZfoXwyJD0yBLJcu3Ztm8vlotcaU0xKSoqbhYjVah0Wa/r06Y8uX778FMTqPHbs2ArmSYtyoaTUoMzMzHw8fY5mgf5VLlIksHhgcH9T5s+fv49cYEtLy3qmWCgZAlECbAkJCU/bbLaYFolArbIgHYzcHmrVNhLqzJkzL7IfhJJ7fiYH8m+JSNzTeP4vi4OoCLXJSmJBH9ecOXP+g+eOHTt2zBYf25gkZAlEBg+ioX0VNemXLIZrkC8QykY1Cp4hZf369TVobz9ingIpRaRIC0Q1xYpQNxEl7HJGRsYOr/fjChQ8Lggiv2fJ/SE812tT1KaVi40e/SLy006nc1AzgJdeemnSSMaN1g8KF0SsPK0dHR1/FadLYBEiUjWI+h7utra2fyKCOwxbhxITEyNmZLSDtonS6kaIv2lgYOAUXlNkFBGXFwmByLhB1JizqampL8NHa3jcMeJ4YUXbRA3UgyigN7OzsylvwxYpXIHIgCEY5MBzFhnI4n0cawwoghgcHLSdPHnSuXfv3qksTJHCESgBwtAgFiqPMxkuTVqoGWuQe6d2KTc39+o777wzk4WRz6H+0EZtI/O4Nuu4ceOkd9hiDVSkRBphX7169XmINIuFmNeh/IjaFxJnAOIwiGPWHD8gFOc1iUQqLCyczkJwd8EKROJQm9Mlao4pzhjoNWnlypUt77777ngWpEjBCETfHUIYeRrnSzbFCRxRk4ZWrVrVzTzeJ+AoNxiB3OiI/Qsl4iG9F20SOMi3BBRsCzxPI/P0kwLK+0AFsmHMaSn6Ob+lcSiT0KCCjU5tJjr0e/Gv77yV7xQG77IEIpBt7dq1CRhXq2Ae5e/ofk64UAHH+F1udXX1z9gP7REfiWhoaNiN9v0GHr2oEK/iPW0sX0hiuHbv3t0EH+qiaspMwoXydCgrK+s4hLCK5QE30bk9jtfzxXe0tLS0HXV1ddqYNQhK/gna3GeLcd+WlJQ0mZ5pUJMZPP1BQ2Foj1x9fX0n8e9NvP4az494jcRY4Q612bNnbxlNINuGDRsmwrVto7l6o6AVN+KZnkLNWBsyJe2tt96aAzfyD/wf7X1sI6D2CJHwPJSXC3jMw/++mUxCjR/1IAipz5LSmgGgyrsoA1HK6nfu3PnQ1atX/0zv471RpzH8TTf4JJxt2bLlJy0tLVX0G3LfmjG4x/qCv0RYS0tLF3gt8lMG9RcovyDMt3v27LlP2MPda21t7aP0HYg35O/3y5YtS2aBwYV6/vnnJ1y5cuUjcVyjhPKLX8PxmYMyS1OHG30EKhH9VVVVD+oFxcc2W15e3jh8p2cEkdwiQcFGmfwcK1asSMfPz+O4VEujRqgRDa6pqXlOZa2ngkC1taur69+6EKNkKP+st7f3IGUmfusmW+GK3aJ/ESr8uNevX88hm3A8Q2aEfRnRUrzfo6oU6RmBQrFQLyCBZubFixd/BVdox3R22/nz5/8QxO/9wSMotE/pHtOMF+k2Az/44IMnVLU9+rqFffv2TWGhTWzd1vNmkYHbAoGaYaNKN38bt1mG9xpVRDVCHNeiRYsSmMR1ZWHAO+XIiprRghLZeBtkQQM8U1OA7joQQZEw0dwB5gvx4VGajHJ3t1hjt9v3U6OrSURfopSfn5/KFCydjQC8JsFkGo5RLtItloj3ZArkpvYNAcEiFt01x5cEeJfJIgFK3d2wBe+99570jimF062trSUsNlHe/SCGz46hlCq3RIWEaqsUp4vZgVca4KT4W1PE8Ikp8zSJkPaVlZWPsNhod/xhW7du3QQ9SZoC+Fk3bdo0S5MI9fJ7enq+Y/GB5cKFC/mUJk0B/IQnTpx4XXb7s3379pDXhkUZlAarSJZ0kfgZMa51RpZAVNLgt2tZfGGpr6//u+wuCcHPhmenJgkSvqKi4gkWX2sZErOzsxM1BTCaP9Ekw+ILXtDQpn6iYv4oYdasWfczeWidnZ1VLM7AlMQfx48f/wtaN8Akk7BgwYJsJgkUAAvc23YWP9gaGhoWTpo0idJEiySkBz0JDocjDT3kE8yzJDWiJCcnp7/55ptfsvjAtmvXrpQZM2Z8gYI3pOoiNRUNN5WykHf/iBL0iwbcqtcHquiXxLo4xBDandMICtyqF2+aK0UDgHbQQrszlxmAeWVccKjsMtC5Bs2F8AHS39//GcLqxSOsAJUBdfAZRiv+RgLxBvCFF16Yik7r5I6ODiml5J577mFlZWWu4uLiZuaZboh41CgRbi/y5tO0tLSfM4lQ1wQMtbW1FWRkZPyevzkwMNBIvVaZA6Zex25ftWpVIou9OSFvey2SH/o5rKyrq+sTlRNQtEIGBcLOTAJDUzTx5MuaNWsmM5MxMWIvTt7GnTt37iYzGRtNMeTirl27tp+ZBATtIKgstqfhefTEW/DIZLEXyRmCMoFoyRUNk1g82+ry0J6ZjImSkQSUAS5OUVHRVHFOU5xA0eTDo0SE84+zGF4PZxiaArcher6u6lHbA4rhYASF7d///6jzByYDQnpQQIN8dBQ0sSJE2cxk6CRv3O61WpJSkqaKa7YNmtRkCgJs2nxotPprMWkVxYzCQolJZrmUCZMmPDA4cOHaVbSjOSCQFlHla4ah7tzop86kcXHQhIlKGsTIA5tV5zU2dlZxExxAkdTC79GrLq6+jFmBgyBoSlGv4i4tLQ0hZnt0dhoBhBDl+Ebj2YQYiOLoby8vIjc40AC0TE0pRmIvhXMxo0bo83d8QWdZ8+eXdPY2FhYXl7+mHhfvY2awejuDlPgjwuTjAwe+Kqa4uLiVJjUL66g44ENos+PxXfUiqRFARQ4UCZgKrxYmGWESDzjL1269BuyyXd/HlqX7XA4yr2/qwQtenCL7TdvVlRUzFOYEXzhzGuvvZaK81+gFWj+tmIjkTo6Oj5TaFtUCcTRN/fr7e09vXnz5kxhpowGmx9zw4YNk+C+SuncgexqRSLh++pEGsUWfb2cIVtx6fsQ9Pf3f//hhx8uZJGDC/P222/PaG9vr/A6V8DrA0kkzBBXiuPJFcmPDeRutBs3bvyF/2PE7rK6IXA34vSuy5cvlxUUFCykK6xZkFA4/8Ybb2RhFIMun+/mBxRBgBYCqtwdDZZ24ZFM9wcV75Hhlr6+vq133XXX6y0tLRunTZuWLzbdNhI+qKt5FpfTy7bW1tba+vr648is77/55psWu91+AyPnNM43Yfny5Rmw/YH5YMqUKQ9jTmoa86SXH0Y/SDhQIe7p6alKT09fwmQtIzt69OhCUVLdemnt7u7eLD7mokEwuxF7pYWDXull705FOxWjJkl1d5b3338/C6Xtfwgjj1VWVj6qv6+fFO5herAnpkRShUyRvC910EZ4rWNtbm5+4t57762i23Ayc4XObZCDgbv7fOrUqXT/8oi5u6AyGqWkICUlJTcK2qOoRIh0CCItZhESKZiM5rOgAwMD36EW/dS8LefIkEhow4/cfffdT7IILHEOtiZQeEvtkAOGTDZFGhkfdzdSkxEwwY550ZaWtAB+CsShlTrm1QkjgLyxpKamLj506NAyFuaV4aG2JfxeqqhJg+a9VEeGwnzUok8h1HMsDEIdNeZ3e0dNSoQ4bhrDYia+aOg417EwCTca0/ew6USHMNm8x50HKrB0P28xWqG0DfKFag4ZkoZhj2+p186YsfeHMxoajYc4ztWrV49jnlDbkDbIF16T2tra9mBc6mV6rWq7rmiBRhRodxAU1GqM+9ENqiJyFWGkZi75nXUR+/8OfncxiUPXo7I7BKo15M4wh5UXSXFkYaNbzqBANYj9MaLuvnARZHgWGOOZM1lk72EkFR5205V1lAqMPsSdSPqGshhgLvFOcyzB95p55plnxmPi72vqFyi+aaEUxJQM0V5YWDhTpDWmlzHzknXgwIFspK+N3J6B9y0NB5eYGneePn36Re+0xQu8lDU1NT2JRHbod27Uohy9xuDlYGNj4zqRlphpa0KBC0ULQeiqO8qEcNYGyILWHJAueDi++uqrXwvb41oYX3hCc3Nzf3Tx4sUi5MmQaKcofwwRSwjCX9No9DatW7O8bL1j58CGE15SUvIIpt4/Rv7c9M40FYIA2uTpi7KysufEVRe32GbiQ05Ozv1HjhxZ297e/rUuWITFGrh+/fr31dXV23bu3Dmb3X5P1qgg2kvI8EDjkiVLJs2dO/fHeMzFiMW8zMzM2Zh+vz8jIyMdH9PmgHTtqz685GSeuavuvr6+HrjQy83NzbVdXV3Vx48fP1lTU3OhvLy8x/cc0cj/Afm1ZsdK6PctAAAAAElFTkSuQmCC"

// Partner Logos list mapping Saturday image paths in exact layout order
const partnerLogos = [
  { img: "/assets/Saturday 6.png", alt: "Selenium Logo", width: "119px", height: "101px", mt: "20px" },
  { img: "/assets/download.png", alt: "BOT Logo", width: "104px", height: "104px", mt: "20px" },
  { img: "/assets/Saturday 1.png", alt: "Scrapy Logo", width: "200px", height: "91px", mt: "20px" },
  { img: "/assets/Saturday.png", alt: "Sync Logo", width: "150px", height: "111px", mt: "10px" },
  { img: "/assets/Saturday 8.png", alt: "Server Logo", width: "119px", height: "101px", mt: "20px" },
  { img: "/assets/Saturday 5.png", alt: "JSON Logo", width: "214px", height: "101px", mt: "20px" },
  { img: "/assets/slider3-.png", alt: "Logo 7", width: "241px", height: "76px", mt: "40px" },
  { img: "/assets/slider5.png", alt: "Logo 9", width: "286px", height: "105px", mt: "20px" },
  { img: "/assets/slider4.png", alt: "Logo 8", width: "208px", height: "61px", mt: "40px" },
  { img: "/assets/proxy-server-B.png", alt: "Logo 10", width: "104px", height: "104px", mt: "20px" }
]

function PartnerLogos() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 0,
    cssEase: 'linear',
    arrows: false,
    pauseOnHover: false,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } }
    ]
  }

  return (
    <section className="partner-slider-section py-6 overflow-hidden">
      <div className="w-full">
        <Slider {...settings}>
          {partnerLogos.map((logo, idx) => (
            <div key={idx} className="partner-slide-item outline-none">
              <div className="flex items-center justify-center h-[130px] px-6">
                <img
                  src={logo.img}
                  alt={logo.alt}
                  loading="lazy"
                  className="partner-logo-img object-contain mx-auto my-auto"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative custombackgroud min-h-[500px] lg:min-h-[620px] flex items-center py-10 lg:pt-16 lg:pb-0">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mainabove z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-4 sm:space-y-6 text-center lg:text-left animate-fadeInLeft"
            >
              <motion.h1
                style={{ lineHeight: '1.15' }}
                className="font-inter font-bold text-3xl sm:text-4xl md:text-[45px] lg:text-[50px] text-white tracking-normal capitalize mb-4 sm:mb-6 max-w-xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                UNLOCKING THE <br className="hidden sm:inline" /> POWER OF DATA EXTRACTION
              </motion.h1>
              <motion.p
                style={{ lineHeight: '1.25' }}
                className="font-inter font-medium text-base sm:text-lg md:text-[20px] text-white tracking-normal capitalize opacity-95 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Our Company Specializes In Providing Cutting-Edge, Accurate, And Scalable Data Scraping Solutions That Empower Businesses To Unlock The Wealth Of Data Hidden Behind Online Interfaces.
              </motion.p>
              <div className="pt-2 sm:pt-4">
                <Link to="/contactus">
                  <motion.button
                    className="bg-white hover:bg-gray-100 text-[#0a85a7] font-bold px-8 py-3.5 rounded-full text-base sm:text-lg shadow-lg transition-colors font-inter"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Let's Talk
                  </motion.button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="flex justify-center lg:justify-end mt-4 lg:mt-0 relative z-20"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.img
                src="/assets/heroperso.png"
                alt="Data extraction illustration"
                className="heroimage animate-float max-h-[380px] sm:max-h-[480px] lg:max-h-[580px] xl:max-h-[620px] object-contain transform translate-y-6 lg:translate-y-16 -mb-6 lg:-mb-16"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats/Journey Section */}
      <section className="mb-4 bg-gradient-to-r pb-4 pt-4 sm:pt-6 lg:pt-8 mt-[15px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="maintext max-w-2xl mx-auto py-2.5 px-4 sm:px-6 text-white z-20 relative text-center shadow-md bg-gradient-to-r from-[#2cd2e4] via-[#1bbccb] to-[#0ba8bc] -mb-5 border border-white/20 rounded-t-2xl sm:rounded-t-[36px]">
            <h2 className="text-xs sm:text-base md:text-[17px] font-bold leading-snug">
              "A Journey Of 5 Years With 235+ Projects And Long-Term Collaboration With 50+ Clients".
            </h2>
          </div>

          <div className="counterslider p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/20 w-full items-center text-center">
              <div className="inneritem py-3 sm:py-3.5 px-2 h-full flex flex-col justify-center">
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">97%</div>
                <div className="text-white opacity-90 text-xs sm:text-sm font-semibold">Client Satisfaction Rate</div>
              </div>
              <div className="inneritem py-3 sm:py-3.5 px-2 h-full flex flex-col justify-center">
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">0</div>
                <div className="text-white opacity-90 text-xs sm:text-sm font-semibold">Detractors</div>
              </div>
              <div className="inneritem py-3 sm:py-3.5 px-2 h-full flex flex-col justify-center">
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">85</div>
                <div className="text-white opacity-90 text-xs sm:text-sm font-semibold">Net Promoter Score</div>
              </div>
              <div className="inneritem py-3 sm:py-3.5 px-2 h-full flex flex-col justify-center">
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">Avg. 3 Years</div>
                <div className="text-white opacity-90 text-xs sm:text-sm font-semibold">Client Relationship</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PartnerLogos />


      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-20 bg-[#E7F8FF] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }} 
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-extrabold text-[#086B87] text-center capitalize leading-tight font-inter">Why Towasic Solutions?</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pt-6 max-w-5xl mx-auto">
            {[
              {
                title: 'Our Mission',
                img: '/assets/our mission.png',
                text: 'At The Core Of Our Company, We Are Driven By A Mission To Revolutionize The Way Businesses Access And Utilize Data. We Believe That The Power Of Web Scraping Can Unlock Unprecedented Insights, Driving Innovation And Fueling Strategic Decision-Making.'
              },
              {
                title: 'Our Expertise',
                img: '/assets/our experise.png',
                text: 'With A Team Of Seasoned Data Engineers, Web Scraping Specialists, And Software Developers, We Possess A Deep Understanding Of The Latest Techniques And Technologies In The Field. Our Expertise Spans Everything From Custom Scraper Development To Scalable Data Extraction Solutions.'
              },
              {
                title: 'Our Commitment',
                img: '/assets/our comitment.png',
                text: 'We Are Dedicated To Providing Our Clients With Exceptional Service, Tailored Solutions, And A Seamless Experience. Our Commitment To Customer Satisfaction Is At The Heart Of Everything We Do, Ensuring That Our Clients Can Focus On Leveraging The Data They Need To Drive Their Business Forward.'
              }
            ].map((col, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -6 }} 
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center max-w-[340px] mx-auto w-full"
              >
                {/* Floating Icon */}
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-md bg-[#1aa4ac] -mb-10 z-10">
                  <img src={col.img} alt={col.title} className="w-10 h-10 object-contain" />
                </div>
                
                {/* Card Container */}
                <div className="bg-white cardslider p-6 sm:p-8 pt-14 border border-[#35D9E1] shadow-lg hover:shadow-xl transition-shadow w-full flex-grow flex flex-col justify-start">
                  <h3 className="text-xl font-bold mb-3 pt-10" style={{ color: '#0A85A7' }}>{col.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm font-medium">{col.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-brand-600 text-lg font-semibold uppercase tracking-wider">Beyond scraping — we extract meaning</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#086B87] leading-tight">
                Intelligent Web Scraping with AI-Powered Data Enrichment
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our advanced web scraping engine doesn't just collect raw HTML. It integrates AI-powered data enrichment, enabling real-time entity recognition, sentiment analysis, data classification, and even trend forecasting across scraped datasets.
              </p>
              <div className="pt-4">
                <Link 
                  to="/industries"
                  className="bg-[#0a85a7] hover:bg-[#097390] text-white px-8 py-3 rounded-lg font-bold text-base transition inline-flex items-center gap-2"
                >
                  View All Industries
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img src="/assets/webservice.png" alt="Automation Enrichment" className="max-w-[85%] rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>
      </section>
      {/* Services Grid Section */}
      <HomeServicesGrid />

      {/* AI-Powered Section */}
  



      {/* Reviews Slider */}
      <TestimonialSlider />

      {/* Related Services */}
      <HomeRelatedServices />

      {/* Blogs & Articles */}
      <HomeBlogs />

      {/* Contact Form */}
      <ContactForm />

      <Footer />
    </div>
  )
}

