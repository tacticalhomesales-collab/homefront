"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function MatchPreviewPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [pressed, setPressed] = useState(false);

  const goNext = () => {
    if (pressed) return;
    setPressed(true);

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);

    const url = `/review?${q.toString()}`;

    setTimeout(() => {
      try {
        router.push(url);
      } finally {
        setTimeout(() => {
          if (typeof window !== "undefined" && !window.location.pathname.startsWith("/review")) {
            window.location.assign(url);
          }
        }, 250);
      }
    }, 120);
  };

  return (
    <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-4">
      <div className="min-h-[100dvh] flex flex-col items-center text-center pt-8 pb-10">
        <div className="w-full max-w-md relative">
          <div className="mx-auto w-full max-w-[95vw] mt-16 pointer-events-none select-none">
            <img
              src="/homefront-badge.png"
              alt="HomeFront"
              className="w-full h-auto scale-200 origin-center"
              draggable={false}
            />
          </div>

          <div className="-mt-6 flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-4xl font-extrabold tracking-tight leading-none">
              Match Preview
            </h1>
            <p className="mt-3 text-sm font-semibold text-white/70">
              We're finding homes that match your profile.
            </p>
          </div>

          <div className="mt-6 relative z-50">
            <button
              type="button"
              disabled={pressed}
              onClick={goNext}
              className={[
                "cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl",
                "text-[21px] font-extrabold active:scale-[0.99] transition",
                "select-none touch-manipulation",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
                pressed
                  ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                  : "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)] hover:bg-[#ff284d]",
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
