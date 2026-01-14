"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import FlowLayout from "../../_components/FlowLayout";

type Partner = {
  first_name: string;
  last_name: string;
  contact: string;
  public_code: string;
  created_at: string;
};

export default function PartnerDashboardPage() {
  const router = useRouter();

  const [partner, setPartner] = useState<Partner | null>(null);
  const [refLink, setRefLink] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState<"link" | "code" | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load partner data
    const partnerData = localStorage.getItem("hf_partner");
    if (!partnerData) {
      router.replace("/partner/signup");
      return;
    }

    try {
      const p = JSON.parse(partnerData) as Partner;
      setPartner(p);

      // Build referral link
      const origin = window.location.origin;
      const link = `${origin}/?ref=${encodeURIComponent(p.public_code)}`;
      setRefLink(link);
    } catch {
      router.replace("/partner/signup");
    }
  }, [router]);

  useEffect(() => {
    if (!refLink) return;

    // Generate QR code
    QRCode.toDataURL(refLink, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 512,
      color: {
        dark: "#0A1C3C",
        light: "#FFFFFF",
      },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [refLink]);

  const handleCopy = (type: "link" | "code", text: string) => {
    if (typeof navigator === "undefined") return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
      })
      .catch(() => {});
  };

  const handleShare = async () => {
    if (typeof navigator === "undefined" || !navigator.share || !partner) {
      handleCopy("link", refLink);
      return;
    }

    try {
      await navigator.share({
        title: "Join me on HomeFront",
        text: `I'm using HomeFront for streamlined access to housing benefits. Join me with code: ${partner.public_code}`,
        url: refLink,
      });
    } catch (err) {
      // User cancelled or error
    }
  };

  const handleReset = () => {
    if (!confirm("Reset your partner account? This will delete your current QR code.")) {
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("hf_partner");
      localStorage.removeItem("hf_partner_public_code");
      router.replace("/partner/signup");
    }
  };

  if (!partner) {
    return (
      <div className="min-h-[100dvh] w-full bg-[#0b0f14] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <FlowLayout
      title="Partner Dashboard"
      subtitle={`Welcome, ${partner.first_name}!`}
    >
      <div className="relative z-50 flex flex-col gap-6 text-left">
        {/* QR Code Card */}
        <div className="bg-white/5 border border-white/15 rounded-2xl p-6 flex flex-col items-center">
          <p className="text-xs font-bold text-white/50 uppercase tracking-wide mb-4">
            Your Referral QR Code
          </p>

          {qrDataUrl && (
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <img
                src={qrDataUrl}
                alt="Partner Referral QR Code"
                className="w-64 h-64"
              />
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-sm text-white/70">Code:</p>
            <p className="text-3xl font-extrabold text-white tracking-wider">
              {partner.public_code}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleCopy("link", refLink)}
            className="w-full py-4 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl text-white font-bold transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copied === "link" ? "✓ Link Copied!" : "Copy Link"}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-full py-4 bg-[#ff385c] hover:bg-[#ff385c]/90 rounded-xl text-white font-extrabold text-lg transition shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>

          <button
            type="button"
            onClick={() => handleCopy("code", partner.public_code)}
            className="w-full py-3 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl text-white font-bold transition"
          >
            {copied === "code" ? "✓ Code Copied!" : "Copy Code"}
          </button>
        </div>

        {/* Referrals Section */}
        <div className="bg-white/5 border border-white/15 rounded-2xl p-6">
          <h3 className="text-lg font-extrabold text-white mb-3">My Referrals</h3>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <svg className="w-12 h-12 mx-auto mb-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm text-white/60">
              Referral tracking will appear here once syncing is enabled.
            </p>
            <p className="mt-2 text-xs text-white/40">
              No backend integration yet.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full py-3 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl text-white font-bold transition"
          >
            Back to Home
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-full py-2 text-sm text-red-400/80 hover:text-red-400 transition font-semibold"
          >
            Reset Partner Account
          </button>
        </div>
      </div>
    </FlowLayout>
  );
}
