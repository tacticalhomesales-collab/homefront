"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AppShell from "../../components/AppShell";

const TIMELINES = [
  { label: "ASAP", value: "asap" },
  { label: "1-3 months", value: "1-3" },
  { label: "3-6 months", value: "3-6" },
  { label: "6+ months", value: "6+" },
  { label: "Just exploring", value: "exploring" },
];

export default function ReferTimelinePage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [pressed, setPressed] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const onPick = (value: string) => {
    if (pressed) return;

    setActiveLabel(value);
    setPressed(true);

    // Store timeline in sessionStorage
    if (typeof window !== "undefined") {
      const friend = JSON.parse(sessionStorage.getItem("referral_friend") || "{}");
      sessionStorage.setItem(
        "referral_friend",
        JSON.stringify({ ...friend, timeline: value })
      );
    }

    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) q.set(k, v);

    setTimeout(() => router.push(`/refer-consent?${q.toString()}`), 120);
  };

  const TimelineButton = ({ label, value }: { label: string; value: string }) => {
    const isActive = activeLabel === value;

    return (
      <button
        type="button"
        disabled={pressed}
        onClick={() => onPick(value)}
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
    <AppShell>
      <div className="w-full max-w-md relative mx-auto text-center px-4 pt-8 pb-10 flex flex-col gap-3">
        <div className="flex flex-col items-center justify-center pointer-events-none mb-5 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight leading-none">
            Timeline
          </h1>
          <p className="mt-3 text-sm font-semibold text-white/70">
            When is your friend looking to move?
          </p>
        </div>
        <div className="relative z-50 flex flex-col gap-3">
          {TIMELINES.map((t) => (
            <TimelineButton key={t.value} {...t} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
