"use client";


import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AppShell from "../../components/AppShell";

const RENT_BANDS = ["$3K-$4K", "$4K-$5K", "$5K-$6K", "$6K-$7K", "$7K+", "Prefer not to say"] as const;


export default function RentalNumbersPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [rentBand, setRentBand] = useState("");
  const [pressed, setPressed] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [hasHOA, setHasHOA] = useState<string | null>(null);

  const onPickRent = (value: string) => {
    if (pressed) return;
    setActiveLabel(value);
    setPressed(true);
    setRentBand(value);

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("rent_band", value);
    const href = `/review?${q.toString()}`;
    setTimeout(() => router.push(href), 120);
  };


  const onPickHOA = (value: string) => {
    if (pressed) return;
    setActiveLabel(value);
    setPressed(true);
    setHasHOA(value);

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("rent_band", rentBand);
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
          "cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-1.5 rounded-lg",
          "text-[15px] font-extrabold active:scale-[0.99] transition",
          "select-none touch-manipulation",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30",
          isActive
            ? "bg-[#ff385c] text-white shadow-[0_6px_18px_rgba(255,56,92,0.18)]"
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
          "w-full py-1.5 rounded-lg text-[15px] font-extrabold transition active:scale-[0.99]",
          "select-none touch-manipulation",
          isActive
            ? "bg-[#ff385c] text-white shadow-[0_6px_18px_rgba(255,56,92,0.18)]"
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
    <AppShell>
      <div className="w-full max-w-md mx-auto flex flex-col items-center pt-1" style={{marginTop: '-0.75rem'}}>
        <h1 className="text-xl font-extrabold text-center mb-1">Monthly Rent</h1>
        <div className="text-sm text-white/80 text-center mb-2 font-semibold">Approximate monthly rent income</div>

        {/* Rent Band Selection */}
        <div className="w-full mt-1 grid grid-cols-2 gap-2">
          {RENT_BANDS.map((band) => (
            <button
              key={band}
              type="button"
              onClick={() => onPickRent(band)}
              disabled={pressed}
              className={["cursor-pointer pointer-events-auto block w-full py-2 rounded-lg text-sm font-extrabold active:scale-[0.99] transition select-none touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30",
                activeLabel === band
                  ? "bg-[#ff385c] text-white shadow-[0_4px_10px_rgba(255,56,92,0.18)]"
                  : pressed
                  ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                  : "border border-white/15 bg-white/10 text-white hover:bg-white/15"
              ].join(" ")}
              style={{ fontSize: "clamp(12px,2.5vw,15px)" }}
              aria-pressed={activeLabel === band}
            >
              {band}
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
