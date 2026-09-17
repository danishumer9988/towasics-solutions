import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white font-inter">
      <Navbar />

      {/* Main Top Hero Banner */}
      <PageHeader
        title="Privacy Policies"
        description="Our Privacy Policy Outlines How We Collect, Use, And Protect Your Personal Information. We Are Committed To Ensuring Your Data Remains Safe And Confidential, And We Only Use It To Improve Your Experience With Our Services."
        image="/assets/privacypolicy.png"
        imageAlt="Privacy Policy Illustration"
      />

      {/* Main Body Section with Light Cyan Background (#EFFBFC) Matching PDF */}
      <div className="bg-[#EFFBFC] w-full py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-[#0F172A] leading-relaxed">
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D1527] mb-2 tracking-tight">Privacy Policies</h2>
          <p className="text-base font-semibold mb-8 text-slate-700">
            <span className="text-[#3B82F6] font-bold">Effective Date:</span> <span className="font-bold text-[#0D1527]">01 September 2025</span>
          </p>

          {/* 1. Introduction */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">1. Introduction</h3>
            <p className="text-slate-700 font-medium text-base sm:text-[17px]">
              Welcome to <strong>Towasic Solutions</strong>. We are committed to protecting your privacy and ensuring that your personal and project-related information is handled securely and responsibly. This Privacy Policy explains how we collect, use, store, and protect information when you visit our website or use our services, including web scraping, automation bots, AI-powered tools, dashboards, and API integrations.
            </p>
            <p className="text-slate-700 font-medium text-base sm:text-[17px]">
              By accessing or using our website or services, you agree to the practices described in this Privacy Policy.
            </p>
          </div>

          {/* 2. Information We Collect */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">2. Information We Collect</h3>
            
            <div>
              <h4 className="text-base sm:text-lg font-bold text-[#0D1527] mt-3 mb-1">a. Personal Information (Provided by You)</h4>
              <p className="text-slate-700 font-medium text-base sm:text-[17px] mb-2">When you contact us, request a quote, or place an order, we may collect:</p>
              <div className="pl-4 space-y-1 text-slate-700 font-medium text-base sm:text-[17px]">
                <p>· Full name</p>
                <p>· Email address</p>
                <p>· Phone number</p>
                <p>· Company name</p>
                <p>· Billing and payment details</p>
                <p>· Other information you choose to provide</p>
              </div>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-bold text-[#0D1527] mt-4 mb-1">b. Technical Data (Automatically Collected)</h4>
              <p className="text-slate-700 font-medium text-base sm:text-[17px] mb-2">When you interact with our website, we may automatically collect:</p>
              <div className="pl-4 space-y-1 text-slate-700 font-medium text-base sm:text-[17px]">
                <p>· IP address</p>
                <p>· Browser type and version</p>
                <p>· Operating system</p>
                <p>· Referring pages</p>
                <p>· Date and time of access</p>
              </div>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-bold text-[#0D1527] mt-4 mb-1">c. Usage Information</h4>
              <p className="text-slate-700 font-medium text-base sm:text-[17px] mb-2">We may track:</p>
              <div className="pl-4 space-y-1 text-slate-700 font-medium text-base sm:text-[17px]">
                <p>· Pages visited</p>
                <p>· Features used</p>
                <p>· Time spent on site</p>
                <p>· Downloads or inquiries</p>
              </div>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-bold text-[#0D1527] mt-4 mb-1">d. Client-Provided Access Data</h4>
              <p className="text-slate-700 font-medium text-base sm:text-[17px]">
                If required for a project, you may provide login credentials, API keys, or other access details. These are stored securely, used only for the intended project, and deleted upon completion unless otherwise agreed.
              </p>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-bold text-[#0D1527] mt-4 mb-1">e. Scraped or Automated Data</h4>
              <p className="text-slate-700 font-medium text-base sm:text-[17px]">
                If our services involve collecting data from third-party websites, we may temporarily process such data for delivery to you. We do not retain this data beyond the agreed retention period.
              </p>
            </div>
          </div>

          {/* 3. How We Use Your Information */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">3. How We Use Your Information</h3>
            <p className="text-slate-700 font-medium text-base sm:text-[17px] mb-2">We may use the collected information to:</p>
            <div className="pl-4 space-y-1 text-slate-700 font-medium text-base sm:text-[17px]">
              <p>· Deliver and improve our services</p>
              <p>· Communicate about your projects</p>
              <p>· Process payments and provide invoices</p>
              <p>· Send service updates or promotional content (with opt-out option)</p>
              <p>· Detect and prevent unauthorized or fraudulent activity</p>
              <p>· Ensure compliance with applicable laws and contractual obligations</p>
            </div>
          </div>

          {/* 4. Data Sharing and Disclosure */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">4. Data Sharing and Disclosure</h3>
            <p className="text-slate-700 font-medium text-base sm:text-[17px] mb-2">We do not sell or rent personal information. We may share data with:</p>
            <div className="pl-4 space-y-1.5 text-slate-700 font-medium text-base sm:text-[17px]">
              <p>· <strong>Service providers</strong> (e.g., hosting, analytics, payment processors)</p>
              <p>· <strong>Project contractors</strong> when necessary to fulfill your order (e.g., developers working on your custom bot)</p>
              <p>· <strong>Legal authorities</strong> when required by law or to protect our rights</p>
              <p>· <strong>Third-party APIs or AI tools</strong> if required for your project (you will be informed in advance)</p>
            </div>
          </div>

          {/* 5. Cookies and Tracking */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">5. Cookies and Tracking</h3>
            <p className="text-slate-700 font-medium text-base sm:text-[17px] mb-2">We use cookies and similar technologies to:</p>
            <div className="pl-4 space-y-1 text-slate-700 font-medium text-base sm:text-[17px] mb-3">
              <p>· Improve site performance</p>
              <p>· Save your preferences</p>
              <p>· Analyze website usage patterns</p>
            </div>
            <p className="text-slate-700 font-medium text-base sm:text-[17px]">
              You can adjust cookie preferences in your browser settings.
            </p>
          </div>

          {/* 6. Data Security */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">6. Data Security</h3>
            <p className="text-slate-700 font-medium text-base sm:text-[17px]">
              We implement encryption, access controls, and firewalls to protect your data. However, no online method is 100% secure, and we cannot guarantee absolute protection against breaches.
            </p>
          </div>

          {/* 7. Your Rights */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">7. Your Rights</h3>
            <p className="text-slate-700 font-medium text-base sm:text-[17px] mb-2">Depending on your location, you may have rights to:</p>
            <div className="pl-4 space-y-1 text-slate-700 font-medium text-base sm:text-[17px] mb-3">
              <p>· Access, correct, or delete your data</p>
              <p>· Restrict or object to processing</p>
              <p>· Withdraw consent</p>
              <p>· File a complaint with a data protection authority</p>
            </div>
            <p className="text-slate-700 font-medium text-base sm:text-[17px]">
              Contact <a href="mailto:info@towasicsolutions.com" className="text-[#3B82F6] hover:underline font-semibold">info@towasicsolutions.com</a> to exercise these rights.
            </p>
          </div>

          {/* 8. Data Retention */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">8. Data Retention</h3>
            <p className="text-slate-700 font-medium text-base sm:text-[17px]">
              We retain personal and project-related data only for as long as necessary to fulfill the service or as required by law. Project credentials are deleted after completion unless agreed otherwise.
            </p>
          </div>

          {/* 9. Third-Party Links */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">9. Third-Party Links</h3>
            <p className="text-slate-700 font-medium text-base sm:text-[17px]">
              Our website may link to other websites. We are not responsible for their privacy practices.
            </p>
          </div>

          {/* 10. Children's Privacy */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">10. Children's Privacy</h3>
            <p className="text-slate-700 font-medium text-base sm:text-[17px]">
              Our services are not intended for children under 13. If we become aware of such data collection, we will delete it immediately.
            </p>
          </div>

          {/* 11. Compliance with Laws */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">11. Compliance with Laws</h3>
            <p className="text-slate-700 font-medium text-base sm:text-[17px]">
              We comply with applicable privacy laws, including GDPR, CCPA, and similar regulations where relevant.
            </p>
          </div>

          {/* 12. Changes to This Policy */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">12. Changes to This Policy</h3>
            <p className="text-slate-700 font-medium text-base sm:text-[17px]">
              We may update this Privacy Policy periodically. Updates will be posted with a revised effective date.
            </p>
          </div>

          {/* 13. Contact Us */}
          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">13. Contact Us</h3>
            <div className="space-y-1.5 text-slate-700 font-medium text-base sm:text-[17px]">
              <p><strong className="text-[#0D1527]">Email:</strong> info@towasicsolutions.com</p>
              <p><strong className="text-[#0D1527]">Website:</strong> <a href="https://towasicsolutions.com" className="text-[#3B82F6] hover:underline">Towasicsolutions.com</a></p>
              <p><strong className="text-[#0D1527]">Address:</strong> 3139 W Holcombe Blvd A61, Houston, TX 77025</p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}

