"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import FlowLayout from "../_components/FlowLayout";

export default function ReferLocationPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [location, setLocation] = useState("");
  const [pressed, setPressed] = useState(false);

  const canContinue = location.trim().length > 0;

  const handleContinue = () => {
    if (!canContinue || pressed) return;

    setPressed(true);

    // Store location in sessionStorage
    if (typeof window !== "undefined") {
      const friend = JSON.parse(sessionStorage.getItem("referral_friend") || "{}");
      sessionStorage.setItem(
        "referral_friend",
        JSON.stringify({ ...friend, location: location.trim() })
      );
    }

    // Preserve mission param
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);

    setTimeout(() => router.push(`/refer-timeline?${q.toString()}`), 120);
  };

  return (
    <FlowLayout title="Location" subtitle="Where is your friend looking?">
      <div className="relative z-50 flex flex-col gap-4">
        <label className="flex flex-col text-left">
          <span className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1.5">
            City or Zip Code
          </span>
          <input
            type="text"
            placeholder="e.g., San Diego, CA or 92101"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canContinue) {
                handleContinue();
              }
            }}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15
                       text-white placeholder:text-white/40
                       focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
            autoFocus
          />
        </label>

        <button
          type="button"
          disabled={!canContinue || pressed}
          onClick={handleContinue}
          className={[
            "w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl text-[21px] font-extrabold transition",
            "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
            "active:scale-[0.99]",
            canContinue && !pressed
              ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)] cursor-pointer"
              : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed",
          ].join(" ")}
        >
          Continue
        </button>
      </div>
    </FlowLayout>
  );
}
