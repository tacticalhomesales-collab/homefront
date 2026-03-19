"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AppShell from "../components/AppShell";

const ShareSheetModal = dynamic(() => import("./_components/ShareSheetModal"), { ssr: false });

export default function LandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showShareModal, setShowShareModal] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const buttons = [
    {
      label: "Buy a Home",
      subtitle: "Incentives + credits + next steps",
      mission: "buy",
    },
    {
      label: "Sell a Home",
      subtitle: "Pricing + strategy + timeline",
      mission: "sell",
    },
    {
      label: "Rent a Home",
      subtitle: "Relocation support + next steps",
      mission: "rent",
    },
    {
      label: "Manage My Rental",
      subtitle: "Vetted & local",
      mission: "manage",
    },
  ];

  // Capture ?ref=CODE from landing URLs and persist for later lead attribution
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (!ref) return;
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("hf_partner_public_code", ref);
    } catch {}
  }, [searchParams]);

  return (
    <AppShell>
      <div className="w-full flex flex-col items-center pt-0 -mt-1">
        <span
          className="block w-full text-center font-extrabold tracking-tight leading-tight text-white mb-1"
          style={{
            fontSize: "clamp(1.4rem,4vw,2.1rem)",
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
            textShadow: '0 2px 16px rgba(0,0,0,0.12)',
          }}
        >
          Your Home Plan Starts Here.
        </span>
        <div className="mb-3 text-white/80 text-center" style={{ fontSize: "clamp(11px,3vw,13px)", lineHeight: 1.25 }}></div>
        <p className="mb-2 text-center text-white font-semibold" style={{ fontSize: "clamp(12px,3.2vw,14px)", lineHeight: 1.3 }}>
          Uncover <span className="text-amber-300">NATIONWIDE</span> incentives + next-steps plan in under a minute.
        </p>
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
                  "rounded-lg border font-bold focus:outline-none focus-visible:ring-2 transition-all select-none shadow-md flex flex-col items-center justify-center text-center",
                  isSelected
                    ? "border-[#ff385c] bg-[#ff385c] text-white shadow-lg"
                    : "border-white/15 bg-white/10 text-white hover:bg-[#ff385c] hover:border-[#ff385c] hover:text-white",
                ].join(" ")}
                style={{
                  minHeight: 62,
                  height: "auto",
                  fontSize: "clamp(14px,3.4vw,16px)",
                  padding: "0.55rem 0.9rem",
                  width: "100%",
                }}
                aria-pressed={isSelected}
                aria-label={chip.label}
                onClick={() => {
                  setSelected(chip.mission);
                  setTimeout(() => router.push(`/choose?mission=${chip.mission}`), 120);
                }}
              >
                <span className="flex flex-col items-center text-center leading-tight">
                  <span className="font-extrabold tracking-tight">
                    {chip.label}
                  </span>
                  {chip.subtitle && (
                    <span className="mt-0.5 text-[11px] font-medium text-white/80">
                      {chip.subtitle}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
        {/* CTA ICON ROW - Share, Refer, Enroll (gold box) */}
        <div className="w-full mt-1">
          <div className="rounded-xl border border-amber-300/80 bg-amber-300/5 px-3 py-0 shadow-[0_0_16px_rgba(251,191,36,0.3)]">
            <p className="text-[0.64rem] font-semibold tracking-wide text-amber-300 text-center mb-0 uppercase">
              Share HomeFront
            </p>
            <div className="flex flex-row items-center justify-center gap-7 pt-0">
              <div className="flex flex-col items-center justify-center text-center">
                <button
                  className="hover:scale-105 transition mx-auto"
                  aria-label="Share"
                  style={{ width: 44, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => setShowShareModal(true)}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400 mx-auto"><path d="M12 19v-7"></path><path d="M5 12l7-7 7 7"></path><rect x="5" y="19" width="14" height="2" rx="1" fill="currentColor" className="opacity-20"></rect></svg>
                </button>
                <span className="text-xs text-white/70 mt-0" style={{ fontSize: '0.6rem', display: 'block', textAlign: 'center' }}>Share</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <button
                  className="hover:scale-105 transition mx-auto"
                  aria-label="Partner Portal"
                  style={{ width: 50, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => router.push('/partner/login?next=/partner')}
                >
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-amber-300 drop-shadow mx-auto"
                  >
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 7v10" />
                    <path d="M9.5 10.5C10 9.5 11 9 12 9s2 .5 2.5 1.5c.5 1-.2 2-1.5 2.5l-1 .3c-1.3.5-2 1.5-1.5 2.5.5 1 1.5 1.5 2.5 1.5s2-.5 2.5-1.5" />
                  </svg>
                </button>
                <span className="text-xs text-amber-300 mt-0" style={{ fontSize: '0.64rem', display: 'block', textAlign: 'center' }}>Join</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <button
                  className="hover:scale-105 transition mx-auto"
                  aria-label="Refer a Friend"
                  style={{ width: 44, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => router.push('/refer')}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 mx-auto"><circle cx="12" cy="7" r="4"></circle><path d="M6 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2"></path><path d="M19 8v6"></path><path d="M22 11h-6"></path></svg>
                </button>
                <span className="text-xs text-white/70 mt-0" style={{ fontSize: '0.6rem', display: 'block', textAlign: 'center' }}>Refer a friend</span>
              </div>
            </div>
          </div>
        </div>
        {/* ShareSheetModal for Share button */}
        <ShareSheetModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
      </div>
    </AppShell>
  );
}
