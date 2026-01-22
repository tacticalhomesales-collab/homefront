"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Need = { label: string; value: string };

const NEEDS: Need[] = [
  { label: "Tenant Placement", value: "placement" },
  { label: "Full Management", value: "full" },
  { label: "Maintenance Only", value: "maintenance" },
  { label: "Rent Collection", value: "collection" },
  { label: "Lease Enforcement", value: "enforcement" },
  { label: "Not Sure", value: "unsure" },
];

export default function RentalNeedsPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [selected, setSelected] = useState<string[]>([]);
  const [pressed, setPressed] = useState(false);

  const toggleNeed = (value: string) => {
    if (pressed) return;

    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      // Limit to 2
      if (selected.length < 2) {
        setSelected([...selected, value]);
      } else {
        // Replace second one
        setSelected([selected[0], value]);
      }
    }
  };

  const onContinue = () => {
    if (pressed || selected.length === 0) return;

    setPressed(true);

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("rental_needs", selected.join(","));

    const href = `/review?${q.toString()}`;
    setTimeout(() => router.push(href), 120);
  };

  const NeedButton = ({ label, value }: Need) => {
    const isSelected = selected.includes(value);

    return (
      <button
        type="button"
        disabled={pressed}
        onClick={() => toggleNeed(value)}
        className={[
          "cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl",
          "text-[21px] font-extrabold active:scale-[0.99] transition",
          "select-none touch-manipulation",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
          isSelected
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
              Management Needs
            </h1>
            <p className="mt-3 text-sm font-semibold text-white/70">
              Pick your top 2 priorities
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-2 relative z-50 flex flex-col gap-3">
            {NEEDS.map((n) => (
              <NeedButton key={n.value} {...n} />
            ))}
          </div>

          {/* Continue Button */}
          <div className="mt-5 w-[calc(100%+2.5rem)] -mx-5">
            <button
              type="button"
              disabled={selected.length === 0 || pressed}
              onClick={onContinue}
              className={[
                "w-full py-4 rounded-2xl text-[21px] font-extrabold transition active:scale-[0.99]",
                "select-none touch-manipulation",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
                selected.length === 0 || pressed
                  ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                  : "border border-white/15 bg-white/10 text-white hover:bg-white/15 cursor-pointer",
              ].join(" ")}
            >
              Continue
            </button>
          </div>

          <p className="mt-5 text-[11px] text-white/45">
            Not affiliated with any government agency.
          </p>
        </div>
      </div>
    </main>
  );
}
