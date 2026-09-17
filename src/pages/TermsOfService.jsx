import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white font-inter">
      <Navbar />

      {/* Main Top Hero Banner */}
      <PageHeader
        title="Terms Of Services"
        description="Defines The Rules, Rights, And Responsibilities Between The Company And Users, Covering Usage Guidelines, Limitations, And Legal Protections To Ensure A Safe And Fair Service Experience."
        image="/assets/terms.png"
        imageAlt="Terms of Service Illustration"
      />

      {/* Main Body Section with Light Cyan Background (#EFFBFC) Matching PDF */}
      <div className="bg-[#EFFBFC] w-full py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-[#0F172A] leading-relaxed">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D1527] mb-2 tracking-tight">Terms of Services</h2>
          <p className="text-base font-semibold mb-8 text-slate-700">
            <span className="text-[#3B82F6] font-bold">Effective Date:</span> <span className="font-bold text-[#0D1527]">01-September-2025</span>
          </p>

          {/* 1. Acceptance of Terms */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">1. Acceptance of Terms</h3>
            <p className="text-slate-700 font-medium text-base sm:text-[17px]">
              By using the services of Towasic Solutions (“we,” “us,” “our”), you agree to these Terms of Service. If you do not agree, do not use our services.
            </p>
          </div>

          {/* 2. Services Offered */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">2. Services Offered</h3>
            <p className="text-slate-700 font-medium text-base sm:text-[17px] mb-2">We provide:</p>
            <div className="pl-4 space-y-1 text-slate-700 font-medium text-base sm:text-[17px] mb-3">
              <p>· Web scraping solutions</p>
              <p>· Automation and AI-powered bots</p>
              <p>· Social media automation tools</p>
              <p>· Dashboard and GUI design</p>
              <p>· Bulk data scraping</p>
              <p>· API integrations</p>
            </div>
            <p className="text-slate-700 font-medium text-base sm:text-[17px]">
              All services are delivered according to a mutually agreed scope of work.
            </p>
          </div>

          {/* 3. Client Responsibilities */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">3. Client Responsibilities</h3>
            <p className="text-slate-700 font-medium text-base sm:text-[17px] mb-2">The Client agrees to:</p>
            <div className="pl-4 space-y-1 text-slate-700 font-medium text-base sm:text-[17px]">
              <p>· Provide accurate project requirements</p>
              <p>· Ensure that requested activities comply with applicable laws and third-party website terms</p>
              <p>· Obtain necessary permissions for data access and automation</p>
              <p>· Use our deliverables only for lawful purposes</p>
            </div>
          </div>

          {/* 4. Data and Content Ownership */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">4. Data and Content Ownership</h3>
            <div className="pl-4 space-y-1.5 text-slate-700 font-medium text-base sm:text-[17px]">
              <p>· Unless otherwise agreed in writing, we retain ownership of all source code, scripts, and frameworks created for projects.</p>
              <p>· Clients receive a license to use deliverables for their intended purposes.</p>
              <p>· Any scraped data belongs to the client upon delivery, provided its use is lawful.</p>
            </div>
          </div>

          {/* 5. Legal Compliance & Risks */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">5. Legal Compliance & Risks</h3>
            <div className="pl-4 space-y-1.5 text-slate-700 font-medium text-base sm:text-[17px]">
              <p>· The Client acknowledges that some websites restrict scraping or automation.</p>
              <p>· The Client assumes full responsibility for any legal or contractual consequences arising from use of our services.</p>
              <p>· We do not guarantee immunity from third-party enforcement actions.</p>
            </div>
          </div>

          {/* 6. Service Limitations */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">6. Service Limitations</h3>
            <div className="pl-4 space-y-1.5 text-slate-700 font-medium text-base sm:text-[17px]">
              <p>· We cannot guarantee uninterrupted bot operation if websites change structure, add anti-bot measures, or block access.</p>
              <p>· AI-powered tools may produce imperfect or incomplete results; human review is advised.</p>
            </div>
          </div>

          {/* 7. Payment and Refunds */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">7. Payment and Refunds</h3>
            <div className="pl-4 space-y-1.5 text-slate-700 font-medium text-base sm:text-[17px]">
              <p>· Payment terms are outlined in the project agreement.</p>
              <p>· Due to the custom nature of our work, refunds are only issued if agreed in writing.</p>
            </div>
          </div>

          {/* 8. Confidentiality */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">8. Confidentiality</h3>
            <p className="text-slate-700 font-medium text-base sm:text-[17px]">
              We will maintain confidentiality of all sensitive client data, including credentials, business data, and proprietary information.
            </p>
          </div>

          {/* 9. Data Security */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">9. Data Security</h3>
            <p className="text-slate-700 font-medium text-base sm:text-[17px]">
              We take reasonable measures to secure project data. However, we are not liable for breaches beyond our control.
            </p>
          </div>

          {/* 10. Termination */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">10. Termination</h3>
            <p className="text-slate-700 font-medium text-base sm:text-[17px]">
              We may suspend or terminate services if the Client breaches these Terms, fails to pay, or engages in unlawful activities.
            </p>
          </div>

          {/* 11. Force Majeure */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">11. Force Majeure</h3>
            <p className="text-slate-700 font-medium text-base sm:text-[17px]">
              We are not liable for delays or failures caused by events beyond our control, including website changes, API restrictions, outages, or legal restrictions.
            </p>
          </div>

          {/* 12. Governing Law */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">12. Governing Law</h3>
            <p className="text-slate-700 font-medium text-base sm:text-[17px]">
              These Terms are governed by the laws of Texas, USA.
            </p>
          </div>

          {/* 13. Contact */}
          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0D1527]">13. Contact</h3>
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
