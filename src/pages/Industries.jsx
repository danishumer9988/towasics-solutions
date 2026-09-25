import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'

export default function Industries() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Header Section */}
      <PageHeader
        title="Industries We Serve"
        description="Our data scraping solutions are designed to empower businesses across diverse industries by providing real-time, structured data for actionable insights. Discover how we can help your industry turn data into growth."
        image="/assets/works.png"
        imageAlt="Industries We Serve"
      />

      {/* Intro Description & First 6 Cards */}
      <motion.section 
        className="bg-white py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-3xl font-bold text-brand-800 mb-4" 
            style={{ color: "#0A85A7", fontSize: "20px" }}
            variants={itemVariants}
          >
            Industries We Serve with Web Scraping Solutions
          </motion.h2>
          <motion.div className="flex justify-center mb-12" variants={itemVariants}>
            <p className="parainor text-gray-600 text-lg leading-relaxed max-w-4xl" style={{ fontSize: "16px" }}>
              At Towasic Solutions, we specialize in delivering tailored web scraping and automation solutions for a variety of industries. From extracting critical data to building custom bots, our services empower businesses to unlock the full potential of data-driven strategies. Explore the range of industries and services we cater to below.
            </p>
          </motion.div>

          {/* Row 1 */}
          <motion.div className="flex flex-wrap justify-center gap-8 mb-12" variants={containerVariants}>
            {/* Card 1 - E-Commerce */}
            <motion.div 
              className="bg-white cardslider2 hover-lift text-center" 
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.3 } }}
            >
              <motion.div className="flex items-center justify-center mx-auto mb-3 mt-1 h-[110px]" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <img src="/assets/ecomerce.png" alt="E-Commerce" className="max-h-[110px] max-w-[140px] w-auto h-auto object-contain" />
              </motion.div>
              <h3 style={{ color: "#0A85A7" }}>E-Commerce</h3>
              <p>
                Get The Best Ecommerce Data Scraping Services For Extracting Competitive Data And Scraping Ecommerce Websites Like Amazon, EBay, Alibaba, Walmart, Target, AliExpress, And Many More.
              </p>
            </motion.div>

            {/* Card 2 - Healthcare */}
            <motion.div 
              className="bg-white cardslider2 hover-lift text-center" 
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.3 } }}
            >
              <motion.div className="flex items-center justify-center mx-auto mb-3 mt-1 h-[110px]" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <img src="/assets/health.png" alt="Healthcare" className="max-h-[110px] max-w-[140px] w-auto h-auto object-contain" />
              </motion.div>
              <h3 style={{ color: "#0A85A7" }}>Healthcare</h3>
              <p>
                We Empower Healthcare Organizations By Providing Data From Medical Research, Drug Pricing, And Clinical Trials. This Information Helps Them Innovate, Improve Efficiency, And Make Well-Informed Decisions For Better Patient Outcomes.
              </p>
            </motion.div>

            {/* Card 3 - Financial */}
            <motion.div 
              className="bg-white cardslider2 hover-lift text-center" 
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.3 } }}
            >
              <motion.div className="flex items-center justify-center mx-auto mb-3 mt-1 h-[110px]" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <img src="/assets/financial.png" alt="Financial" className="max-h-[110px] max-w-[140px] w-auto h-auto object-contain" />
              </motion.div>
              <h3 style={{ color: "#0A85A7" }}>Financial</h3>
              <p>
                Our Solutions Help Financial Corporations Gather Stock Market Trends, Trading Data, And Commodity Prices. With Our Services, Businesses Can Analyze Real-Time Data To Make Strategic Financial Decisions And Stay Ahead Of Market Dynamics.
              </p>
            </motion.div>
          </motion.div>

          {/* Row 2 */}
          <motion.div className="flex flex-wrap justify-center gap-8 mb-16" variants={containerVariants}>
            {/* Card 4 - Hotel & Restaurant */}
            <motion.div 
              className="bg-white cardslider2 hover-lift text-center" 
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.3 } }}
            >
              <motion.div className="flex items-center justify-center mx-auto mb-3 mt-1 h-[110px]" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <img src="/assets/hotel.png" alt="Hotel & Restaurant" className="max-h-[110px] max-w-[140px] w-auto h-auto object-contain" />
              </motion.div>
              <h3 style={{ color: "#0A85A7" }}>Hotel & Restaurant</h3>
              <p>
                We Assist Hotels And Restaurants By Automating The Tracking Of Reviews, Customer Preferences, And Competitor Pricing. This Data Helps Improve Customer Satisfaction, Optimize Pricing, And Streamline Operations.
              </p>
            </motion.div>

            {/* Card 5 - News & Events */}
            <motion.div 
              className="bg-white cardslider2 hover-lift text-center" 
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.3 } }}
            >
              <motion.div className="flex items-center justify-center mx-auto mb-3 mt-1 h-[110px]" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <img src="/assets/evennt.png" alt="News & Events" className="max-h-[110px] max-w-[140px] w-auto h-auto object-contain" />
              </motion.div>
              <h3 style={{ color: "#0A85A7" }}>News & Events</h3>
              <p>
                Our Services Help Organizations Monitor Trending News, Event Schedules, And Public Sentiment. This Enables Timely Decision-Making And Enhances Event Management And Media Coverage Strategies.
              </p>
            </motion.div>

            {/* Card 6 - Social Media */}
            <motion.div 
              className="bg-white cardslider2 hover-lift text-center" 
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.3 } }}
            >
              <motion.div className="flex items-center justify-center mx-auto mb-3 mt-1 h-[110px]" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <img src="/assets/socialmedia.png" alt="Social Media" className="max-h-[110px] max-w-[140px] w-auto h-auto object-contain" />
              </motion.div>
              <h3 style={{ color: "#0A85A7" }}>Social Media</h3>
              <p>
                We Gather Insights From Social Media Platforms, Including Audience Behavior, Trending Hashtags, And Competitor Performance. This Helps Businesses Refine Their Social Strategies And Boost Online Engagement.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 3 - Real Estate & Marketing (bg-brand-50) */}
      <motion.section 
        className="bg-brand-50 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div className="flex justify-center" variants={imageVariants}>
              <motion.div whileHover={{ scale: 1.05, rotate: 2, transition: { duration: 0.3 } }}>
                <img src="/assets/indust.png" alt="webservice" className="animate-float max-h-[460px] lg:max-h-[520px] object-contain transform scale-110 lg:scale-125 origin-center" />
              </motion.div>
            </motion.div>
            <motion.div className="space-y-8 text-left" variants={itemVariants}>
              <motion.div variants={itemVariants}>
                <p className="text-[#086B87] text-lg font-bold mb-4">Real Estate & county data</p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Our tools scrape real estate listings, zoning information, and county records. Automating these processes provides valuable insights for real estate professionals and investors to make informed decisions.
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <p className="text-[#086B87] text-lg font-bold mb-4">Marketing & Advertising</p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Discover trends, campaigns, and strategies shaping the marketing world. Extract actionable insights from advertisements, customer reviews, and social media platforms.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 4 - Legal & Retailer */}
      <motion.section 
        className="bg-white py-16" 
        style={{ paddingTop: "70px" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div className="space-y-8 text-left" variants={itemVariants}>
              <motion.div variants={itemVariants}>
                <p className="text-[#086B87] text-lg font-bold mb-4 uppercase tracking-wide">courts & legal data</p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We provide legal professionals with access to court records, case details, and legal precedents. Automating these data extractions ensures timely and accurate insights for effective case management.
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <p className="text-[#086B87] text-lg font-bold mb-4 uppercase tracking-wide">Global Retailer</p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Global retailers can monitor pricing, inventory, and promotional activities across competitors. Our services automate data collection, enabling you to respond swiftly to market changes and optimize sales strategies.
                </p>
              </motion.div>
            </motion.div>
            <motion.div className="flex justify-center lg:justify-end" variants={imageVariants}>
              <motion.div whileHover={{ scale: 1.05, rotate: 2, transition: { duration: 0.3 } }}>
                <img 
                  src="/assets/main.png" 
                  alt="webservice" 
                  className="animate-float max-h-[460px] lg:max-h-[520px] object-contain transform scale-110 lg:scale-125 origin-center" 
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 5 - Betting & Jobs */}
      <motion.section 
        className="bg-white py-16" 
        style={{ paddingBottom: "70px" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div className="flex justify-center" variants={imageVariants}>
              <motion.div whileHover={{ scale: 1.05, rotate: 2, transition: { duration: 0.3 } }}>
                <img src="/assets/gaming.png" alt="webservice" className="animate-float max-h-[460px] lg:max-h-[520px] object-contain transform scale-110 lg:scale-125 origin-center" />
              </motion.div>
            </motion.div>
            <motion.div className="space-y-8 text-left" variants={itemVariants}>
              <motion.div variants={itemVariants}>
                <p className="text-[#086B87] text-lg font-bold mb-4 uppercase tracking-wide">betting & Gaming</p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Extract real-time odds, game statistics, and player engagement data from leading betting and gaming platforms. Analyze competitor offerings and user preferences for market advantage. Drive decisions with data from this dynamic industry.
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <p className="text-[#086B87] text-lg font-bold mb-4 uppercase tracking-wide">Jobs & education data</p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We help businesses and institutions track job postings, educational trends, and candidate profiles. Automating these processes simplifies recruitment and education planning for better outcomes.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 6 - Agriculture, Lead Gen & Crypto (bg-brand-50) */}
      <motion.section 
        className="bg-brand-50 py-20" 
        style={{ paddingBottom: "10px" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="flex flex-wrap justify-center gap-8 mb-16" variants={containerVariants}>
            {/* Card 1 - Agriculture */}
            <motion.div 
              className="bg-white cardslider2 hover-lift text-center" 
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.3 } }}
            >
              <motion.div className="flex items-center justify-center mx-auto mb-3 mt-1 h-[110px]" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <img src="/assets/storage.png" alt="Agriculture" className="max-h-[110px] max-w-[140px] w-auto h-auto object-contain imagestock" />
              </motion.div>
              <h3 style={{ color: "#0A85A7" }}>Agriculture & Food Industry</h3>
              <p>
                Scrape crop prices, production statistics, and supply chain data to understand market trends. Gather consumer insights on food preferences and emerging products. Leverage data to optimize agricultural and food industry operations.
              </p>
            </motion.div>

            {/* Card 2 - Business Lead Gen */}
            <motion.div 
              className="bg-white cardslider2 hover-lift text-center" 
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.3 } }}
            >
              <motion.div className="flex items-center justify-center mx-auto mb-3 mt-1 h-[110px]" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <img src="/assets/better.png" alt="Lead Generation" className="max-h-[110px] max-w-[140px] w-auto h-auto object-contain imagestock" />
              </motion.div>
              <h3 style={{ color: "#0A85A7" }}>Business Lead Generation</h3>
              <p>
                Automate lead collection by scraping business profiles, contact details, and decision-maker information. Identify potential clients and partners in any industry. Build comprehensive databases for effective outreach and sales.
              </p>
            </motion.div>

            {/* Card 3 - Stock Market & Crypto */}
            <motion.div 
              className="bg-white cardslider2 hover-lift text-center" 
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.3 } }}
            >
              <motion.div className="flex items-center justify-center mx-auto mb-3 mt-1 h-[110px]" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <img src="/assets/works.png" alt="Stock Market" className="max-h-[110px] max-w-[140px] w-auto h-auto object-contain imagestock" />
              </motion.div>
              <h3 style={{ color: "#0A85A7" }}>Stock Market & Crypto</h3>
              <p>
                Track stock prices, cryptocurrency rates, and market sentiment across global platforms. Gather real-time data on financial trends and key market movements. Make informed investment decisions with precise analytics.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 7 - Travel & Blockchain */}
      <motion.section 
        className="bg-white py-16" 
        style={{ marginTop: "70px" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div className="space-y-8 text-left" variants={itemVariants}>
              <motion.div variants={itemVariants}>
                <p className="text-[#086B87] text-lg font-bold mb-4 uppercase tracking-wide">Travel & Hospitality</p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Scrape hotel prices, flight details, and customer reviews from travel booking platforms. Analyze trends in tourism and hospitality to offer better services. Use data to enhance customer experiences and improve marketing strategies.
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <p className="text-[#086B87] text-lg font-bold mb-4 uppercase tracking-wide">blockchain & web3</p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Collect data on blockchain networks, token prices, and smart contract activity. Monitor Web3 projects, trends, and developments in decentralized finance. Stay informed about emerging technologies shaping the future of the internet.
                </p>
              </motion.div>
            </motion.div>
            <motion.div className="flex justify-center lg:justify-end" variants={imageVariants}>
              <motion.div whileHover={{ scale: 1.05, rotate: 2, transition: { duration: 0.3 } }}>
                <img 
                  src="/assets/sectionn1.png" 
                  alt="webservice" 
                  className="animate-float max-h-[350px] object-contain" 
                  style={{ width: "80%" }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 8 - Datasets & LLM Writing */}
      <motion.section 
        className="bg-white py-16 marg"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div className="flex justify-center lg:justify-start" variants={imageVariants}>
              <motion.div whileHover={{ scale: 1.05, rotate: 2, transition: { duration: 0.3 } }}>
                <img 
                  src="/assets/section2.png" 
                  alt="webservice" 
                  className="animate-float max-h-[350px] object-contain" 
                  style={{ width: "80%" }}
                />
              </motion.div>
            </motion.div>
            <motion.div className="space-y-8 text-left" variants={itemVariants}>
              <motion.div variants={itemVariants}>
                <p className="text-[#086B87] text-lg font-bold mb-4 uppercase tracking-wide">Dataset collection</p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Automate the collection of datasets from various industries for machine learning, AI, or analytics. Structure and organize raw data for seamless integration. Deliver high-quality datasets tailored to specific business needs.
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <p className="text-[#086B87] text-lg font-bold mb-4 uppercase tracking-wide">LLM based blogs writing</p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Our advanced web scraping technology captures real-time trends, statistics, and insights from peer-reviewed journals, government databases, and leading media outlets. Leveraging cutting-edge LLMs (Large Language Models), we transform this data into blog posts.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 9 - Maps, Fashion & Dark Web (bg-brand-50) */}
      <motion.section 
        className="bg-brand-50 py-20" 
        style={{ paddingBottom: "10px" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div className="space-y-8 text-left" variants={itemVariants}>
              <motion.div variants={itemVariants}>
                <p className="text-[#086B87] text-lg font-bold mb-4 uppercase tracking-wide">google map scraping</p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Extract valuable location-based data from Google Maps, including business details, reviews, ratings, and contact information. Leverage this data for market research, lead generation, or competitor analysis with precision and efficiency.
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <p className="text-[#086B87] text-lg font-bold mb-4 uppercase tracking-wide">fashion & lifestyle</p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Scrape data on fashion trends, product launches, and lifestyle influencers from top websites. Analyze consumer preferences and market trends for business growth.
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <p className="text-[#086B87] text-lg font-bold mb-4 uppercase tracking-wide">deep & Dark web</p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Collect data securely from deep and dark web platforms for research or cybersecurity purposes. Monitor market trends, threats, and hidden opportunities.
                </p>
              </motion.div>
            </motion.div>
            <motion.div className="flex justify-center" variants={imageVariants}>
              <motion.div whileHover={{ scale: 1.05, rotate: 2, transition: { duration: 0.3 } }}>
                <img 
                  src="/assets/googlemapscraping.png"
                  alt="webservice" 
                  className="animate-float max-h-[400px] object-contain" 
                  style={{ width: "100%" }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 10 - API, Bot, Restful (cards with background #EEFCFD) */}
      <motion.section 
        className="bg-white py-20" 
        style={{ paddingBottom: "10px" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="flex flex-wrap justify-center gap-8 mb-16" variants={containerVariants}>
            {/* Card 1 - API */}
            <motion.div 
              className="cardslider2 hover-lift text-center" 
              style={{ backgroundColor: "#EEFCFD" }}
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.3 } }}
            >
              <motion.div className="flex items-center justify-center mx-auto mb-3 mt-1 h-[110px]" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <img src="/assets/thirdparty.png" alt="API Integration" className="max-h-[110px] max-w-[140px] w-auto h-auto object-contain imagestock" />
              </motion.div>
              <h3 style={{ color: "#0A85A7" }}>Third Party API Integration</h3>
              <p>
                Scrape crop prices, production statistics, and supply chain data to understand market trends. Gather consumer insights on food preferences and emerging products. Leverage data to optimize agricultural and food industry operations.
              </p>
            </motion.div>

            {/* Card 2 - Automation Bot */}
            <motion.div 
              className="cardslider2 hover-lift text-center" 
              style={{ backgroundColor: "#EEFCFD" }}
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.3 } }}
            >
              <motion.div className="flex items-center justify-center mx-auto mb-3 mt-1 h-[110px]" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <img src="/assets/automatedbot.png" alt="Automation Bot" className="max-h-[110px] max-w-[173px] w-auto h-auto object-contain imagestock" />
              </motion.div>
              <h3 style={{ color: "#0A85A7" }}>Automation Bot</h3>
              <p>
                Automate lead collection by scraping business profiles, contact details, and decision-maker information. Identify potential clients and partners in any industry. Build comprehensive databases for effective outreach and sales.
              </p>
            </motion.div>

            {/* Card 3 - Restful API */}
            <motion.div 
              className="cardslider2 hover-lift text-center" 
              style={{ backgroundColor: "#EEFCFD" }}
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.3 } }}
            >
              <motion.div className="flex items-center justify-center mx-auto mb-3 mt-1 h-[110px]" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <img src="/assets/development.png" alt="Restful API" className="max-h-[110px] max-w-[140px] w-auto h-auto object-contain imagestock" />
              </motion.div>
              <h3 style={{ color: "#0A85A7" }}>Restful API Development</h3>
              <p>
                Track stock prices, cryptocurrency rates, and market sentiment across global platforms. Gather real-time data on financial trends and key market movements. Make informed investment decisions with precise analytics.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer CTA Section */}
      <motion.section 
        className="bg-white py-20" 
        style={{ paddingBottom: "10px" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="text-center px-4 max-w-4xl mx-auto">
          <motion.h2 
            className="titlemain2 text-4xl font-bold uppercase mb-4 text-[#086B87]" 
            variants={itemVariants}
          >
            Ready to Transform Your Industry?
          </motion.h2>
          <motion.div className="flex justify-center mb-12" variants={itemVariants}>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl font-medium">
              Our data scraping solutions are tailored to meet the specific needs of your industry, giving you the insights to excel.{' '}
              <Link to="/contactus" className="text-brand-600 font-bold underline hover:text-brand-700 transition">
                Let's Talk
              </Link>{' '}
              to learn how we can empower your business with data-driven strategies!
            </p>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  )
}
