"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import PhoneShell from "../_components/PhoneShell";

type ConfettiPiece = {
  id: number;
  x: number; // vw
  size: number; // px
  drift: number; // px
  delay: number; // s
  duration: number; // s
  rotate: number; // deg
  opacity: number; // 0-1
};

export const dynamic = "force-dynamic";

function ConfirmationContent() {
  const sp = useSearchParams();

  const [refCode, setRefCode] = useState<string>("");
  const [refLink, setRefLink] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const deferredPromptRef = useRef<any>(null);

  // Confetti
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  const isIOS = useMemo(() => {
    if (typeof window === "undefined") return false;
    return /iPad|iPhone|iPod/.test(window.navigator.userAgent);
  }, []);

  const isStandalone = useMemo(() => {
    if (typeof window === "undefined") return false;
    const nav: any = window.navigator as any;
    return (
      window.matchMedia?.("(display-mode: standalone)")?.matches ||
      nav?.standalone === true
    );
  }, []);

  useEffect(() => {
    // Capture A2HS prompt (Android/Chrome/Desktop Chrome)
    const handler = (e: any) => {
      e.preventDefault();
      deferredPromptRef.current = e;
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    // Generate/load referral code (Option A: one code per device/user)
    try {
      const existing = window.localStorage.getItem("homefront_ref_code");
      if (existing) {
        setRefCode(existing);
        return;
      }

      const code =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? (crypto as any).randomUUID().slice(0, 10)
          : Math.random().toString(36).slice(2, 12);

      window.localStorage.setItem("homefront_ref_code", code);
      setRefCode(code);
    } catch {
      const code = Math.random().toString(36).slice(2, 12);
      setRefCode(code);
    }
  }, []);

  useEffect(() => {
    // Build referral link once we have refCode
    if (!refCode) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${origin}/?ref=${encodeURIComponent(refCode)}`;
    setRefLink(link);
  }, [refCode]);

  useEffect(() => {
    // Generate QR image
    if (!refLink) return;

    (async () => {
      try {
        const dataUrl = await QRCode.toDataURL(refLink, {
          errorCorrectionLevel: "M",
          margin: 2,
          width: 720,
        });
        setQrDataUrl(dataUrl);
      } catch {
        setQrDataUrl("");
      }
    })();
  }, [refLink]);

  useEffect(() => {
    // Confetti pieces (client-only)
    const pieces: ConfettiPiece[] = Array.from({ length: 36 }).map((_, i) => {
      const size = 6 + Math.floor(Math.random() * 10); // 6-15px
      return {
        id: i,
        x: Math.random() * 100, // vw
        size,
        drift: -30 + Math.random() * 60, // -30..30px
        delay: Math.random() * 0.8,
        duration: 4 + Math.random() * 2.5,
        rotate: Math.random() * 360,
        opacity: 0.55 + Math.random() * 0.35,
      };
    });
    setConfetti(pieces);
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(refLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore
    }
  };

  const promptInstall = async () => {
    const prompt = deferredPromptRef.current;
    if (!prompt) return;
    try {
      await prompt.prompt();
      await prompt.userChoice;
    } catch {
      // ignore
    } finally {
      deferredPromptRef.current = null;
    }
  };

  const meta = useMemo(() => {
    const mission = sp.get("mission") || "";
    const location = sp.get("location") || "";
    return (
      (mission ? `Mission: ${mission}` : "") +
      (mission && location ? " • " : "") +
      (location ? `Location: ${location}` : "")
    );
  }, [sp]);

  return (
    <PhoneShell title="You're set" subtitle="Save your QR and share your link." meta={meta || undefined}>
      {/* Confetti (pure CSS) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        {confetti.map((c) => (
          <span
            key={c.id}
            className="absolute top-[-20px] rounded-full"
            style={{
              left: `${c.x}vw`,
              width: `${c.size}px`,
              height: `${c.size}px`,
              opacity: c.opacity,
              transform: `translateX(${c.drift}px) rotate(${c.rotate}deg)`,
              animation: `hf-fall ${c.duration}s linear ${c.delay}s infinite`,
              background: "rgba(255,255,255,0.9)",
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes hf-fall {
          0% { transform: translateY(-40px) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(540deg); }
        }
      `}</style>

      <div className="relative z-50 mt-1">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Your QR code"
                className="w-full max-w-[260px] rounded-2xl bg-white p-3"
              />
            ) : (
              <div className="w-full max-w-[260px] rounded-2xl bg-white/10 p-8 text-center text-sm font-semibold text-white/70">
                Generating QR…
              </div>
            )}
          </div>

          <div className="mt-4 text-left">
            <p className="text-[12px] font-semibold text-white/60">Your referral link</p>
            <p className="mt-1 break-all text-[12px] font-semibold text-white/85">{refLink || "…"}</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={copyLink}
              className={[
                "rounded-2xl py-3 text-[14px] font-extrabold transition active:scale-[0.99]",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
                copied
                  ? "bg-[#22c55e] text-black"
                  : "border border-white/15 bg-white/10 text-white hover:bg-white/15",
              ].join(" ")}
            >
              {copied ? "Copied ✓" : "Copy Link"}
            </button>

            <button
              type="button"
              onClick={promptInstall}
              disabled={isStandalone || isIOS}
              className={[
                "rounded-2xl py-3 text-[14px] font-extrabold transition active:scale-[0.99]",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
                isStandalone || isIOS
                  ? "bg-white/5 text-white/40 cursor-not-allowed"
                  : "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]",
              ].join(" ")}
            >
              Add to Home Screen
            </button>
          </div>

          {isIOS && !isStandalone ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-left">
              <p className="text-[12px] font-extrabold text-white">iPhone install</p>
              <p className="mt-1 text-[12px] font-semibold text-white/70">
                Tap <b>Share</b> → <b>Add to Home Screen</b>.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </PhoneShell>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <PhoneShell title="You're set" subtitle="Save your QR and share your link.">
          <div className="h-8" />
        </PhoneShell>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
