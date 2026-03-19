"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import AppShell from "../../components/AppShell";
import AddToHomeScreen from "../_components/AddToHomeScreen";
import ShareSheetModal from "../_components/ShareSheetModal";

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [refCode, setRefCode] = useState("");
  const [refLink, setRefLink] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState<"link" | null>(null);
  const [showA2HS, setShowA2HS] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [hasPartner, setHasPartner] = useState(false);
  const [showAmbassadorPrompt, setShowAmbassadorPrompt] = useState(false);
  const [ambassadorLoading, setAmbassadorLoading] = useState(false);
  const [ambassadorError, setAmbassadorError] = useState<string | null>(null);

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

  // After confirmation, show Community Marketing Ambassador opt-in a few seconds later
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasPartner) return;

    const name = searchParams.get("name");
    const phone = searchParams.get("phone");

    if (!name || !phone) return;

    const timer = setTimeout(() => {
      setShowAmbassadorPrompt(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasPartner, searchParams]);

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

  // Automatically prompt to add HomeFront to the home screen
  // If the ambassador prompt will show, we delay A2HS until after that flow.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const name = searchParams.get("name");
    const phone = searchParams.get("phone");

    // If we already have a partner or no contact info, just show A2HS after 3s
    if (hasPartner || !name || !phone) {
      const timer = setTimeout(() => {
        setShowA2HS(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hasPartner, searchParams]);

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

  const handleAmbassadorClose = () => {
    if (ambassadorLoading) return;
    setShowAmbassadorPrompt(false);
    setAmbassadorError(null);

    // After closing, show Add to Home Screen shortly
    setTimeout(() => {
      setShowA2HS(true);
    }, 400);
  };

  const handleAmbassadorAccept = async () => {
    if (ambassadorLoading) return;

    const rawName = (searchParams.get("name") || "").trim();
    const rawPhone = (searchParams.get("phone") || "").trim();
    const rawEmail = (searchParams.get("email") || "").trim();

    if (!rawName || !rawPhone) {
      setAmbassadorError("We couldn't find your contact details. Please try again later.");
      return;
    }

    setAmbassadorLoading(true);
    setAmbassadorError(null);

    try {
      const firstName = rawName.split(" ")[0] || rawName;

      // If this person already has their own personal code from the
      // confirmation/share flow, promote that exact code to their
      // permanent partner code so it never changes.
      let existingUserCode: string | null = null;
      if (typeof window !== "undefined") {
        try {
          existingUserCode = window.localStorage.getItem("hf_user_code");
        } catch {
          existingUserCode = null;
        }
      }

      const partnerPayload = {
        type: "ambassador",
        firstName,
        phone: rawPhone,
        email: rawEmail || undefined,
        refCode: existingUserCode || undefined,
      };

      const response = await fetch("/api/partner/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partnerPayload),
      });

      if (!response.ok) {
        setAmbassadorError("Unable to enroll right now. Please try again later.");
        return;
      }

      const result = await response.json().catch(() => null);

      if (typeof window !== "undefined" && result) {
        try {
          const refCodeFromResult = result?.ref_code || result?.referrer?.ref_code;
          if (refCodeFromResult) {
            window.localStorage.setItem("hf_partner_public_code", refCodeFromResult);
          }
          window.localStorage.setItem("hf_partner", "1");
        } catch {}
      }

      setShowAmbassadorPrompt(false);
      // After successful enrollment, prompt to add HomeFront to Home Screen
      setTimeout(() => {
        setShowA2HS(true);
      }, 400);
    } catch (err) {
      setAmbassadorError("Unable to enroll right now. Please try again later.");
    } finally {
      setAmbassadorLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="w-full max-w-md relative mx-auto text-left px-2 pt-2 pb-2 flex flex-col gap-2">
        {/* Congratulatory Message */}
        <div className="bg-white/10 border border-white/15 rounded-xl p-2 mb-1 text-center">
          <h2 className="text-lg font-extrabold text-[#ff385c] mb-1">Congratulations!</h2>
          <p className="text-xs text-white font-semibold mb-1">A HomeFront representative will be in contact with you soon.</p>
          <p className="text-[11px] text-white/80 font-medium mt-1">
            Share your personal QR code anytime to help friends, family members, or anyone in the community that could benefit from HomeFront—just visit the <span className="font-bold text-white">Share</span> tab on the homepage, or tap the <span className="font-bold text-[#ff385c]">HomeFront</span> logo at the top of the homepage to start inviting friends!
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
        {/* Note removed as requested */}
        </div>

      {showAmbassadorPrompt && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleAmbassadorClose}
          />
          <div className="relative bg-[#0b0f14] border border-white/15 rounded-3xl w-full max-w-md mx-4 p-4">
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-lg font-extrabold text-white">Become a Community Marketing Ambassador?</h2>
              <button
                type="button"
                onClick={handleAmbassadorClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center transition"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-[11px] text-white/80 mb-3">
              Yes, enroll me as a <span className="font-semibold">Community Marketing Ambassador</span> and create my QR code using my contact info so I can earn rewards when friends use HomeFront.
            </p>
            {ambassadorError && (
              <p className="text-[11px] text-[#ff8a8a] mb-2">{ambassadorError}</p>
            )}
            <div className="flex flex-col gap-2 mt-1">
              <button
                type="button"
                onClick={handleAmbassadorAccept}
                disabled={ambassadorLoading}
                className={[
                  "w-full py-3 rounded-xl text-[14px] font-extrabold transition active:scale-[0.99]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/60",
                  ambassadorLoading
                    ? "bg-[#ff385c]/70 text-white cursor-wait"
                    : "bg-[#ff385c] text-white shadow-[0_1px_2px_rgba(255,56,92,0.18)]",
                ].join(" ")}
              >
                {ambassadorLoading ? "Enrolling..." : "Yes, enroll me"}
              </button>
              <button
                type="button"
                onClick={handleAmbassadorClose}
                disabled={ambassadorLoading}
                className="w-full py-2 rounded-xl border border-white/20 bg-transparent text-[13px] font-semibold text-white/70 hover:bg-white/5 transition"
              >
                No thanks
              </button>
            </div>
          </div>
        </div>
      )}
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
