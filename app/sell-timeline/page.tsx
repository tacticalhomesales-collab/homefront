"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Timeline = { label: string; value: string };

const TIMELINES: Timeline[] = [
  { label: "ASAP (< 1 month)", value: "asap" },
  { label: "1-3 months", value: "1-3mo" },
  { label: "3-6 months", value: "3-6mo" },
  { label: "6+ months", value: "6+mo" },
  { label: "Just exploring", value: "exploring" },
];

export default function SellTimelinePage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [pressed, setPressed] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const onPick = (t: Timeline) => {
    if (pressed) return;

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("sell_timeline", t.value);

    const href = `/sell-motivation?${q.toString()}`;

    setActiveLabel(t.value);
    setPressed(true);

    setTimeout(() => router.push(href), 120);
  };

  const TimelineButton = ({ label, value }: Timeline) => {
    const isActive = activeLabel === value;

    return (
      <button
        type="button"
        disabled={pressed}
        onClick={() => onPick({ label, value })}
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

  return (
    <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-4">
      <div className="min-h-[100dvh] flex flex-col items-center text-center pt-8 pb-10">
        <div className="w-full max-w-md relative">
          <div className="mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[18px] font-extrabold tracking-[-0.02em] text-white/80 opacity-0 pointer-events-none select-none">
            <span>Buy</span>
            <span className="text-white/25">•</span>
            <span>Sell</span>
            <span className="text-white/25">•</span>
            <span>Rent</span>
            <span className="text-white/25">•</span>
            <span>Manage</span>
          </div>
          <div className="mx-auto w-full max-w-[95vw] mt-16 pointer-events-none select-none">
            <div className="flex justify-center items-center w-full" style={{ minHeight: '200px' }}>
              <img
                src="/homefront-badge.png"
                alt="HomeFront"
                className="max-w-[900px] max-h-[450px] object-contain pointer-events-none select-none"
                draggable={false}
              />
            </div>
          </div>

          {/* Title */}
          <div className="-mt-6 flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-4xl font-extrabold tracking-tight leading-none text-white">
              Timeline
            </h1>
            <p className="mt-3 text-sm font-semibold text-white/70">
              When do you plan to sell?
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-2 relative z-50 flex flex-col gap-3">
            {TIMELINES.map((t) => (
              <TimelineButton key={t.value} {...t} />
            ))}
          </div>

          <p className="mt-5 text-[11px] text-white/45">
            Not affiliated with any government agency.
          </p>
        </div>
      </div>
    </main>
  );
}
