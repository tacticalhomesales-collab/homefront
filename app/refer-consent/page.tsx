"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import FlowLayout from "../_components/FlowLayout";

export default function ReferConsentPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [agreedToShare, setAgreedToShare] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = agreedToShare && agreedToTerms && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setSubmitting(true);

    try {
      // Retrieve all referral data from sessionStorage
      const referralData =
        typeof window !== "undefined"
          ? JSON.parse(sessionStorage.getItem("referral_friend") || "{}")
          : {};

      const mission = sp.get("mission") || "";

      // Submit to API (no referrer information collected)
      const response = await fetch("/api/referrals/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          friend_name: referralData.name,
          friend_phone: referralData.phone,
          friend_email: referralData.email,
          friend_location: referralData.location,
          friend_timeline: referralData.timeline,
          friend_mission: mission,
          consented_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      // Clear sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("referral_friend");
      }

      // Navigate to confirmation
      setTimeout(() => router.push("/refer-confirmation"), 120);
    } catch (error) {
      console.error("Referral submission error:", error);
      setSubmitting(false);
      alert("Failed to submit referral. Please try again.");
    }
  };

  return (
    <FlowLayout title="Consent" subtitle="Please review and agree to continue." logoSrc="/homefront-badge.png" logoAlt="HomeFront Logo">
      <div className="relative z-50 flex flex-col gap-4">
        <div className="flex flex-col gap-4 text-left">
          {/* Consent checkboxes */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToShare}
              onChange={(e) => setAgreedToShare(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-white/30 bg-white/10
                         text-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/50"
            />
            <span className="text-sm text-white/80">
              I have permission to share my friend's contact information with HomeFront.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-white/30 bg-white/10
                         text-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/50"
            />
            <span className="text-sm text-white/80">
              I agree to the{" "}
              <a
                href="/terms"
                target="_blank"
                className="text-[#ff385c] underline hover:no-underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                className="text-[#ff385c] underline hover:no-underline"
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </div>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
          className={[
            "w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl text-[21px] font-extrabold transition",
            "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
            "active:scale-[0.99]",
            canSubmit
              ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)] cursor-pointer"
              : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed",
          ].join(" ")}
        >
          {submitting ? "Submitting..." : "Submit Referral"}
        </button>
      </div>
    </FlowLayout>
  );
}
