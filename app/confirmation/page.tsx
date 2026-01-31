"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import AppShell from "../../components/AppShell";
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
    <AppShell>
      <div className="w-full max-w-md relative mx-auto text-left px-2 pt-2 pb-2 flex flex-col gap-2">
        {/* Congratulatory Message */}
        <div className="bg-white/10 border border-white/15 rounded-xl p-2 mb-1 text-center">
          <h2 className="text-lg font-extrabold text-[#ff385c] mb-1">Congratulations!</h2>
          <p className="text-xs text-white font-semibold mb-1">A HomeFront representative will be in contact with you soon.</p>
          <p className="text-[11px] text-white/80 font-medium mt-1">
            As a Community Ambassador, you can earn <span className="font-bold text-[#ff385c]">$100</span> for every qualified lead you refer. Share your personal QR code anytime—just visit the <span className="font-bold text-white">Share</span> tab on the homepage, or tap the <span className="font-bold text-[#ff385c]">HomeFront</span> logo at the top of the homepage to access your code and start inviting friends!
          </p>
        </div>


          {/* What Happens Next */}
        <div className="bg-white/5 border border-white/15 rounded-xl p-2">
          <h3 className="text-base font-extrabold text-white mb-1">What happens next</h3>
          <div className="space-y-1">
            <div className="flex gap-1 items-start">
              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#ff385c] flex items-center justify-center text-[10px] font-bold text-white">1</div>
              <p className="text-xs text-white/80 flex-1">We route your request based on your answers.</p>
            </div>
            <div className="flex gap-1 items-start">
              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#ff385c] flex items-center justify-center text-[10px] font-bold text-white">2</div>
              <p className="text-xs text-white/80 flex-1">You'll be contacted the way you prefer.</p>
            </div>
            <div className="flex gap-1 items-start">
              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#ff385c] flex items-center justify-center text-[10px] font-bold text-white">3</div>
              <p className="text-xs text-white/80 flex-1">No spam — opt out anytime.</p>
            </div>
          </div>
        </div>

          {/* Back to Home */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-full py-2 rounded-xl border border-white/15 bg-white/10 text-white text-base font-extrabold hover:bg-white/15 active:bg-[#ff385c] active:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/60 mt-1 transition"
        >
          Back to Home
        </button>
        <p className="mt-2 text-[9px] text-white/50 text-center">
          <span className="font-semibold">Note:</span> A qualified lead is defined as a client who has signed a buyer representation agreement, obtained a pre-qualification from a lender, and has demonstrated intent to engage in meaningful real estate activity. Terms and conditions apply.
        </p>
        </div>
      <AddToHomeScreen isOpen={showA2HS} onClose={() => setShowA2HS(false)} onComplete={handleA2HSComplete} />
      <ShareSheetModal isOpen={showShare} onClose={() => setShowShare(false)} />
    </AppShell>
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
