"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import FlowLayout from "../_components/FlowLayout";

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

      const fullUrl = `/financing-status?${q.toString()}`;

      try {
        router.push(fullUrl);
      } finally {
        setTimeout(() => {
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.startsWith("/financing-status")
          ) {
            window.location.assign(fullUrl);
          }
        }, 250);
      }
    }, 150);
  };

  const canContinue = value.trim().length > 0;

  return (
    <FlowLayout title="Location" subtitle="Enter a City or ZIP to localize incentives.">
      <div className="relative z-50">
        <div className="w-[calc(100%+2.5rem)] -mx-5">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputMode="text"
            autoComplete="postal-code"
            placeholder="City or ZIP (e.g., 92028)"
            className={[
              "w-full rounded-2xl px-4 py-4",
              "bg-white/10 border border-white/15 text-white",
              "placeholder:text-white/35",
              "outline-none",
              "focus:border-white/25 focus:ring-4 focus:ring-[#ff385c]/20",
            ].join(" ")}
          />
        </div>

        <div className="mt-3 w-[calc(100%+2.5rem)] -mx-5">
          <button
            type="button"
            disabled={!canContinue || pressed}
            onClick={goNext}
            className={[
              "cursor-pointer pointer-events-auto block w-full py-4 rounded-2xl",
              "text-[21px] font-extrabold active:scale-[0.99] transition",
              "select-none touch-manipulation",
              "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
              !canContinue || pressed
                ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                : active
                ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]"
                : "border border-white/15 bg-white/10 text-white hover:bg-white/15",
            ].join(" ")}
          >
            Continue
          </button>
        </div>

        <p className="mt-4 text-[11px] text-white/55 pointer-events-none">
        </p>
      </div>
    </FlowLayout>
  );
}
