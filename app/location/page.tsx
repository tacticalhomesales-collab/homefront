"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import AppShell from "../../components/AppShell";

export default function LocationPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const initial = useMemo(() => sp.get("location") || "", [sp]);
  const [value, setValue] = useState(initial);
  const [pressed, setPressed] = useState(false);
  const [active, setActive] = useState(false);

  const goNext = () => {
    if (pressed) return;

    const cleaned = value.trim();
    if (!cleaned) return;

    setActive(true);
    setPressed(true);

    // Show red state immediately, then navigate after a short delay
    setTimeout(() => {
      const q = new URLSearchParams();
      for (const [k, v] of sp.entries()) q.set(k, v);
      q.set("location", cleaned);

      // If mission=rent, skip financing-status and go to timeline
      const mission = sp.get("mission");
      const nextPath = mission === "rent" ? "/timeline" : "/financing-status";
      const fullUrl = `${nextPath}?${q.toString()}`;

      try {
        router.push(fullUrl);
      } finally {
        setTimeout(() => {
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.startsWith(nextPath)
          ) {
            window.location.assign(fullUrl);
          }
        }, 250);
      }
    }, 150);
  };

  const canContinue = value.trim().length > 0;

  return (
    <AppShell>
      <div className="w-full max-w-md mx-auto" style={{marginTop: '-0.75rem'}}>
        {/* Title and subtitle */}
        <div className="flex flex-col items-center justify-center pointer-events-none mb-2">
          <h1 className="text-2xl font-extrabold tracking-tight leading-none text-white mb-0.5">
            Location
          </h1>
          <p className="mt-1 text-xs font-semibold text-white/70">
            Enter a City or ZIP to localize incentives.
          </p>
        </div>
        {/* Input and button */}
        <div className="mt-2 relative z-50">
          <div className="w-[calc(100%+2.5rem)] -mx-5">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              inputMode="text"
              autoComplete="postal-code"
              placeholder="City or ZIP (e.g., 92028)"
              className="w-full rounded-2xl px-5 py-4 border border-white/15 bg-white/10 text-white text-[21px] font-extrabold placeholder:text-white/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30"
            />
          </div>
          <div className="mt-3 w-[calc(100%+2.5rem)] -mx-5">
            <button
              type="button"
              disabled={!canContinue || pressed}
              onClick={goNext}
              className={["cursor-pointer pointer-events-auto block w-full py-4 rounded-2xl text-[21px] font-extrabold transition active:scale-[0.99] select-none touch-manipulation focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",!canContinue || pressed? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed": active? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]":"border border-white/15 bg-white/10 text-white hover:bg-white/15 cursor-pointer",].join(" ")}
            >
              Continue
            </button>
          </div>
        </div>
        <p className="mt-5 text-[11px] text-white/45 text-center">
          Not affiliated with any government agency.
        </p>
      </div>
    </AppShell>
  );
}
