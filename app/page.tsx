
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";

const ShareSheetModal = dynamic(() => import("./_components/ShareSheetModal"), { ssr: false });

export default function LandingPage() {
  const router = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <main className="min-h-[100dvh] flex flex-col bg-[#0b0f14] text-white w-full overflow-x-hidden">
      <div className="flex flex-col flex-1 items-center mx-auto w-full max-w-[420px] px-2 gap-3 pt-4 pb-2">
        {/* Logo */}
        <div className="mx-auto w-full flex justify-center items-center mb-4" style={{ minHeight: 180 }}>
          <img
            src="/homefront-badge.png"
            alt="HomeFront"
            className="h-[340px] w-auto pointer-events-none select-none"
            style={{ objectFit: "contain", width: "100vw", maxWidth: "100vw" }}
            draggable={false}
            aria-label="HomeFront logo"
          />
        </div>

        {/* Headline / Logo */}
        {/* Logo removed as requested */}

        {/* Value bullets */}
          {/* Value bullets removed */}

        {/* ...existing code... */}

        {/* Label above buttons */}
        <span className="block w-full text-center font-semibold mb-0.5" style={{ fontSize: "clamp(13px,3.4vw,15px)" }}>
          Choose your mission
        </span>

        {/* Button grid */}
        <div className="w-full grid grid-cols-2 gap-3">
          {[
            { label: "Buy", mission: "buy" },
            { label: "Sell", mission: "sell" },
            { label: "Rent", mission: "rent" },
            { label: "Manage Rental", mission: "manage_rental" },
          ].map((chip) => (
            <button
              key={chip.label}
              type="button"
              tabIndex={0}
              className="rounded-full border border-[#ff385c] bg-[#ff385c] text-white font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/40 transition-all select-none hover:bg-[#e11d48] active:bg-[#c81e4a] aria-selected:border-white aria-selected:bg-[#ff385c]/80 shadow-md"
              style={{
                minHeight: 48,
                height: 52,
                fontSize: "clamp(15px,3.7vw,17px)",
                padding: "0 0.5rem",
                width: "100%",
              }}
              aria-pressed="false"
              aria-label={chip.label}
              onClick={() => router.push(`/choose?mission=${chip.mission}`)}
            >
              {chip.label}
            </button>
          ))}
        </div>
        {/* Helper text directly below buttons */}
        <span
          className="font-semibold text-center mt-2"
          style={{ fontSize: "clamp(12px,3.2vw,14px)", lineHeight: "1.2", display: "block" }}
        >
          60-second survey to get your plan.
        </span>
      </div>

      {/* Bottom nav pinned */}
      <footer className="w-full max-w-[420px] mx-auto mt-auto flex flex-col items-center gap-2 pb-2">
        <div className="flex flex-row items-center justify-center gap-4 mb-1">
          <div className="flex flex-col items-center">
            <button onClick={() => setShowShareModal(true)} className="hover:scale-110 transition" aria-label="Share">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
                <path d="M12 19v-7" />
                <path d="M5 12l7-7 7 7" />
                <rect x="5" y="19" width="14" height="2" rx="1" fill="currentColor" className="opacity-20" />
              </svg>
            </button>
            <span className="text-xs text-white/60 mt-1">Share</span>
          </div>
          <div className="flex flex-col items-center">
            <button onClick={() => router.push("/refer")} className="hover:scale-110 transition" aria-label="Refer a Friend">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                <circle cx="12" cy="7" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
                <path d="M19 8v6" />
                <path d="M22 11h-6" />
              </svg>
            </button>
            <span className="text-xs text-white/60 mt-1">Refer a friend</span>
          </div>
          <div className="flex flex-col items-center">
            <button onClick={() => router.push("/partner")} className="hover:scale-110 transition" aria-label="Partner Portal">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fuchsia-400">
                <rect x="7" y="11" width="10" height="2" rx="1" />
                <path d="M8.5 13a4 4 0 1 1 0-8h7a4 4 0 1 1 0 8" />
              </svg>
            </button>
            <span className="text-xs text-white/60 mt-1">Partner portal</span>
          </div>
          <div className="flex flex-col items-center">
            <button onClick={() => router.push("/reviews")} className="hover:scale-110 transition" aria-label="Reviews">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </button>
            <span className="text-xs text-white/60 mt-1">See reviews</span>
          </div>
          <ShareSheetModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
        </div>
      </footer>
    </main>
  );
}
