"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const RENT_BANDS = ["<$1K", "$1K-$1.5K", "$1.5K-$2K", "$2K-$3K", "$3K+", "Prefer not to say"] as const;
const MORTGAGE_BANDS = ["<$1K", "$1K-$1.5K", "$1.5K-$2K", "$2K-$3K", "$3K+", "No mortgage", "Prefer not to say"] as const;

export default function RentalNumbersPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [rentBand, setRentBand] = useState("");
  const [mortgageBand, setMortgageBand] = useState("");
  const [hasHOA, setHasHOA] = useState("");

  const [pressed, setPressed] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const onPickRent = (value: string) => {
    if (pressed) return;
    setActiveLabel(value);
    setPressed(true);
    setRentBand(value);

    setTimeout(() => {
      setPressed(false);
      setActiveLabel(null);
      setStep(2);
    }, 120);
  };

  const onPickMortgage = (value: string) => {
    if (pressed) return;
    setActiveLabel(value);
    setPressed(true);
    setMortgageBand(value);

    setTimeout(() => {
      setPressed(false);
      setActiveLabel(null);
      setStep(3);
    }, 120);
  };

  const onPickHOA = (value: string) => {
    if (pressed) return;
    setActiveLabel(value);
    setPressed(true);
    setHasHOA(value);

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("rent_band", rentBand);
    q.set("mortgage_band", mortgageBand);
    q.set("has_hoa", value);

    const href = `/rental-needs?${q.toString()}`;
    setTimeout(() => router.push(href), 120);
  };

  const ChoiceButton = ({ label, onClick }: { label: string; onClick: () => void }) => {
    const isActive = activeLabel === label;

    return (
      <button
        type="button"
        disabled={pressed}
        onClick={onClick}
        className={[
          "cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl",
          "text-[21px] font-extrabold active:scale-[0.99] transition",
          "select-none touch-manipulation",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
          isActive
            ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]"
            : pressed
            ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
            : "border border-white/15 bg-white/10 text-white hover:bg-white/15",
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  const GridButton = ({ label, onClick }: { label: string; onClick: () => void }) => {
    const isActive = activeLabel === label;

    return (
      <button
        type="button"
        disabled={pressed}
        onClick={onClick}
        className={[
          "w-full py-4 rounded-2xl text-[18px] font-extrabold transition active:scale-[0.99]",
          "select-none touch-manipulation",
          isActive
            ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]"
            : pressed
            ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
            : "border border-white/15 bg-white/10 text-white hover:bg-white/15 cursor-pointer",
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  return (
    <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-4">
      <div className="min-h-[100dvh] flex flex-col items-center text-center pt-8 pb-10">
        <div className="w-full max-w-md relative">
          {/* Invisible spacer row */}
          <div className="mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[18px] font-extrabold tracking-[-0.02em] text-white/80 opacity-0 pointer-events-none select-none">
            <span>Buy</span>
            <span className="text-white/25">•</span>
            <span>Sell</span>
            <span className="text-white/25">•</span>
            <span>Rent</span>
            <span className="text-white/25">•</span>
            <span>Manage</span>
          </div>

          {/* Logo */}
          <div className="mx-auto w-full max-w-[95vw] mt-16 pointer-events-none select-none">
            <img
              src="/homefront-badge.png"
              alt="HomeFront"
              className="w-full h-auto scale-200 origin-center"
              draggable={false}
            />
          </div>

          {/* Title */}
          <div className="-mt-6 flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-4xl font-extrabold tracking-tight leading-none text-white">
              {step === 1 && "Monthly Rent"}
              {step === 2 && "Monthly Mortgage"}
              {step === 3 && "HOA Fees"}
            </h1>
            <p className="mt-3 text-sm font-semibold text-white/70">
              {step === 1 && "Approximate monthly rent income"}
              {step === 2 && "Approximate monthly mortgage payment"}
              {step === 3 && "Does the property have HOA fees?"}
            </p>
          </div>

          {/* Step 1: Rent Band */}
          {step === 1 && (
            <div className="mt-3 relative z-50">
              <div className="grid grid-cols-2 gap-3">
                {RENT_BANDS.map((band) => (
                  <GridButton key={band} label={band} onClick={() => onPickRent(band)} />
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Mortgage Band */}
          {step === 2 && (
            <div className="mt-2 relative z-50 flex flex-col gap-3">
              {MORTGAGE_BANDS.map((band) => (
                <ChoiceButton key={band} label={band} onClick={() => onPickMortgage(band)} />
              ))}
            </div>
          )}

          {/* Step 3: HOA */}
          {step === 3 && (
            <div className="mt-2 relative z-50 flex flex-col gap-3">
              <ChoiceButton label="Yes" onClick={() => onPickHOA("yes")} />
              <ChoiceButton label="No" onClick={() => onPickHOA("no")} />
            </div>
          )}

          <p className="mt-5 text-[11px] text-white/45">
            Not affiliated with any government agency.
          </p>
        </div>
      </div>
    </main>
  );
}
