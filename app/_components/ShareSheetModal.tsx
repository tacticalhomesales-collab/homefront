"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type ShareSheetModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ShareSheetModal({ isOpen, onClose }: ShareSheetModalProps) {
  const [refCode, setRefCode] = useState("");
  const [refLink, setRefLink] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState<"link" | "code" | "message" | null>(null);

  // Generate or load referral code
  useEffect(() => {
    if (typeof window === "undefined") return;

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
  }, [isOpen]);

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

  const handleCopy = (type: "link" | "code" | "message", text: string) => {
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
    if (typeof navigator === "undefined" || !navigator.share) {
      handleCopy("link", refLink);
      return;
    }

    try {
      await navigator.share({
        title: "Join me on HomeFront",
        text: getShareMessage(),
        url: refLink,
      });
    } catch (err) {
      // User cancelled or error
    }
  };

  const getShareMessage = () => {
    return `I'm using HomeFront for streamlined access to housing benefits. Join me with my code: ${refCode}\n\n${refLink}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#0b0f14] border border-white/15 rounded-t-3xl sm:rounded-3xl w-full max-w-md mx-4 mb-0 sm:mb-4 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#0b0f14] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white">Share HomeFront</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center transition"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* QR Code */}
          {qrDataUrl && (
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl shadow-lg">
                <img
                  src={qrDataUrl}
                  alt="Referral QR Code"
                  className="w-64 h-64"
                />
              </div>
              <p className="mt-3 text-sm text-white/70 text-center">
                Scan to join with code: <span className="font-bold text-white">{refCode}</span>
              </p>
            </div>
          )}

          {/* Referral Code (Big & Readable) */}
          <div className="bg-white/5 border border-white/15 rounded-xl p-4 text-center">
            <p className="text-xs font-bold text-white/50 uppercase tracking-wide mb-2">
              Your Referral Code
            </p>
            <p className="text-4xl font-extrabold text-white tracking-wider">
              {refCode}
            </p>
            <button
              type="button"
              onClick={() => handleCopy("code", refCode)}
              className="mt-3 px-6 py-2 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl text-sm font-bold text-white transition"
            >
              {copied === "code" ? "✓ Copied!" : "Copy Code"}
            </button>
          </div>

          {/* Copy Link */}
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

          {/* Share Button */}
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

          {/* Prefilled Message */}
          <div className="bg-white/5 border border-white/15 rounded-xl p-4">
            <p className="text-xs font-bold text-white/50 uppercase tracking-wide mb-2">
              Prefilled Message
            </p>
            <p className="text-sm text-white/80 whitespace-pre-wrap mb-3">
              {getShareMessage()}
            </p>
            <button
              type="button"
              onClick={() => handleCopy("message", getShareMessage())}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg text-xs font-bold text-white transition"
            >
              {copied === "message" ? "✓ Copied!" : "Copy Message"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Remove ambiguous chars
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
