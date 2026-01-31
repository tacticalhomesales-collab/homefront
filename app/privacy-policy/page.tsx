
"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AppShell from "../../components/AppShell";

export default function PrivacyPolicyPage() {
  const sp = useSearchParams();

  const getParamString = () => {
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    return q.toString();
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-6 py-10">
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
          Privacy Policy
        </h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-white/70 mb-6">
            <strong>Effective Date:</strong> January 1, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-white/80 leading-relaxed mb-4 space-y-2">
              <li>Name, phone number, and email address</li>
              <li>Military or first responder affiliation details (if applicable)</li>
              <li>Real estate preferences and location information</li>
              <li>Financing status and preferences</li>
              <li>Any additional notes or information you choose to provide</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-white/80 leading-relaxed mb-4 space-y-2">
              <li>Match you with qualified real estate professionals</li>
              <li>Communicate with you about your real estate needs</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc list-inside text-white/80 leading-relaxed mb-4 space-y-2">
              <li>Real estate professionals in our network who can assist with your needs</li>
              <li>Service providers who help us operate our platform</li>
              <li>Legal authorities when required by law</li>
            </ul>
            <p className="text-white/80 leading-relaxed mb-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              We implement reasonable security measures to protect your personal information from
              unauthorized access, disclosure, or destruction. However, no internet transmission is
              completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-white/80 leading-relaxed mb-4 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request corrections to your personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Cookies and Tracking</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              We may use cookies and similar tracking technologies to improve your experience
              on our platform. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Children's Privacy</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              Our services are not intended for individuals under the age of 18. We do not
              knowingly collect personal information from children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Changes to This Policy</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any
              material changes by posting the new policy on our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@homefront.com" className="text-[#ff385c] hover:text-[#ff284d] underline">
                privacy@homefront.com
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
    </AppShell>
  );
}
