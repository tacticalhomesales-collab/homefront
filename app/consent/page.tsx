"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function ConsentPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [consentContact, setConsentContact] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [pressed, setPressed] = useState(false);

  const canContinue = consentContact && consentTerms;

  const goNext = () => {
    if (!canContinue || pressed) return;
    setPressed(true);

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("consent_contact", "1");
    q.set("consent_terms", "1");

    const url = `/verify?${q.toString()}`;

    setTimeout(() => {
      try {
        router.push(url);
      } finally {
        setTimeout(() => {
          if (typeof window !== "undefined" && !window.location.pathname.startsWith("/verify")) {
            window.location.assign(url);
          }
        }, 250);
      }
    }, 120);
  };

  // Preserve params when clicking links
  const getParamString = () => {
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    return q.toString();
  };

  return (
    <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-4">
      <div className="min-h-[100dvh] flex flex-col items-center text-center pt-8 pb-10">
        <div className="w-full max-w-md relative">
          <div className="mx-auto w-full max-w-[95vw] mt-16 pointer-events-none select-none">
            <img
              src="/homefront-badge.png"
              alt="HomeFront"
              className="w-full h-auto scale-200 origin-center"
              draggable={false}
            />
          </div>

          <div className="-mt-6 flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-4xl font-extrabold tracking-tight leading-none">
              Consent & Terms
            </h1>
            <p className="mt-3 text-sm font-semibold text-white/70">
              Please review and accept to continue.
            </p>
          </div>

          <div className="mt-5 relative z-50 text-left">
            {/* Checkbox 1: Contact Consent */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={consentContact}
                onChange={(e) => setConsentContact(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-2 border-white/25 bg-white/10 text-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/50 cursor-pointer"
              />
              <span className="text-[14px] font-semibold text-white/80 group-hover:text-white transition">
                I agree to be contacted by HomeFront and/or its partners regarding my real estate needs.
              </span>
            </label>

            {/* Checkbox 2: Terms & Privacy */}
            <label className="flex items-start gap-3 cursor-pointer group mt-4">
              <input
                type="checkbox"
                checked={consentTerms}
                onChange={(e) => setConsentTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-2 border-white/25 bg-white/10 text-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/50 cursor-pointer"
              />
              <span className="text-[14px] font-semibold text-white/80 group-hover:text-white transition">
                I accept the{" "}
                <Link
                  href={`/terms?${getParamString()}`}
                  className="text-[#ff385c] underline hover:text-[#ff284d]"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href={`/privacy-policy?${getParamString()}`}
                  className="text-[#ff385c] underline hover:text-[#ff284d]"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {/* Continue Button */}
            <div className="mt-6">
              <button
                type="button"
                disabled={!canContinue || pressed}
                onClick={goNext}
                className={[
                  "cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl",
                  "text-[21px] font-extrabold active:scale-[0.99] transition",
                  "select-none touch-manipulation",
                  "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
                  !canContinue || pressed
                    ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                    : "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)] hover:bg-[#ff284d]",
                ].join(" ")}
              >
                Continue
              </button>
            </div>
          </div>

          <p className="mt-5 text-[11px] text-white/45">
            Not affiliated with any government agency.
          </p>
        </div>
      </div>
    </main>
  );
}
