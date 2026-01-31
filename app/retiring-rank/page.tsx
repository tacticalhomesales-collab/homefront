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
}
