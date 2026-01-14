"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import FlowLayout from "../_components/FlowLayout";
import AddToHomeScreen from "../_components/AddToHomeScreen";
import ShareSheetModal from "../_components/ShareSheetModal";

export default function ConfirmationPage() {
  const router = useRouter();

  const [refCode, setRefCode] = useState("");
  const [refLink, setRefLink] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState<"link" | null>(null);
  const [showA2HS, setShowA2HS] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [hasPartner, setHasPartner] = useState(false);

  // Generate or load referral code
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check for partner
    const partner = localStorage.getItem("hf_partner");
    setHasPartner(!!partner);

    // Priority 1: Partner code
    const partnerCode = localStorage.getItem("hf_partner_public_code");
    if (partnerCode) {
      setRefCode(partnerCode);
      return;
    }

    // Priority 2: User code
    const userCode = localStorage.getItem("hf_user_code");
    if (userCode) {
      setRefCode(userCode);
      return;
    }

    // Priority 3: Generate new user code
    const newCode = generateCode();
    localStorage.setItem("hf_user_code", newCode);
    setRefCode(newCode);
  }, []);

  // Build referral link
  useEffect(() => {
    if (!refCode) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${origin}/?ref=${encodeURIComponent(refCode)}`;
    setRefLink(link);
  }, [refCode]);

  // Generate QR code
  useEffect(() => {
    if (!refLink) return;

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

  const handleCopy = (text: string) => {
    if (typeof navigator === "undefined") return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied("link");
        setTimeout(() => setCopied(null), 2000);
      })
      .catch(() => {});
  };

  const handleShare = async () => {
    if (typeof navigator === "undefined" || !navigator.share) {
      handleCopy(refLink);
      return;
    }

    try {
      await navigator.share({
        title: "Join me on HomeFront",
        text: `I'm using HomeFront for streamlined access to housing benefits. Join me with code: ${refCode}`,
        url: refLink,
      });
    } catch (err) {
      // User cancelled or error
    }
  };

  const handleA2HSComplete = () => {
    // Auto-open share after adding to home screen
    setTimeout(() => {
      setShowShare(true);
    }, 300);
  };

  return (
    <>
      <FlowLayout title="You're all set." subtitle="Add HomeFront to your Home Screen for quick access.">
        <div className="relative z-50 flex flex-col gap-6 text-left">
          {/* Card 1: Add to Home Screen */}
          <div className="bg-white/5 border border-white/15 rounded-2xl p-6">
            <h3 className="text-lg font-extrabold text-white mb-2">
              Add to Home Screen
            </h3>
            <p className="text-sm text-white/70 mb-4">
              Save HomeFront so your link and QR are always one tap away.
            </p>

            <button
              type="button"
              onClick={() => setShowA2HS(true)}
              className="w-full py-4 bg-[#ff385c] hover:bg-[#ff385c]/90 rounded-xl text-white font-extrabold text-lg transition shadow-lg"
            >
              Add to Home Screen
            </button>

            <button
              type="button"
              onClick={() => setShowA2HS(true)}
              className="mt-2 w-full py-2 text-sm text-white/60 hover:text-white transition font-semibold"
            >
              How to add
            </button>
          </div>

          {/* Card 2: Your Link + QR + Share */}
          <div className="bg-white/5 border border-white/15 rounded-2xl p-6">
            <h3 className="text-lg font-extrabold text-white mb-4">
              Your Referral Link
            </h3>

            {/* QR Code */}
            {qrDataUrl && (
              <div className="flex justify-center mb-4">
                <div className="bg-white p-3 rounded-xl shadow-lg">
                  <img
                    src={qrDataUrl}
                    alt="Referral QR Code"
                    className="w-48 h-48"
                  />
                </div>
              </div>
            )}

            {/* Code Display */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center mb-4">
              <p className="text-xs font-bold text-white/50 uppercase tracking-wide mb-1">
                Code
              </p>
              <p className="text-2xl font-extrabold text-white tracking-wider">
                {refCode}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleCopy(refLink)}
                className="w-full py-3 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl text-white font-bold transition"
              >
                {copied === "link" ? "✓ Link Copied!" : "Copy Link"}
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="w-full py-3 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl text-white font-bold transition"
              >
                Share
              </button>
            </div>
          </div>

          {/* Card 3: Partner Portal */}
          <div className="bg-white/5 border border-white/15 rounded-2xl p-6">
            <h3 className="text-lg font-extrabold text-white mb-2">
              Partner Portal
            </h3>
            <p className="text-sm text-white/70 mb-4">
              {hasPartner
                ? "Access your partner dashboard and referral tracking."
                : "Create a unique partner QR code for your referrals."}
            </p>

            <button
              type="button"
              onClick={() => router.push(hasPartner ? "/partner/dashboard" : "/partner/signup")}
              className="w-full py-4 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl text-white font-bold transition"
            >
              {hasPartner ? "Open Partner Portal" : "Create Partner QR"}
            </button>

            {/* Empty State */}
            <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <svg className="w-10 h-10 mx-auto mb-2 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xs text-white/60">
                Referral tracking will appear here once syncing is enabled.
              </p>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-white/5 border border-white/15 rounded-2xl p-6">
            <h3 className="text-lg font-extrabold text-white mb-4">
              What happens next
            </h3>

            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff385c] flex items-center justify-center text-xs font-bold text-white">
                  1
                </div>
                <p className="text-sm text-white/80 flex-1">
                  We route your request based on your answers.
                </p>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff385c] flex items-center justify-center text-xs font-bold text-white">
                  2
                </div>
                <p className="text-sm text-white/80 flex-1">
                  You'll be contacted the way you prefer.
                </p>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff385c] flex items-center justify-center text-xs font-bold text-white">
                  3
                </div>
                <p className="text-sm text-white/80 flex-1">
                  No spam — opt out anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl
                       border border-white/15 bg-white/10 text-white text-[18px] font-extrabold
                       hover:bg-white/15 active:scale-[0.99] transition
                       focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
          >
            Back to Home
          </button>
        </div>
      </FlowLayout>

      <AddToHomeScreen
        isOpen={showA2HS}
        onClose={() => setShowA2HS(false)}
        onComplete={handleA2HSComplete}
      />

      <ShareSheetModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />
    </>
  );
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
