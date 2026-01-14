"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const OPTIONS = ["0–2", "3–5", "6–10", "11–15", "16–20", "21–25", "26–30", "31+"] as const;

export default function YearsOfServicePage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [pressed, setPressed] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const goNext = (years: string) => {
    if (pressed) return;

    setPressed(true);
    setActive(years);

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("years_of_service", years);

    const url = `/mission?${q.toString()}`;

    setTimeout(() => {
      try {
        router.push(url);
      } finally {
        setTimeout(() => {
          if (typeof window !== "undefined" && !window.location.pathname.startsWith("/mission")) {
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
              Years of Service
            </h1>
            <p className="mt-3 text-sm font-semibold text-white/70">
              Select your total years served.
            </p>
          </div>

          <div className="mt-3 relative z-50">
            <div className="grid grid-cols-2 gap-3">
              {OPTIONS.map((o) => {
                const isActive = active === o;
                return (
                  <button
                    key={o}
                    type="button"
                    disabled={pressed}
                    onClick={() => goNext(o)}
                    className={[
                      "w-full py-4 rounded-2xl text-[18px] font-extrabold transition active:scale-[0.99]",
                      "select-none touch-manipulation",
                      isActive
                        ? "bg-[#ff385c] text-white cursor-not-allowed shadow-[0_10px_30px_rgba(255,56,92,0.25)]"
                        : pressed
                        ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                        : "border border-white/15 bg-white/10 text-white hover:bg-white/15 cursor-pointer",
                    ].join(" ")}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-5 text-[11px] text-white/45">
            Not affiliated with any government agency.
          </p>
        </div>
      </div>
    </main>
  );
}
