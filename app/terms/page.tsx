"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function TermsPage() {
  const sp = useSearchParams();

  const getParamString = () => {
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    return q.toString();
  };

  return (
    <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/consent?${getParamString()}`}
            className="text-[#ff385c] hover:text-[#ff284d] text-sm font-semibold flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Consent
          </Link>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight mb-6">
          Terms of Service
        </h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-white/70 mb-6">
            <strong>Effective Date:</strong> January 1, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              By accessing or using HomeFront's services, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Services Provided</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              HomeFront provides real estate matching and referral services to connect military service members,
              veterans, first responders, and their families with qualified real estate professionals.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. User Responsibilities</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              You agree to provide accurate and complete information when using our services.
              You are responsible for maintaining the confidentiality of any account information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Contact and Communication</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              By providing your contact information, you consent to receive communications from HomeFront
              and our partner real estate professionals regarding your real estate needs. You may opt out
              of communications at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. No Government Affiliation</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              HomeFront is not affiliated with, endorsed by, or sponsored by any government agency,
              including the Department of Defense, Department of Veterans Affairs, or any military branch.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              HomeFront provides referral services only. We are not responsible for the actions or services
              provided by third-party real estate professionals. All real estate transactions are between
              you and the real estate professional.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Modifications to Terms</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              HomeFront reserves the right to modify these Terms of Service at any time. Continued use
              of our services after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Contact Information</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              For questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:support@homefront.com" className="text-[#ff385c] hover:text-[#ff284d] underline">
                support@homefront.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-xs text-white/45 text-center">
            © 2025 HomeFront. All rights reserved. Not affiliated with any government agency.
          </p>
        </div>
      </div>
    </main>
  );
}
