"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RetiringRankPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [pressed, setPressed] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const goNext = (retiringRank: string) => {
    if (pressed) return;

    setActiveLabel(retiringRank);
    setPressed(true);

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);

    // Save it explicitly for veterans
    q.set("retiring_rank", retiringRank);

    const nextPath = "/years-of-service";
    const nextUrl = `${nextPath}?${q.toString()}`;

    setTimeout(() => {
      try {
        router.push(nextUrl);
      } finally {
        setTimeout(() => {
          if (
            typeof window !== "undefined" &&
            window.location.pathname !== nextPath
          ) {
            window.location.assign(nextUrl);
          }
        }, 250);
      }
    }, 150);
  };

  const Button = ({ label }: { label: string }) => {
    const isActive = activeLabel === label;

    return (
      <button
        type="button"
        disabled={pressed}
        onClick={() => goNext(label)}
        className={[
          "w-full py-4 rounded-2xl text-[18px] font-extrabold transition active:scale-[0.99]",
          "select-none touch-manipulation",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
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

  const NotSureButton = () => {
    const isActive = activeLabel === "Unknown";
    return (
      <button
        type="button"
        disabled={pressed}
        onClick={() => goNext("Unknown")}
        className={[
          "w-full py-4 rounded-2xl text-[18px] font-extrabold transition active:scale-[0.99]",
          "select-none touch-manipulation",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
          isActive
            ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]"
            : pressed
            ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
            : "bg-white/10 border border-white/15 text-white hover:bg-white/15 cursor-pointer",
        ].join(" ")}
      >
        Not sure
      </button>
    );
  };

  return (
    <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-4">
      <div className="min-h-[100dvh] flex flex-col items-center text-center pt-8 pb-6">
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
            <img
              src="/homefront-badge.png"
              alt="HomeFront"
              className="w-full h-auto scale-200 origin-center"
              draggable={false}
            />
          </div>

          <div className="-mt-6 flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-4xl font-extrabold tracking-tight leading-none text-white">
              Retiring Rank
            </h1>
            <p className="mt-3 text-sm font-semibold text-white/70">
              Select your retiring rank.
            </p>
          </div>

          <div className="mt-2 relative z-50">
            <div className="grid grid-cols-2 gap-3 text-left">
              <Button label="E-1" />
              <Button label="E-2" />
              <Button label="E-3" />
              <Button label="E-4" />
              <Button label="E-5" />
              <Button label="E-6" />
              <Button label="E-7" />
              <Button label="E-8" />
              <Button label="E-9" />
              <Button label="E-9 (SGM/MCPO)" />

              <Button label="W-1" />
              <Button label="W-2" />
              <Button label="W-3" />
              <Button label="W-4" />
              <Button label="W-5" />
              <Button label="Warrant (Other)" />

              <Button label="O-1" />
              <Button label="O-2" />
              <Button label="O-3" />
              <Button label="O-4" />
              <Button label="O-5" />
              <Button label="O-6" />
              <Button label="O-7+" />
              <Button label="Officer (Other)" />

              <div className="col-span-2">
                <NotSureButton />
              </div>
            </div>

            <p className="mt-4 text-[11px] text-white/55 pointer-events-none">
            </p>
          </div>

          <p className="mt-4 text-[11px] text-white/45">
            Not affiliated with any government agency.
          </p>
        </div>
      </div>
    </main>
  );
}
