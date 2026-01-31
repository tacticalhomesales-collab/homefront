"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import AppShell from "../components/AppShell";

const ShareSheetModal = dynamic(() => import("./_components/ShareSheetModal"), { ssr: false });

export default function LandingPage() {
  const router = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const buttons = [
    { label: "Buy", mission: "buy" },
    { label: "Sell", mission: "sell" },
    { label: "Rent", mission: "rent" },
    { label: "Manage Rental", mission: "manage" },
  ];

  return (
    <AppShell>
      <div className="w-full flex flex-col items-center pt-1">
        <span
          className="block w-full text-center font-extrabold tracking-tight leading-tight text-white mb-1"
          style={{
            fontSize: "clamp(1.7rem,5vw,2.5rem)",
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
            textShadow: '0 2px 16px rgba(0,0,0,0.12)',
          }}
        >
          Mission
        </span>
        <span className="font-semibold text-center mb-2" style={{ fontSize: "clamp(12px,3.2vw,14px)", lineHeight: "1.2" }}>
          Unlock incentives in 60 seconds
        </span>
        {/* Mission buttons: grey by default, red on hover/selected */}
        <div className="w-full grid grid-cols-2 gap-3">
          {buttons.map((chip) => {
            const isSelected = selected === chip.mission;
            return (
              <button
                key={chip.label}
                type="button"
                tabIndex={0}
                className={[
                  "rounded-lg border font-bold focus:outline-none focus-visible:ring-2 transition-all select-none shadow-md",
                  isSelected
                    ? "border-[#ff385c] bg-[#ff385c] text-white shadow-lg"
                    : "border-white/15 bg-white/10 text-white hover:bg-[#ff385c] hover:border-[#ff385c] hover:text-white",
                ].join(" ")}
                style={{
                  minHeight: 48,
                  height: 56,
                  fontSize: "clamp(15px,3.7vw,17px)",
                  padding: "0 1.2rem",
                  width: "100%",
                }}
                aria-pressed={isSelected}
                aria-label={chip.label}
                onClick={() => {
                  setSelected(chip.mission);
                  setTimeout(() => router.push(`/choose?mission=${chip.mission}`), 120);
                }}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
        {/* CTA ICON ROW - Share, Refer, Partner, Reviews */}
        <div className="flex flex-row items-center justify-center gap-6 py-2 mt-2">
          <div className="flex flex-col items-center justify-center text-center">
            <button
              className="hover:scale-110 transition mx-auto"
              aria-label="Share"
              style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => setShowShareModal(true)}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400 mx-auto"><path d="M12 19v-7"></path><path d="M5 12l7-7 7 7"></path><rect x="5" y="19" width="14" height="2" rx="1" fill="currentColor" className="opacity-20"></rect></svg>
            </button>
            <span className="text-xs text-white/60 mt-1" style={{ fontSize: '0.65rem', display: 'block', textAlign: 'center' }}>Share</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <button
              className="hover:scale-110 transition mx-auto"
              aria-label="Refer a Friend"
              style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => router.push('/refer')}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 mx-auto"><circle cx="12" cy="7" r="4"></circle><path d="M6 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2"></path><path d="M19 8v6"></path><path d="M22 11h-6"></path></svg>
            </button>
            <span className="text-xs text-white/60 mt-1" style={{ fontSize: '0.65rem', display: 'block', textAlign: 'center' }}>Refer a friend</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <button
              className="hover:scale-110 transition mx-auto"
              aria-label="Partner Portal"
              style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => router.push('/partner')}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fuchsia-400 mx-auto"><rect x="7" y="11" width="10" height="2" rx="1"></rect><path d="M8.5 13a4 4 0 1 1 0-8h7a4 4 0 1 1 0 8"></path></svg>
            </button>
            <span className="text-xs text-white/60 mt-1" style={{ fontSize: '0.65rem', display: 'block', textAlign: 'center' }}>Partner portal</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <button
              className="hover:scale-110 transition mx-auto"
              aria-label="Reviews"
              style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => router.push('/reviews')}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 mx-auto"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
            </button>
            <span className="text-xs text-white/60 mt-1" style={{ fontSize: '0.65rem', display: 'block', textAlign: 'center' }}>Reviews</span>
          </div>
        </div>
        {/* ShareSheetModal for Share button */}
        <ShareSheetModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
      </div>
    </AppShell>
  );
}
