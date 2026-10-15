import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import { API_BASE_URL } from '../config'

export default function PrivacyPolicy() {
  const [doc, setDoc] = useState(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    let cancelled = false
    axios.get(`${API_BASE_URL}/legal/privacy-policy`)
      .then((res) => { if (!cancelled) setDoc(res.data) })
      .catch(() => { if (!cancelled) setDoc(null) })
      .finally(() => { if (!cancelled) setChecked(true) })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen bg-white font-inter">
      <Navbar />

      <PageHeader
        title="Privacy Policies"
        description="Our privacy policy outlines how we collect, use, and protect your personal information. We are committed to ensuring your data remains safe and confidential, and we only use it to improve your experience with our services."
        image="/assets/privacypolicy.png"
        imageAlt="Privacy Policy Illustration"
      />

      <div className="bg-[#EFFBFC] w-full py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-[#0F172A] leading-relaxed">

          {!checked ? (
            <div className="py-12 text-center text-slate-500 font-medium">
              Loading…
            </div>
          ) : !doc ? (
            <div className="py-12 text-center text-slate-500 font-medium">
              Privacy Policy content is being updated. Please check back soon.
            </div>
          ) : (
            <>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D1527] mb-2 tracking-tight">
                {doc.title}
              </h2>

              {doc.effectiveDate && (
                <p className="text-base font-semibold mb-8 text-slate-700">
                  <span className="text-[#3B82F6] font-bold">Effective Date:</span>{' '}
                  <span className="font-bold text-[#0D1527]">{doc.effectiveDate}</span>
                </p>
              )}

              <div
                className="legal-page-content"
                dangerouslySetInnerHTML={{ __html: doc.content }}
              />
            </>
          )}

        </div>
      </div>

      <Footer />
    </div>
  )
}