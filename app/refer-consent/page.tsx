"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AppShell from "../../components/AppShell";

export default function ReferConsentPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [submitting, setSubmitting] = useState(false);
  const canSubmit = !submitting;

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
      setTimeout(() => router.push("/completion"), 120);
    } catch (error) {
      console.error("Referral submission error:", error);
      setSubmitting(false);
      alert("Failed to submit referral. Please try again.");
    }
  };

  return (
    <AppShell>
      <div className="w-full max-w-md relative mx-auto text-left px-4 pt-8 pb-10 flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center pointer-events-none mb-5 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight leading-none">
            Consent
          </h1>
        </div>
        <div className="relative z-50 flex flex-col gap-6">
          <div className="text-sm text-white/80 text-left">
            By submitting, I agree that I have permission to share my friend's contact information with HomeFront and agree to the
            <a href="/terms" target="_blank" className="text-[#ff385c] underline hover:no-underline mx-1">Terms of Service</a>
            and
            <a href="/privacy-policy" target="_blank" className="text-[#ff385c] underline hover:no-underline mx-1">Privacy Policy</a>.
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
      </div>
    </AppShell>
  );
}
