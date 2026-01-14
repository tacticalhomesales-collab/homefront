"use client";

import React from "react";

export type StepStage = "idle" | "loading" | "approved";

type LoadingApprovedOverlayProps = {
  stage: StepStage;
};

export default function LoadingApprovedOverlay({ stage }: LoadingApprovedOverlayProps) {
  if (stage === "idle") return null;

  const isApproved = stage === "approved";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0b0f14] shadow-[0_30px_80px_rgba(0,0,0,0.6)] p-6 text-center">
        <div className="mx-auto mb-3 w-full max-w-[160px] opacity-95 pointer-events-none select-none">
          <img src="/homefront-badge.png" alt="HomeFront" className="w-full h-auto" draggable={false} />
        </div>

        <div className="mt-2">
          <p className="text-[18px] font-extrabold tracking-tight text-white">
            {isApproved ? "Approved" : "Loading"}
            {isApproved ? " ✓" : "…"}
          </p>
          <p className="mt-2 text-[12px] font-semibold text-white/60">
            {isApproved ? "Continuing…" : "One moment…"}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={[
              "h-full rounded-full transition-all duration-500",
              isApproved ? "w-full bg-[#22c55e]" : "w-2/3 bg-[#ff385c]",
            ].join(" ")}
          />
        </div>
      </div>
    </div>
  );
}
