"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const BRANCHES = [
  "Army",
  "Marine Corps",
  "Navy",
  "Air Force",
  "Space Force",
  "Coast Guard",
] as const;

export const dynamic = "force-dynamic";

function BranchContent() {
  const router = useRouter();
  const sp = useSearchParams();

  const [pressed, setPressed] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const goNext = (branch: string) => {
    if (pressed) return;

    setActiveLabel(branch);
    setPressed(true);

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);
    q.set("branch", branch);

    const audience = q.get("audience") || "";
    const nextPath = audience === "veteran" ? "/retiring-rank" : "/rank";
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
    }, 120);
  };

  const BranchButton = ({ label }: { label: string }) => {
    const isActive = activeLabel === label;

    return (
      <button
        type="button"
        disabled={pressed}
        onClick={() => goNext(label)}
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
            <img
              src="/homefront-badge.png"
              alt="HomeFront"
              className="w-full h-auto scale-200 origin-center"
              draggable={false}
            />
          </div>

          <div className="-mt-6 flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-4xl font-extrabold tracking-tight leading-none text-white">
              Branch of Service
            </h1>
            <p className="mt-3 text-sm font-semibold text-white/70">
              Select your branch.
            </p>
          </div>

          <div className="mt-2 relative z-50 flex flex-col gap-3">
            {BRANCHES.map((b) => (
              <BranchButton key={b} label={b} />
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

export default function BranchPage() {
  return (
    <Suspense fallback={<main className="min-h-[100dvh] w-full bg-[#0b0f14]" /> }>
      <BranchContent />
    </Suspense>
  );
}
